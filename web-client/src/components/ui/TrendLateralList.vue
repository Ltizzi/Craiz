<template lang="">
  <div
    v-if="isLoaded"
    class="flex w-full flex-col justify-center rounded-3xl px-5 py-2"
  >
    <h2 class="mb-2 text-xl font-extrabold">Tendencias</h2>
    <ul v-if="loadTrends" class="flex flex-col gap-2">
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
  </div>
  <div v-else>
    <BaseSpinner />
  </div>
</template>
<script setup lang="ts">
  import { onBeforeMount, ref } from "vue";
  import BaseSpinner from "../common/BaseSpinner.vue";
  import BaseTag from "@/components/common/BaseTag.vue";
  import axios from "axios";
  import { API_URL } from "@/main";

  const trendTags = ref();
  const loadTrends = ref(false);

  const isLoaded = ref(false);

  onBeforeMount(async () => {
    const response = await axios.get(`${API_URL}tag/all?skip=0&limit=5`);
    if (response.data) {
      trendTags.value = response.data;
      loadTrends.value = true;
      isLoaded.value = true;
    }
  });
</script>
