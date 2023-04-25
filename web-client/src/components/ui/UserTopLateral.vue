<template lang="">
  <div
    v-if="isLoaded"
    class="lg:gap-0 lg:py-0 flex w-full flex-col justify-center gap-1 rounded-3xl bg-slate-100 px-5 py-1"
  >
    <h2 class="lg:text-lg mb-2 text-xl font-extrabold">Top Users</h2>
    <ul v-if="loadTopUsers" class="-ml-2 flex flex-col gap-1">
      <li
        v-for="(user, index) in users"
        :key="user.userId"
        class="lg:gap-1 flex flex-row justify-start gap-2 hover:cursor-pointer"
        @click="goProfile(user.username)"
      >
        <div class="flex flex-row items-center justify-start gap-1 text-start">
          <p class="lg:text-base text-right text-lg font-bold">
            {{ index + 1 }}.
          </p>
          <img
            :src="user.avatar"
            alt="user profile picture"
            class="lg:h-8 lg:w-8 h-10 w-10 rounded-full"
          />
          <div class="flex flex-col justify-start gap-0">
            <div class="flex flex-row items-center gap-2">
              <h3 class="text-start text-base font-bold">
                {{ user.nickname }}
              </h3>
              <!-- <p class="text-sm">@{{ user.username }} -</p> -->
            </div>

            <div class="flex flex-col gap-0">
              <p class="lg:text-xs text-sm">{{ user.likeCounter }} likes</p>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <router-link to="/trends?topusers=true">
      <h2 class="lg:text-sm mb-2 text-base font-extrabold hover:cursor-pointer">
        Ver más
      </h2>
    </router-link>
  </div>
</template>
<script setup lang="ts">
  import BaseSpinner from "../common/BaseSpinner.vue";
  import axios from "axios";
  import { API_URL, RELOAD_TIMER } from "@/main";
  import { onBeforeMount, onMounted, ref } from "vue";
  import router from "@/router";

  const loadTopUsers = ref(false);
  const isLoaded = ref(false);
  const users = ref();

  function goProfile(username: string) {
    router.push(`/${username}`);
  }

  async function fetchTopUsers() {
    return await axios.get(`${API_URL}user/all?skip=0&limit=5`);
  }

  onBeforeMount(async () => {
    const response = await fetchTopUsers();
    if (response.data) {
      users.value = response.data;
      loadTopUsers.value = true;
      isLoaded.value = true;
    }
  });

  onMounted(() => {
    setInterval(async () => {
      const response = await axios.get(`${API_URL}user/all?skip=0&limit=5`);
      users.value = response.data;
      loadTopUsers.value = true;
      isLoaded.value = true;
    }, RELOAD_TIMER);
  });
</script>
