<template lang="">
  <div class="w-full">
    <h1 class="py-2 text-center text-2xl font-bold">Upload new meme</h1>

    <img
      :src="memeImage"
      v-if="memeImage"
      ref="meme"
      class="mx-auto h-96 w-4/5 object-contain"
    />
    <div v-else class="my-2 h-72 w-full bg-gray-200"></div>
    <div
      v-if="selectedTags"
      class="flew-row flex w-96 flex-wrap justify-evenly"
    >
      <BaseTag
        v-for="tag in selectedTags"
        :key="tag.tagId"
        class="mb-1"
        :class="tag.name"
        >{{ tag.name }}</BaseTag
      >
    </div>
    <h3 class="mt-3 mb-2 text-lg font-bold">
      Pick a image file from your local storage:
    </h3>
    <input type="file" ref="fileInput" @change="handleFileInput" class="my-3" />

    <div class="flex flex-col justify-center">
      <h2 class="mt-3 mb-2 text-lg font-bold">Pick meme tags:</h2>
      <div class="flew-row flex w-96 flex-wrap justify-evenly">
        <BaseTag
          v-for="tag in tags"
          :key="tag.tagId"
          class="mb-1"
          :class="tag.name"
          @click="selecTag(tag)"
          >{{ tag.name }}</BaseTag
        >
      </div>
    </div>
    <div class="flex flex-row justify-evenly">
      <BaseButton
        @click="uploadMeme"
        class="rounded-lg bg-green-500 py-1 px-3 text-lg font-bold text-white"
        >Subir Meme</BaseButton
      >
    </div>
  </div>
</template>
<script setup lang="ts">
  import { onBeforeMount, ref, inject, InjectionKey } from "vue";
  import BaseButton from "../common/BaseButton.vue";
  import BaseTag from "../common/BaseTag.vue";
  import { useUserStore } from "@/store";
  import { useTagStore } from "@/store/tags";
  import { useMemesStore } from "@/store/memes";
  import { defineEmits } from "vue";
  import axios from "axios";
  import { API_URL } from "@/main";
  // import { appContext } from "@/main";

  const userStore = useUserStore();
  const tagStore = useTagStore();
  const memeStore = useMemesStore();

  const emits = defineEmits({
    closeModal: () => true,
  });

  // const emit = inject(appContext as InjectionKey<any>).emit;

  const user = userStore.user;

  const tags = ref(tagStore.tags);
  let selectedTags = ref<any[]>([]);
  selectedTags.value = [];

  const memeImage = ref();
  let fileToUpload: any;

  function handleFileInput(event: any) {
    const file = event.target.files[0];
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

  async function uploadMeme() {
    //prepara imagen para ser subida a la ThumbSnap
    const formData = new FormData();
    console.log(fileToUpload);
    formData.append("file", fileToUpload);
    console.log(formData);
    const response = await axios.post(`${API_URL}utils/uploadImg`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    const selTags = selectedTagsToStringArray();
    const memeData = {
      uploader: userStore.userId,
      imgUrl: response.data.url,
      tags: selTags,
      isComment: false,
    };
    console.log(memeData);
    const res = await axios.post(`${API_URL}meme/new`, memeData, {
      withCredentials: true,
    });
    if (res.status == 201) {
      memeStore.fetchMemesWoC();
      // emit("reloadList", true);
      emits("closeModal");
      location.reload(); // FIX MOMENTANEO
    } else {
      console.log("error al subir la imagen");
    }
  }

  onBeforeMount(async () => {
    await tagStore.fetchTags();
    tags.value = tagStore.tags;
    console.log(tags.value);
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
</style>
