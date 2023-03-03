<template lang="">
  <div class="container my-3 flex w-5/6 flex-col border-2 p-5 shadow-md">
    <div class="container flex flex-row">
      <img :src="user.avatar" alt="" class="mr-2 w-12" />
      <h3 class="ml-1 pt-1 text-2xl font-bold">{{ user.nickname }}</h3>
      <h4 class="pt-2 pl-2 text-lg italic">@{{ user.username }}</h4>
    </div>
    <!-- <h5 class="text-md pt-3 pl-2 italic">{{ props.data.createdAt }}</h5> -->
    <div class="mx-12 flex flex-col">
      <img :src="props.data.imgUrl" alt="" class="w-fit rounded-3xl" />

      <div class="flex h-12 flex-row justify-between">
        <LikeButton
          :memeId="props.data.memeId"
          :userId="props.data.uploader"
        ></LikeButton>
        <CommentIcon :commentCounter="props.data.comments.length"></CommentIcon>
        <BaseTag
          v-for="(tag, index) in lowerCaseTags"
          :key="index"
          :class="tag.toLowerCase()"
          class="my-auto"
          >{{ tag }}</BaseTag
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { onMounted, ref } from "vue";
  import { useMemesStore } from "@/store/memes";
  import CommentIcon from "../common/CommentIcon.vue";
  import LikeButton from "../common/LikeButton.vue";
  import BaseTag from "../common/BaseTag.vue";
  import axios from "axios";

  const memesStore = useMemesStore();

  const user = ref({});
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
  let lowerCaseTags = ref<string[]>([]);

  onMounted(async () => {
    const userData = await axios.get(
      `http://localhost:4246/v1/user/byId?id=${props.data.uploader}`
    );
    if (userData) {
      user.value = userData.data;
    }

    lowerCaseTags.value = props.data.tags;
    isLoaded.value = true;
    console.log("la id del meme es:");
    console.log(props.data.memeId);
    memesStore.fetchMemeById(props.data.memeId);
  });
</script>
