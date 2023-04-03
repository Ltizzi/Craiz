<template lang="">
  <div class="w-full items-center">
    <h1 class="py-1 text-center text-xl font-bold lg:text-2xl">
      Upload new meme
    </h1>

    <img
      :src="memeImage"
      v-if="memeImage"
      ref="meme"
      class="lg:4/5 mx-auto h-72 w-4/5 object-contain md:h-96 lg:h-96"
    />
    <div v-else class="my-2 mx-auto h-72 w-4/5 bg-gray-200 lg:w-full"></div>
    <div
      v-if="selectedTags"
      class="flew-row flex w-96 flex-wrap justify-evenly"
    >
      <BaseTag
        v-for="tag in selectedTags"
        :key="tag.tagId"
        class="mb-0.5 mt-0.5"
        :class="tag.class"
        :clickeable="true"
        >{{ tag.name }}</BaseTag
      >
    </div>
    <h3 class="mt-1 mb-1 text-center text-base font-bold lg:text-lg">
      Pick a image file from your local storage:
    </h3>
    <input
      type="file"
      ref="fileInput"
      @change="handleFileInput"
      class="my-2 ml-10"
    />

    <div class="flex flex-col justify-center gap-0">
      <h2 class="mt-2 mb-0.5 ml-10 text-base font-bold lg:text-lg">
        Pick meme tags:
      </h2>
      <div class="flew-row flex w-96 flex-wrap justify-evenly px-5 py-2">
        <BaseTag
          v-for="tag in tags"
          :key="tag.tagId"
          class="mb-1"
          :class="tag.class"
          :clickeable="true"
          @click="selecTag(tag)"
          >{{ tag.name }}</BaseTag
        >
      </div>
    </div>
    <div class="flex flex-row items-center justify-center">
      <BaseButton
        @click="uploadMeme"
        class="relative rounded-lg bg-green-500 py-1 px-3 text-base font-bold text-white lg:text-lg"
        >Subir Meme
      </BaseButton>

      <BaseSpinner class="absolute right-28" v-if="isUploading" />
      <font-awesome-icon
        icon="fa-solid fa-circle-check"
        class="absolute right-28 rounded-full bg-green-600 p-1 text-2xl text-white"
        v-show="uploadComplete"
      />
      <font-awesome-icon
        icon="fa-solid fa-circle-xmark"
        class="absolute right-28 rounded-full bg-red-600 p-1 text-2xl text-white"
        v-show="uploadFailed"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
  import { onBeforeMount, ref } from "vue";
  import BaseSpinner from "../common/BaseSpinner.vue";
  import BaseButton from "../common/BaseButton.vue";
  import BaseTag from "../common/BaseTag.vue";
  import { useUserStore } from "@/store";
  import { useTagStore } from "@/store/tags";
  import { useMemesStore } from "@/store/memes";
  import { defineEmits } from "vue";
  import EventBus from "@/utils/EventBus";

  import axios from "axios";
  import { API_URL } from "@/main";
  import { Meme } from "@/utils/models";
  import { useRoute } from "vue-router";

  const userStore = useUserStore();
  const tagStore = useTagStore();
  const memeStore = useMemesStore();

  const emits = defineEmits({
    closeModal: () => true,
  });

  const tags = ref(tagStore.tags);
  let selectedTags = ref<any[]>([]);
  selectedTags.value = [];

  const memeImage = ref();
  let fileToUpload: any;

  let isComment = ref(false);

  let parentMemeId = ref();

  EventBus.on("newComment", () => {
    isComment.value = true;
  });

  function handleFileInput(event: any) {
    const file = event.target.files[0];
    console.log(file);
    fileToUpload = file;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target) {
        memeImage.value = event.target.result;
      } else {
        console.error("Select a file!");
        return;
      }
    };
    reader.readAsDataURL(file);
  }

  function selecTag(tag: any) {
    if (!selectedTags.value.includes(tag)) {
      selectedTags.value.push(tag);
    } else {
      selectedTags.value = selectedTags.value.filter(
        (selTag: any) => selTag.tagId != tag.tagId
      );
    }
  }

  function selectedTagsToStringArray() {
    const names: Array<string> = [];
    selectedTags.value.forEach((selTag: any) => {
      names.push(selTag.name);
    });

    return names;
  }

  //spinner and complete/fail icons and handle upload

  const isUploading = ref(false);
  const uploadComplete = ref(false);
  const uploadFailed = ref(false);
  const route = useRoute();

  async function uploadMeme() {
    isUploading.value = true;

    //prepara imagen para ser subida a la ThumbSnap
    const formData = new FormData();
    formData.append("file", fileToUpload);
    const response = await axios.post(`${API_URL}utils/uploadImg`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    const selTags = selectedTagsToStringArray();

    let memeData = {
      uploader: userStore.userId,
      imgUrl: response.data.url,
      tags: selTags,
      isComment: false,
      parentMeme: null,
    };

    if (isComment.value == true) {
      //post a new comment
      memeData.isComment = true;
      memeData.parentMeme = parentMemeId.value;
      const res = await axios.post(
        `${API_URL}meme/comment?id=${parentMemeId.value}`,
        memeData,
        {
          withCredentials: true,
        }
      );
      if (res.status == 201) {
        isUploading.value = false;
        uploadComplete.value = true;
        await memeStore.fetchCommentsById(parentMemeId.value);
        setTimeout(() => {
          EventBus.emit("reloadComments", { id: parentMemeId.value });
          emits("closeModal");
        }, 1000);
      } else {
        isUploading.value = false;
        uploadFailed.value = true;
        console.log("error al subir la imagen");
      }
    } else {
      //post a new meme
      const res = await axios.post(`${API_URL}meme/new`, memeData, {
        withCredentials: true,
      });
      if (res.status == 201) {
        isUploading.value = false;
        uploadComplete.value = true;
        await memeStore.fetchMemesWoC();
        setTimeout(() => {
          EventBus.emit("reloadMemes");
          emits("closeModal");
        }, 1000);
      } else {
        isUploading.value = false;
        uploadFailed.value = true;
        console.log("error al subir la imagen");
      }
    }
  }

  onBeforeMount(async () => {
    uploadComplete.value = false;
    uploadFailed.value = false;
    isUploading.value = false;
    await tagStore.fetchTags();
    tags.value = tagStore.tags;
    let parentMeme = memeStore.parentMeme as Meme;

    if (parentMeme.memeId !== undefined) {
      isComment.value = true;
      parentMemeId.value = parentMeme.memeId;
      // console.log("is comment:", isComment.value);
      // console.log("parent id:", parentMemeId.value);
    }
    if (route.query.id) {
      let parentId = parseInt(route.query.id as string);
      isComment.value = true;
      parentMemeId.value = parentId;
      console.log(parentId);
    }
  });
</script>
<style>
  .sports {
    @apply bg-sky-400;
  }
  .fun {
    @apply bg-orange-400;
  }
  .wholesome {
    @apply bg-emerald-400;
  }
  .justbad {
    @apply bg-red-400;
  }
  .dadmeme {
    @apply bg-amber-700;
  }
  .auntmeme {
    @apply bg-gray-700;
  }
  .emo {
    @apply bg-pink-600;
  }
  .trash {
    @apply bg-slate-800;
  }
  .classic {
    @apply bg-purple-500;
  }
  .celeb {
    @apply bg-fuchsia-500;
  }
  .art {
    @apply bg-lime-500;
  }
  .plus18 {
    @apply bg-rose-600;
  }
  .politics {
    @apply bg-fuchsia-900;
  }
  .random {
    @apply bg-amber-400;
  }
  .custom {
    @apply bg-gradient-to-r from-orange-400 via-pink-500 to-violet-600;
  }
</style>
