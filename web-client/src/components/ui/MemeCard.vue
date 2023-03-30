<template lang="">
  <div
    class="container relative my-2 flex flex-col rounded-xl border-2 p-5 shadow-md sm:w-full md:w-10/12 lg:w-11/12"
    v-if="isLoaded"
  >
    <div
      v-if="isLoop"
      class="absolute ml-12 flex flex-row gap-1 text-sm font-bold text-gray-400"
    >
      <font-awesome-icon
        icon="fa-solid fa-arrows-rotate"
        class="mt-1 text-xs text-black"
      />
      <h4 v-if="userIsLooper">Loopeaste este meme</h4>
      <h4 v-else>{{ looper }} loopeo este meme</h4>
    </div>
    <div class="flex flex-row items-center justify-between">
      <div class="container flex flex-row items-center py-1 lg:my-1">
        <img
          :src="uploader.avatar"
          alt=""
          class="mr-2 h-10 w-10 rounded-full object-cover md:h-12 md:w-12"
        />
        <!-- <router-link
          :to="{ name: 'TheProfile', params: { username: uploader.username } }"
        > -->

        <h3
          class="lg:text-2x2 ml-2 font-bold hover:cursor-pointer sm:text-xl lg:mt-3"
          @click="goProfile"
        >
          {{ uploader.nickname }}
        </h3>
        <!-- </router-link> -->

        <h4 class="pl-2 text-sm italic sm:text-base lg:mt-3 lg:text-lg">
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
        <div
          class="flex w-7/12 flex-row items-center justify-between lg:w-7/12"
        >
          <LikeButton
            :memeId="props.data.memeId"
            :userId="userId"
            :meme="props.data"
          ></LikeButton>
          <LoopButton
            :memeId="props.data.memeId"
            :userId="userId"
            :loopCounter="props.data.loopCounter"
            :userIsLooper="userIsLooper"
          ></LoopButton>

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
            :class="tag.toLowerCase().replaceAll(/\s/g, '')"
            :name="tag"
            class="my-auto mr-1"
            >{{ tag }}</BaseTag
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { onBeforeMount, ref, watch } from "vue";
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
  import { useRoute } from "vue-router";

  const memesStore = useMemesStore();
  const userStore = useUserStore();
  const route = useRoute();

  let userId = userStore.userId;
  const uploader: any = ref({});

  //loop dom values
  const isLoop = ref(false);
  const userIsLooper = ref(false);
  const looper = ref("");

  const props = defineProps<{
    data: {
      memeId: number;
      uploader: number;
      createdAt: Date;
      imgUrl: string;
      tags: Array<string>;
      likedBy: Array<any>;
      loopersId: Array<number>;
      loopersNicknames: Array<string>;
      comments: Array<any>;
      loopCounter: number;
      likeCounter: number;
    };
  }>();
  const isLoaded = ref(false);

  let id = ref();
  let lowerCaseTags = ref<string[]>([]);
  // let memeToProps = ref();

  async function openMeme(meme: Meme) {
    let rutaId = Number(route.query.id);
    if (meme.memeId != rutaId) {
      isLoaded.value = false;
      memesStore.setMeme(meme);
      // memeToProps.value = meme;
      console.log("//////********/*******/*/*/**");
      console.log(meme);
      id.value = meme.memeId;
      await memesStore.fetchCommentsById(id.value);
      EventBus.emit("reloadMemes", id.value);
      EventBus.emit("reloadComments", { id: meme.memeId });
      console.log("la id del comment es: ", meme.memeId);
      router.push(`/meme?id=${meme.memeId}`); //props.data.memeId
      isLoaded.value = true;
    }
  }

  async function openDropdown() {
    await memesStore.fetchMemeById(props.data.memeId);
  }

  function goProfile() {
    router.replace(`/${uploader.value.username}`);
  }

  // watch(
  //   () => props.data.loopersNicknames,
  //   (newValue: any) => {
  //     let user = userStore.profileUser as User;
  //     if (newValue.includes(user.nickname)) {
  //       userIsLooper.value = true;
  //     }
  //   }
  // );

  onBeforeMount(async () => {
    const uploaderData = await axios.get(
      `${API_URL}user/byId?id=${props.data.uploader}`
      // `http://localhost:4246/v1/user/byId?id=${props.data.uploader}`
    );
    if (uploaderData) {
      uploader.value = uploaderData.data;
    }

    lowerCaseTags.value = props.data.tags;

    //loop dom values
    let user = userStore.user as User;
    let loopersNicknames = props.data.loopersNicknames;
    if (user) {
      if (loopersNicknames.includes(user.nickname)) {
        userIsLooper.value = true;
      }
    }
    if (props.data.loopersId.length > 0) {
      isLoop.value = true;
    }
    if (isLoop.value) {
      looper.value = loopersNicknames[loopersNicknames.length - 1];
    }

    //everything is OK, lets load the meme!
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
