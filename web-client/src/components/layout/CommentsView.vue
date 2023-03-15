<template lang="">
  <div
    class="mx-auto -mt-2 flex flex-col items-center justify-center gap-0 md:mr-8"
    v-if="isLoaded"
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
  <div v-else class="mx-auto my-auto flex items-center justify-center">
    <BaseSpinner />
  </div>
</template>

<script setup lang="ts">
  import axios from "axios";
  import { onBeforeMount, onMounted, ref, watch } from "vue";
  import MemeCard from "../ui/MemeCard.vue";
  import BaseSpinner from "../common/BaseSpinner.vue";
  import { useMemesStore } from "@/store/memes";
  import EventBus from "@/utils/EventBus";
  import { useRoute } from "vue-router";
  import { Meme } from "@/utils/models";
  import { defineProps } from "vue";
  import { API_URL } from "@/main";

  const memesStore = useMemesStore();
  const route = useRoute();

  const props = defineProps({
    comments: {
      type: Array,
    },
    memeId: {
      type: Number,
    },
  });

  let id = ref(props.memeId);
  const isLoaded = ref(false);

  let comments = ref(props.comments);

  EventBus.on("reloadComments", async (e: any) => {
    console.log("asdasdasd", e.id);
    console.log(e);
    isLoaded.value = false;
    const response = await axios.get(
      `${API_URL}meme/getCommentsById?id=${e.id}`
    );
    console.log(response.data);
    comments.value = response.data;
    isLoaded.value = true;
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
    isLoaded.value = true;
  });
</script>
