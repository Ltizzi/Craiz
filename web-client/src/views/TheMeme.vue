<template lang="">
  <div class="relative flex w-full flex-col items-center justify-center">
    <button
      class="fixed right-12 top-3/4 w-10 animate-bounce rounded-full bg-green-900 py-1 px-1 font-bold text-white shadow-lg shadow-gray-700 duration-500 hover:scale-105 hover:cursor-pointer hover:bg-green-600 hover:transition-transform active:animate-ping after:active:animate-ping lg:right-1/3 lg:left-2/3"
      @click="scrollToParent"
      v-show="parentOutOfView"
    >
      <font-awesome-icon
        icon="fa-solid fa-circle-chevron-up"
        class="text-3xl"
      />
    </button>

    <button
      class="fixed left-16 top-3/4 w-10 animate-bounce rounded-full bg-teal-900 py-1 px-1 font-bold text-white shadow-lg shadow-gray-700 duration-500 hover:scale-105 hover:cursor-pointer hover:bg-teal-500 hover:transition-transform active:animate-ping after:active:animate-ping lg:right-1/3 lg:left-2/3"
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
</template>
<script setup lang="ts">
  import BaseButton from "@/components/common/BaseButton.vue";
  import MemeCard from "@/components/ui/MemeCard.vue";
  import CommentsView from "@/components/layout/CommentsView.vue";
  import PostCommentButton from "@/components/ui/PostCommentButton.vue";
  import { onBeforeMount, onMounted, ref, watch } from "vue";
  import { useRoute } from "vue-router";
  import { useMemesStore } from "@/store/memes";
  import axios from "axios";
  import { API_URL } from "@/main";
  import EventBus from "@/utils/EventBus";
  import router from "@/router";

  const memesStore = useMemesStore();
  const route = useRoute();

  //evento necesario para ir al home

  const goHome = ref(false);

  EventBus.on("goHome", () => {
    goHome.value = true;
  });

  //memes y coments

  let meme = ref();
  let comments = ref([]);
  let memeId: any;

  //recarga los comentarios y el meme

  EventBus.on("reloadMemes", async (e: any) => {
    await memesStore.fetchMemeById(e.id);
    meme.value = memesStore.memeById;
    await memesStore.fetchCommentsById(e.id);
    comments.value = memesStore.comments;
  });

  //vigila la difierencia de la ruta
  watch(
    () => route.params,
    async (params, preParams) => {
      if (goHome.value || goBack.value) {
        //por esto es necesaria, la ruta cambiaba pero se activaba el el watcher
        params = preParams;
        if (goBack.value) {
          location.reload();
        }
      }
      if (params != preParams) {
        meme.value = memesStore.meme;
        memeId = meme.value.memeId;
        localStorage.setItem("meme", JSON.stringify(meme.value));
        router.push({ path: "/meme", query: { id: memeId } });
        memesStore.fetchCommentsById(memeId);
        if (meme.value.isComment) {
          isComment.value = true;
        } else {
          isComment.value = false;
        }
      }
    }
  );

  //boton para ir atras

  let goBack = ref(false);
  let isComment = ref(false);

  function backToParent() {
    console.log(meme.value.parentMeme);
    goBack.value = true;
    router.push({ path: "/meme", query: { id: meme.value.parentMeme } });
  }

  onMounted(() => {
    if (meme.value.isComment) {
      isComment.value = true;
    } else {
      isComment.value = false;
    }
  });

  //carga la data de memes y comments y las guarda en local
  onBeforeMount(async () => {
    let memeString = localStorage.getItem("meme");
    if (memeString) {
      meme.value = JSON.parse(memeString);
      memeId = meme.value.memeId;
      memesStore.setMeme(meme.value);
    }

    if (!meme.value || route.query.id != meme.value.memeId) {
      memeId = route.query.id;

      const response = await axios.get(`${API_URL}meme/byId?id=${memeId}`);

      meme.value = response.data;
      memesStore.setMeme(meme.value);
      localStorage.setItem("meme", JSON.stringify(meme.value));
      localStorage.setItem("parentId", meme.value.memeId);
      if (meme.value.isComment) {
        isComment.value = true;
      } else {
        isComment.value = false;
      }
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

  onMounted(() => {
    window.addEventListener("scroll", handleScroll);
    parentRef.value = document.getElementById("parent");
  });
</script>
<style lang=""></style>
