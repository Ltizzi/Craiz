<template lang="">
  <div
    class="container my-2 flex flex-col rounded-xl border-2 p-5 shadow-md sm:w-full md:w-10/12 lg:w-11/12"
    v-if="isLoaded"
  >
    <div class="flex flex-row justify-between">
      <div class="xs:w-10 container flex flex-row lg:my-1">
        <img :src="uploader.avatar" alt="" class="mr-2 w-10 sm:w-10 md:w-12" />
        <!-- <router-link
          :to="{ name: 'TheProfile', params: { username: uploader.username } }"
        > -->
        <h3
          class="lg:text-2x2 ml-1 pt-0.5 font-bold hover:cursor-pointer sm:text-xl lg:mt-3"
          @click="goProfile"
        >
          {{ uploader.nickname }}
        </h3>
        <!-- </router-link> -->

        <h4 class="pt-1 pl-2 text-lg italic sm:text-base lg:mt-3 lg:text-lg">
          @{{ uploader.username }}
        </h4>
      </div>
      <MemeDropdown
        @click="openDropdown()"
        :memeId="props.data.memeId"
      ></MemeDropdown>
    </div>

    <!-- <h5 class="text-md pt-3 pl-2 italic">{{ props.data.createdAt }}</h5> -->
    <div class="flex flex-col sm:mx-1 lg:mx-12">
      <img :src="props.data.imgUrl" alt="" class="mx-auto w-fit rounded-3xl" />

      <div class="flex h-12 flex-row justify-between">
        <div class="flex w-7/12 flex-row justify-between lg:w-7/12">
          <LikeButton :memeId="props.data.memeId" :userId="userId"></LikeButton>
          <LoopButton :memeId="props.data.memeId" :userId="userId"></LoopButton>

          <CommentIcon
            :commentCounter="props.data.commentsCounter"
            @click="openMeme(props.data)"
            class="hover:cursor-pointer"
          ></CommentIcon>

          <ShareDropdown></ShareDropdown>
        </div>

        <div class="flex w-4/12 flex-wrap justify-start lg:justify-center">
          <BaseTag
            v-for="(tag, index) in lowerCaseTags"
            :key="index"
            :class="tag.toLowerCase()"
            class="my-auto mr-1"
            >{{ tag }}</BaseTag
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { onBeforeMount, ref } from "vue";
  import { useMemesStore } from "@/store/memes";
  import { useUserStore } from "@/store";
  import router from "@/router";
  import CommentIcon from "../common/CommentIcon.vue";
  import LikeButton from "../common/LikeButton.vue";
  import BaseTag from "../common/BaseTag.vue";
  import LoopButton from "../common/LoopButton.vue";
  import MemeDropdown from "./MemeDropdown.vue";
  import ShareDropdown from "./ShareDropdown.vue";
  import axios from "axios";
  import { Meme, User } from "@/utils/models";
  import { API_URL } from "@/main";
  import EventBus from "@/utils/EventBus";

  const memesStore = useMemesStore();
  const userStore = useUserStore();

  let userId = userStore.userId;
  const uploader: any = ref({});
  const props = defineProps<{
    data: {
      memeId: number;
      uploader: number;
      createdAt: Date;
      imgUrl: string;
      tags: Array<string>;
      likedBy: Array<any>;
      comments: Array<any>;
    };
  }>();
  const isLoaded = ref(false);
  let id = ref();
  let lowerCaseTags = ref<string[]>([]);

  async function openMeme(meme: Meme) {
    memesStore.setMeme(meme);
    console.log("//////********/*******/*/*/**");
    console.log(meme);
    id.value = meme.memeId;
    await memesStore.fetchCommentsById(id.value);
    EventBus.emit("reloadComments", { id: meme.memeId });
    router.push(`/meme?id=${meme.memeId}`); //props.data.memeId
  }

  async function openDropdown() {
    await memesStore.fetchMemeById(props.data.memeId);
  }

  function goProfile() {
    router.replace(`/${uploader.value.username}`);
  }

  onBeforeMount(async () => {
    const uploaderData = await axios.get(
      `${API_URL}user/byId?id=${props.data.uploader}`
      // `http://localhost:4246/v1/user/byId?id=${props.data.uploader}`
    );
    if (uploaderData) {
      uploader.value = uploaderData.data;
    }

    lowerCaseTags.value = props.data.tags;
    isLoaded.value = true;
    EventBus.emit("isLoaded");
    // console.log("la id del meme es:");
    // console.log(props.data.memeId);
    memesStore.fetchMemeById(props.data.memeId);
    if (memesStore.id) {
      id.value = memesStore.id;
      memesStore.fetchCommentsById(id.value);
    }
  });
</script>
