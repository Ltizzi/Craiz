<template lang="">
  <div class="my-3 flex w-1/3 flex-col border-2 p-5 shadow-md">
    <div class="flex flex-row">
      <img :src="`${userInfo.avatar}`" alt="" class="mr-2 w-12" />
      <h3 class="ml-1 pt-1 text-2xl font-bold">{{ userInfo.name }}</h3>
      <h4 class="pt-2 pl-2 text-lg italic">{{ userInfo.username }}</h4>
      <h5 class="text-md pt-3 pl-2 italic">{{ userInfo.createdAt }}</h5>
    </div>
    <div class="mx-12 flex flex-col">
      <img :src="userInfo.imgURL" alt="" class="w-fit" />
      <div class="flex h-12 flex-row justify-between">
        <LikeButton></LikeButton>
        <BaseTag class="classic my-auto">Classic</BaseTag>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, Ref } from "vue";
  import LikeButton from "../common/LikeButton.vue";
  import BaseTag from "../common/BaseTag.vue";

  const userInfo: Object = ref({
    name: "Leo",
    username: "@ltizzi",
    avatar: "./assets/img/user.png",
    createdAt: "14/2/2023",
    imgURL: "./assets/img/hiworld.jpg",
    comments: [],
    tags: [],
    template: "Red dres girl",
  });
</script>
