<template lang="">
  <div
    class="mx-auto -mt-2 flex flex-col items-center justify-center gap-0 md:mr-8"
  >
    <template v-for="comment in comments" :key="comment.memeId">
      <div
        class="fit flex w-full flex-row justify-center gap-0 sm:w-11/12 lg:w-11/12"
      >
        <div
          class="mx-auto flex h-full w-6 flex-col items-center justify-center"
        >
          <div
            class="h-full w-3 border-l-2 border-b-2 border-gray-300 sm:w-10 md:ml-4 lg:w-10"
          ></div>
          <div class="h-full w-full border-l-2 border-gray-300"></div>
        </div>

        <MemeCard :data="comment" class="mx-0 w-full"></MemeCard>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import axios from "axios";
  import { onBeforeMount, ref, watch } from "vue";
  import MemeCard from "../ui/MemeCard.vue";
  import { useMemesStore } from "@/store/memes";
  import EventBus from "@/utils/EventBus";
  import { useRoute } from "vue-router";
  import { Meme } from "@/utils/models";
  import { defineProps } from "vue";
  import { API_URL } from "@/main";

  const memesStore = useMemesStore();
  const route = useRoute();

  const props = defineProps({
    memeId: {
      type: Number,
    },
  });

  let id = ref(props.memeId);

  let comments = ref([]);

  // EventBus.on("reloadComments", async () => {
  //   comments.value = memesStore.comments;
  //   id.value = parseInt(route.query.id as string);
  //   const response = await axios.get(
  //     `${API_URL}meme/getCommentsById?id=${id.value}`
  //   );
  //   comments.value = response.data;
  // });

  watch(ref(route.query), async (newQuery, oldQuery) => {
    if (newQuery != oldQuery) {
      id.value = parseInt(route.query.id as string);
      console.log("id esss:", id.value);
      const response = await axios.get(
        `${API_URL}meme/getCommentsById?id=${id.value}`
      );
      comments.value = response.data;
    }
  });

  onBeforeMount(async () => {
    if (memesStore.comments) {
      comments.value = memesStore.comments;
    }
    id.value = parseInt(route.query.id as string);
    const response = await axios.get(
      `${API_URL}meme/getCommentsById?id=${id.value}`
    );
    comments.value = response.data;
    //localStorage.setItem("comments", JSON.stringify(comments.value));
  });
</script>
