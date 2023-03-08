<template lang="">
  <div class="flex w-full flex-col items-center justify-center">
    <div class="mx-auto flex flex-col justify-center">
      <MemeCard :data="meme" class="mx-auto"></MemeCard>
      <PostCommentButton :memeId="meme.memeId" />
      <CommentsView class="mx-auto" :memeId="meme.memeId"></CommentsView>
    </div>
  </div>
</template>
<script setup lang="ts">
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

  let meme = ref();
  let memeId: any;

  const goHome = ref(false);

  console.log(meme.value);
  // meme.value = memesStore.meme;

  EventBus.on("goHome", () => {
    goHome.value = true;
  });

  watch(
    () => route.params,
    async (params, preParams) => {
      if (goHome.value) {
        params = preParams;
      }
      if (params != preParams) {
        meme.value = memesStore.meme;
        memeId = meme.value.memeId;
        localStorage.setItem("meme", JSON.stringify(meme.value));
        // router.push(`meme?id=${id}`);
        router.push({ path: "/meme", query: { id: memeId } });
        // await memesStore.fetchCommentsById(memeId);
        //localStorage.setItem("comments", JSON.stringify(memesStore.comments));
        EventBus.emit("reloadComments");
      }
    }
  );

  function sendParentMemeId() {
    console.log("el id del meme parent es:", memeId);
  }

  onBeforeMount(async () => {
    let memeString = localStorage.getItem("meme");
    if (memeString) {
      meme.value = JSON.parse(memeString);
      memeId = meme.value.memeId;
      memesStore.setMeme(meme.value);
    }

    if (!meme.value) {
      memeId = route.query.id;

      const response = await axios.get(
        `${API_URL}meme/byId?id=${memeId}`
        //`http://localhost:4246/v1/meme/byId?id=${memeId}`
      );

      meme.value = response.data;
      memesStore.setMeme(meme.value);
      localStorage.setItem("meme", JSON.stringify(meme.value));
      localStorage.setItem("parentId", meme.value.memeId);
    }
  });
</script>
<style lang=""></style>
