<template lang="">
  <div v-if="isLoaded" class="flex h-screen w-full flex-col pl-3 pt-5 lg:pl-10">
    <ul v-if="state.activeButton === 'trends'" class="flex flex-col gap-5">
      <li
        v-for="(trend, index) in trendTags"
        :key="trend.tagId"
        class="flex flex-row justify-start gap-5"
      >
        <p class="text-right text-lg font-bold">{{ index + 1 }}.</p>
        <div class="flex flex-col gap-0">
          <BaseTag
            :class="trend.class"
            :list="true"
            :name="trend.name"
            class="text-center"
            >{{ trend.name }}</BaseTag
          >
          <p>{{ trend.counter }} memes</p>
        </div>
      </li>
    </ul>

    <ul v-if="state.activeButton === 'personalTrends'">
      <li v-for="trend in userTagsTrends" :key="trend.tagId"></li>
    </ul>

    <ul v-if="state.activeButton === 'topUsers'">
      <li
        v-for="(user, index) in usersTopTier"
        :key="user.userId"
        class="mb-6 flex flex-col justify-start hover:cursor-pointer"
        @click="goProfile(user.username)"
      >
        <div
          class="flex flex-row items-center justify-start gap-3 text-start lg:gap-5"
        >
          <p class="sm:text-lg text-right text-base font-bold">
            {{ index + 1 }}.
          </p>
          <img
            :src="user.avatar"
            alt="user profile picture"
            class="h-10 w-10 rounded-full md:h-14 md:w-14"
          />
          <div class="flex flex-col justify-start gap-0">
            <div class="flex flex-row items-center gap-1">
              <h3 class="text-start text-lg font-bold md:text-xl">
                {{ user.nickname }}
              </h3>
              <p class="text-base">- @{{ user.username }}</p>
            </div>
            <p class="text-base">{{ user.likeCounter }} likes</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
  <div v-else>
    <BaseSpinner />
  </div>
</template>
<script setup lang="ts">
  import { onBeforeMount, onMounted, reactive, ref } from "vue";
  import BaseSpinner from "../common/BaseSpinner.vue";
  import BaseTag from "@/components/common/BaseTag.vue";
  import { useUserStore } from "@/store";
  import EventBus from "@/utils/EventBus";
  import axios from "axios";
  import { API_URL } from "@/main";
  import router from "@/router";

  const userStore = useUserStore();

  const state = reactive({
    activeButton: "trends",
  });

  const trendTags = ref();
  const loadTrends = ref(false);
  const userTagsTrends = ref();
  const loadPersonalTrends = ref(false);
  const usersTopTier = ref();
  const loadTopUsers = ref(false);

  const isLoaded = ref(false);

  EventBus.on("loadTrends", () => {
    isLoaded.value = false;
    state.activeButton = "trends";
    isLoaded.value = true;
  });

  EventBus.on("loadPersonalTrends", () => {
    isLoaded.value = false;
    state.activeButton = "personalTrends";
    // loadTrends.value = false;
    // loadPersonalTrends.value = true;
    // loadTopUsers.value = false;
    isLoaded.value = true;
  });

  EventBus.on("loadTopUsers", () => {
    isLoaded.value = false;
    state.activeButton = "topUsers";
    // loadTrends.value = false;
    // loadPersonalTrends.value = false;
    // loadTopUsers.value = true;
    isLoaded.value = true;
  });

  function goProfile(username: string) {
    router.push(`/${username}`);
  }

  onMounted(async () => {
    const response = await axios.get(`${API_URL}tag/all?skip=0&limit=10`);
    if (response.data) {
      trendTags.value = response.data;
      loadTrends.value = true;
      isLoaded.value = true;
    }

    const topUserRes = await axios.get(`${API_URL}user/all?skip=0&limit=10`);
    usersTopTier.value = topUserRes.data;
    // if (topUserRes) {
    //   usersTopTier.value = topUserRes.data;
    //   state.activeButton = "topUsers";
    //   isLoaded.value = true;
    // }
  });
</script>
