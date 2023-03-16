<template lang="">
  <div
    class="relative flex w-full flex-col items-center justify-center"
    v-if="isLoaded"
  >
    <button
      class="fixed right-12 top-3/4 z-50 w-10 animate-bounce rounded-full bg-green-900 py-1 px-1 font-bold text-white shadow-lg shadow-gray-700 duration-500 hover:scale-105 hover:cursor-pointer hover:bg-green-600 hover:transition-transform active:animate-ping after:active:animate-ping lg:right-1/3"
      @click="scrollToParent"
      v-show="parentOutOfView"
    >
      <font-awesome-icon
        icon="fa-solid fa-circle-chevron-up"
        class="text-3xl"
      />
    </button>

    <button
      class="fixed left-16 top-3/4 z-50 w-10 animate-bounce rounded-full bg-teal-900 py-1 px-1 font-bold text-white shadow-lg shadow-gray-700 duration-500 hover:scale-105 hover:cursor-pointer hover:bg-teal-500 hover:transition-transform active:animate-ping after:active:animate-ping lg:left-1/3"
      v-if="isComment"
      @click="backToParent"
    >
      <font-awesome-icon
        icon="fa-solid fa-circle-chevron-left"
        class="text-3xl"
      />
    </button>

    <div class="mx-auto flex flex-col justify-center">
      <MemeCard
        :data="meme"
        class="mx-auto"
        id="parent"
        ref="parent"
      ></MemeCard>

      <PostCommentButton :memeId="meme.memeId" />
      <CommentsView
        class="mx-auto"
        :comments="comments"
        :memeId="meme.memeId"
      ></CommentsView>
    </div>
  </div>
  <div class="mx-auto my-auto flex items-center justify-center" v-else>
    <BaseSpinner />
  </div>
</template>
<script setup lang="ts">
  import BaseButton from "@/components/common/BaseButton.vue";
  import MemeCard from "@/components/ui/MemeCard.vue";
  import CommentsView from "@/components/layout/CommentsView.vue";
  import PostCommentButton from "@/components/ui/PostCommentButton.vue";
  import BaseSpinner from "@/components/common/BaseSpinner.vue";
  import { onBeforeMount, onMounted, reactive, ref, watch } from "vue";
  import { useRoute } from "vue-router";
  import { useMemesStore } from "@/store/memes";
  import axios from "axios";
  import { API_URL } from "@/main";
  import EventBus from "@/utils/EventBus";
  import router from "@/router";
  import { Meme } from "@/utils/models";

  const memesStore = useMemesStore();
  const route = useRoute();

  //evento necesario para ir al home

  const goHome = ref(false);

  EventBus.on("goHome", () => {
    goHome.value = true;
  });

  //memes y coments

  let meme: any = reactive({});
  let comments = ref([]);
  let memeId: any;

  const isLoaded = ref(false);

  //recarga los comentarios y el meme

  EventBus.on("reloadMemes", async (e: any) => {
    isLoaded.value = false;
    await memesStore.fetchMemeById(e.id);
    meme = memesStore.memeById;
    await memesStore.fetchCommentsById(e.id);
    comments.value = memesStore.comments;
    isLoaded.value = true;
  });

  //vigila la difierencia de la ruta
  watch(
    () => route.params,
    async (params, preParams) => {
      console.log("****PARAMS***");
      console.log(params);
      if (goHome.value || goBack.value || params.username || params.id) {
        //por esto es necesaria, la ruta cambiaba pero se activaba el el watcher
        params = preParams;
        if (goBack.value) {
          isLoaded.value = false;
          memeId = route.query.id;
          await memesStore.fetchParentMeme(memeId);
          meme = memesStore.parentMeme;
          localStorage.setItem("meme", JSON.stringify(meme));
          isLoaded.value = true;
          location.reload();
        }
      }
      if (params != preParams) {
        isLoaded.value = false;
        meme = memesStore.meme;
        memeId = meme.memeId;
        localStorage.setItem("meme", JSON.stringify(meme));
        router.push({ path: "/meme", query: { id: memeId } });
        await memesStore.fetchCommentsById(memeId);
        if (meme.isComment) {
          isComment.value = true;
        } else {
          isComment.value = false;
        }
        isLoaded.value = true;
        location.reload();
      }
    }
  );

  //boton para ir atras

  let goBack = ref(false);
  let isComment = ref(false);

  async function backToParent() {
    goBack.value = true;
    router.push({
      path: "/meme",
      query: { id: meme.parentMeme },
    });
  }

  // onMounted(() => {
  //   if (meme.isComment) {
  //     isComment.value = true;
  //   } else {
  //     isComment.value = false;
  //   }
  // });

  //carga la data de memes y comments y las guarda en local
  onMounted(async () => {
    let memeString = localStorage.getItem("meme");
    if (memeString) {
      let preMeme = JSON.parse(memeString);
      let preMemeId = meme.memeId;
      if (preMemeId == route.query.id) {
        meme = preMeme;
        memeId = preMemeId;
        memesStore.setMeme(meme);
        isLoaded.value = true;
      }
    }

    if (!meme || route.query.id) {
      //route.query.id != meme.memeId ||
      memeId = route.query.id;

      const response = await axios.get(`${API_URL}meme/byId?id=${memeId}`);

      meme = response.data;
      memesStore.setMeme(meme);
      localStorage.setItem("meme", JSON.stringify(meme));
      localStorage.setItem("parentId", meme.memeId);
      if (meme.isComment) {
        isComment.value = true;
      } else {
        isComment.value = false;
      }
      isLoaded.value = true;
    }
  });

  //manejo del boton que scrollea al componente padre

  const parentOutOfView = ref(false);
  const parentRef = ref<HTMLElement | null>(null);

  function scrollToParent() {
    if (parentRef.value) {
      parentRef.value.scrollIntoView({ behavior: "smooth" });
    }
  }

  function handleScroll() {
    const elementPosition = parentRef.value?.getBoundingClientRect() as DOMRect;
    if (elementPosition.top < 0) {
      parentOutOfView.value = true;
    } else parentOutOfView.value = false;
  }

  EventBus.on("isLoaded", () => {
    window.addEventListener("scroll", handleScroll);
    parentRef.value = document.getElementById("parent");
  });

  // onMounted(() => {
  //   window.addEventListener("scroll", handleScroll);
  //   parentRef.value = document.getElementById("parent");
  //   console.log(parentRef.value);
  // });
</script>
<style lang=""></style>
