<template lang="">
  <div v-if="isLoaded" class="2xlpl-5 flex h-screen w-full flex-col pl-3 pt-5">
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
        class="mb-6 flex flex-row justify-between hover:cursor-pointer lg:w-5/6 2xl:w-4/5"
      >
        <div
          class="2xlgap-5 flex flex-row items-center justify-start gap-3 text-start"
          @click="goProfile(user.username)"
        >
          <p class="text-right text-base font-bold sm:text-lg">
            {{ index + 1 }}.
          </p>
          <img
            :src="user.avatar"
            alt="user profile picture"
            class="h-10 w-10 rounded-full lg:h-14 lg:w-14"
          />
          <div class="flex flex-col justify-start gap-0">
            <div class="flex flex-row items-center gap-1">
              <h3 class="text-start text-lg font-bold lg:text-xl">
                {{ user.nickname }}
              </h3>
              <p class="text-base">- @{{ user.username }}</p>
            </div>
            <p class="text-base">{{ user.likeCounter }} likes</p>
          </div>
        </div>
        <BaseFollow
          :userToFollowId="user.userId"
          :userFollow="!checkFollows(user.userId)"
          :sameUser="checkSameUser(user.userId)"
        />
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
  import BaseFollow from "../common/BaseFollow.vue";
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

  //HANDLE FOLLOW BUTTON

  // const recentFollow = ref(false);

  function checkFollows(id: number) {
    const user = JSON.parse(localStorage.getItem("user") as string);
    return user.follows.includes(id);
  }

  function checkSameUser(id: number) {
    const user = JSON.parse(localStorage.getItem("user") as string);
    return user.userId == id;
  }

  EventBus.on("handleFollows", async (id) => {
    console.log("recibido");
    const user = JSON.parse(localStorage.getItem("user") as string);
    if (user.userId != id) {
      const response = await axios.patch(
        `${API_URL}user/handleFollows?userId=${user.userId}&userToFollowId=${id}`,
        null,
        { withCredentials: true }
      );
      console.log(response.data);
      if (response.data.res == "followed") {
        user.follows.push(id);
        localStorage.setItem("user", JSON.stringify(user));
        const topUserRes = await axios.get(
          `${API_URL}user/all?skip=0&limit=10`
        );
        usersTopTier.value = topUserRes.data;
      }
      if (response.data.res == "unfollowed") {
        user.follows = user.follows.filter((usr: number) => usr != id);
        localStorage.setItem("user", JSON.stringify(user));
        const topUserRes = await axios.get(
          `${API_URL}user/all?skip=0&limit=10`
        );
        usersTopTier.value = topUserRes.data;
      }
    }
  });

  onMounted(async () => {
    const response = await axios.get(`${API_URL}tag/top?skip=0&limit=10`);
    if (response.data) {
      trendTags.value = response.data;
      loadTrends.value = true;
      isLoaded.value = true;
    }

    const topUserRes = await axios.get(`${API_URL}user/top?skip=0&limit=10`);
    usersTopTier.value = topUserRes.data;
    // if (topUserRes) {
    //   usersTopTier.value = topUserRes.data;
    //   state.activeButton = "topUsers";
    //   isLoaded.value = true;
    // }
  });
</script>
