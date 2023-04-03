<template lang="">
  <div
    v-if="isLoaded"
    class="flex w-full flex-col justify-center gap-1 rounded-3xl bg-slate-100 px-5 py-1"
  >
    <h2 class="mb-2 text-xl font-extrabold">Tendencias</h2>
    <ul v-if="loadTrends" class="flex flex-col gap-1">
      <li
        v-for="(trend, index) in trendTags"
        :key="trend.tagId"
        class="flex flex-row justify-start gap-4"
      >
        <p class="text-right text-lg font-bold">{{ index + 1 }}.</p>
        <div class="flex flex-col gap-0">
          <BaseTag :class="trend.name" :name="trend.name" class="text-center">{{
            trend.name
          }}</BaseTag>
          <p class="text-sm">{{ trend.counter }} memes</p>
        </div>
      </li>
    </ul>
    <router-link to="/trends">
      <h2 class="mb-2 text-base font-extrabold hover:cursor-pointer">
        Ver más
      </h2>
    </router-link>
  </div>
  <div v-else>
    <BaseSpinner />
  </div>
</template>
<script setup lang="ts">
  import { onBeforeMount, onMounted, ref } from "vue";
  import BaseSpinner from "../common/BaseSpinner.vue";
  import BaseTag from "@/components/common/BaseTag.vue";
  import axios from "axios";
  import { API_URL, RELOAD_TIMER } from "@/main";

  const trendTags = ref();
  const loadTrends = ref(false);

  const isLoaded = ref(false);

  async function fetchTopTrend() {
    return await axios.get(`${API_URL}tag/all?skip=0&limit=5`);
  }

  onBeforeMount(async () => {
    const response = await fetchTopTrend();
    if (response.data) {
      trendTags.value = response.data;
      loadTrends.value = true;
      isLoaded.value = true;
    }
  });

  onMounted(async () => {
    setInterval(async () => {
      const response = await fetchTopTrend();
      trendTags.value = response.data;
    }, RELOAD_TIMER);
  });
</script>
