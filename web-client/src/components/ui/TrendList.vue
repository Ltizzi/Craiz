<template lang="">
  <div v-if="isLoaded" class="flex w-full flex-col pl-10 pt-5">
    <ul v-if="loadTrends" class="flex flex-col gap-5">
      <li
        v-for="(trend, index) in trendTags"
        :key="trend.tagId"
        class="flex flex-row justify-start gap-5"
      >
        <p class="text-right text-lg font-bold">{{ index + 1 }}.</p>
        <div class="flex flex-col gap-0">
          <BaseTag
            :class="trend.name"
            :list="true"
            :name="trend.name"
            class="text-center"
            >{{ trend.name }}</BaseTag
          >
          <p>{{ trend.counter }} memes</p>
        </div>
      </li>
    </ul>
    <ul v-if="loadUserTrends">
      <li v-for="trend in userTagsTrends" :key="trend.tagId"></li>
    </ul>
    <ul v-if="loadUsersTop">
      <li v-for="user in usersTopTier" :key="user.userId"></li>
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
  import { useUserStore } from "@/store";
  import EventBus from "@/utils/EventBus";
  import axios from "axios";
  import { API_URL } from "@/main";

  const userStore = useUserStore();

  const trendTags = ref();
  const loadTrends = ref(false);

  const userTagsTrends = ref();
  const loadUserTrends = ref(false);

  const usersTopTier = ref();
  const loadUsersTop = ref(false);

  const isLoaded = ref(false);

  onBeforeMount(async () => {
    const response = await axios.get(`${API_URL}tag/all?skip=0&limit=10`);
    if (response.data) {
      trendTags.value = response.data;
      loadTrends.value = true;
      isLoaded.value = true;
    }
  });
</script>
