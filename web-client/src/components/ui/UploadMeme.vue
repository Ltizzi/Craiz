<template lang="">
  <div class="flex-flex-col -mt-5 h-auto">
    <h1 class="py-2 text-center text-xl font-bold md:text-lg lg:text-2xl">
      Subir un nuevo meme
    </h1>
    <div
      class="flex h-auto w-full flex-col items-center gap-10 md:flex-row md:gap-0"
    >
      <div>
        <div class="flex w-full items-center justify-center">
          <label
            for="dropzone-file"
            class="dark:hover:bg-bray-800 flex h-72 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <img
              :src="memeImage"
              v-if="memeImage"
              ref="meme"
              class="mx-auto h-64 w-4/5 object-contain md:h-72 lg:h-72 lg:w-4/5"
            />
            <div
              class="flex flex-col items-center justify-center pb-6 pt-5"
              v-if="!memeImage"
            >
              <svg
                aria-hidden="true"
                class="mb-3 h-10 w-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span class="font-semibold">Click para elegir una imagen</span>
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              class="hidden"
              @change="handleFileInput"
            />
          </label>
        </div>
        <span
          v-if="state.errors.fileToUpload"
          class="mx-auto text-center font-bold text-red-500"
          >{{ state.errors.fileToUpload }}</span
        >

        <!-- <div v-else class="mx-auto my-2 h-72 w-4/5 bg-gray-200 lg:w-full"></div> -->
        <div
          v-if="selectedTags"
          class="flew-row my-2 flex w-96 flex-wrap justify-evenly"
        >
          <span class="h-7 pb-2"></span>
          <BaseTag
            v-for="tag in selectedTags"
            :key="tag.tagId"
            class="mb-0.5 mt-0.5"
            :class="tag.class"
            :clickeable="true"
            >{{ tag.name }}</BaseTag
          >
        </div>
      </div>

      <div class="flex h-40 flex-col justify-center gap-0">
        <h2 class="mb-0.5 ml-10 mt-2 text-base font-bold lg:text-lg">
          Elige los tags del meme:
        </h2>
        <div class="flex w-fit flex-col items-center justify-center">
          <SelectTagNav />
          <div class="h-32">
            <div
              class="flew-row flex w-96 flex-wrap justify-evenly px-5 py-2 md:w-96"
            >
              <BaseTag
                v-for="tag in tags"
                :key="tag.tagId"
                class="mb-1"
                :class="tag.class"
                :clickeable="true"
                @click="selecTag(tag)"
                v-if="state.activeTab == 'basic'"
                >{{ tag.name }}</BaseTag
              >
            </div>
            <CustomTag class="mx-5 pb-10" v-if="state.activeTab == 'custom'" />
          </div>
        </div>
      </div>
    </div>

    <div
      class="flex flex-row items-center justify-evenly pt-14 md:pt-2 lg:pt-2"
    >
      <BaseButton
        @click="uploadMeme"
        class="relative rounded-lg bg-violet-500 px-3 py-1 text-base font-bold text-white lg:text-lg"
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
  import { computed, onBeforeMount, reactive, ref } from "vue";
  import BaseSpinner from "../common/BaseSpinner.vue";
  import BaseButton from "../common/BaseButton.vue";
  import BaseTag from "../common/BaseTag.vue";
  import CustomTag from "./CustomTagUI.vue";
  import SelectTagNav from "./SelectTagNav.vue";
  import { useUserStore } from "@/store";
  import { useTagStore } from "@/store/tags";
  import { useMemesStore } from "@/store/memes";
  import { defineEmits } from "vue";
  import EventBus from "@/utils/EventBus";

  import axios from "axios";
  import { API_URL } from "@/main";
  import { Meme } from "@/utils/models";
  import { useRoute } from "vue-router";

  import { useField } from "vee-validate";
  import { required } from "@vee-validate/rules";

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

  let isComment = ref(false);

  let parentMemeId = ref();

  EventBus.on("newComment", () => {
    isComment.value = true;
  });

  // TAG NAVIGATION
  const state = reactive({
    activeTab: "basic",
    fileToUpload: "",
    errors: {
      fileToUpload: "",
    },
  });

  EventBus.on("basicTags", () => {
    state.activeTab = "basic";
  });

  EventBus.on("customTags", () => {
    state.activeTab = "custom";
  });

  //validations

  const { value: errors } = useField("fileToUpload", required);

  const isFormValid = computed(() => {
    return !Object.values(state.errors).some((error) => error !== null);
  });

  //file handler

  //let fileToUpload: any;

  function handleFileInput(event: any) {
    memeImage.value = null;
    state.fileToUpload = "";
    state.errors.fileToUpload = "";
    const file = event.target.files[0];
    console.log(file);

    if (!/\.(jpeg|png|jpg|jfif|webp|gif)$/i.test(file.name)) {
      state.errors.fileToUpload = "El archivo debe ser de imagen";
      state.fileToUpload = "";
      return;
    }
    state.errors.fileToUpload = "";
    state.fileToUpload = file;
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
    if (selectedTags.value.length < 4 && !selectedTags.value.includes(tag)) {
      if (!selectedTags.value.includes(tag)) {
        selectedTags.value.push(tag);
      } else {
        selectedTags.value = selectedTags.value.filter(
          (selTag: any) => selTag.tagId != tag.tagId
        );
      }
    } else {
      errors.value = "Máximo cuatro tags ";
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
    uploadFailed.value = false;
    state.errors.fileToUpload = "";
    //prepara imagen para ser subida a la ThumbSnap
    if (state.fileToUpload == "") {
      state.errors.fileToUpload = "Se requiere una image";
      state.fileToUpload = "";
      isUploading.value = false;
      uploadFailed.value = true;
      setTimeout(() => {
        uploadFailed.value = false;
      }, 1500);
      return;
    }
    const formData = new FormData();
    formData.append("file", state.fileToUpload);
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

  //CUSTOM TAG

  EventBus.on("createdCustom", (tag: any) => {
    if (selectedTags.value.length < 4 && !selectedTags.value.includes(tag)) {
      selectedTags.value.push(tag);
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
    @apply bg-gradient-to-r from-amber-400 via-pink-500 to-emerald-400;
  }
</style>
