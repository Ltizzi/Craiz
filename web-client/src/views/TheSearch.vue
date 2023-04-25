<template lang="">
  <div
    class="flex h-auto w-full flex-col bg-gray-200 pt-28 lg:w-full 2xl:w-full"
    v-if="isLoaded"
  >
    <SearchHeader class="sm:w-full lg:w-full 2xl:w-6/12" />
    <div
      v-if="noSearch"
      class="sticky mt-40 h-screen w-full items-center text-center text-2xl"
    >
      Busca tags o usuarios
    </div>
    <div v-else class="">
      <div
        class="sticky z-10 mt-2 w-full bg-violet-500 py-2 text-center text-lg font-bold text-gray-50 opacity-80"
      >
        <h2>
          Mostrando resultados de búsqueda para "{{
            route.query.value || route.query.tag
          }}"
        </h2>
      </div>

      <MemeList
        :searchedTag="searchedTag"
        v-if="state.activeTab == 'highlights'"
      />
      <MemeList
        :searchedTag="searchedRecent"
        v-if="state.activeTab == 'recent'"
      />
      <div v-if="state.activeTab == 'users'" class="mt-40">
        <!-- class="mb-5 flex flex-row gap-2" -->

        <div
          class="noti-list flex h-20 flex-row items-center justify-between gap-3 border-2 border-t-0 border-gray-300 bg-gray-50 px-4 text-xl text-gray-600 hover:cursor-pointer"
          v-for="user in searchedUser"
          :key="user.userId"
        >
          <div class="flex flex-row gap-3" @click="goProfile(user.username)">
            <img :src="user.avatar" alt="" class="w-14 rounded-full" />
            <p class="text-xl font-bold">{{ user.nickname }}</p>
          </div>

          <BaseFollow
            :userToFollowId="user.userId"
            :userFollow="!checkFollows(user.userId)"
            :sameUser="checkSameUser(user.userId)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import SearchHeader from "@/components/layout/SearchHeader.vue";
  import MemeList from "@/components/layout/MemeList.vue";
  import BaseSpinner from "@/components/common/BaseSpinner.vue";
  import BaseFollow from "@/components/common/BaseFollow.vue";
  import { onMounted, onUnmounted, reactive, ref, watch } from "vue";
  import { useRoute } from "vue-router";
  import EventBus from "@/utils/EventBus";
  import axios from "axios";
  import { API_URL } from "@/main";
  import router from "@/router";

  const route = useRoute();

  const isLoaded = ref(false);

  const searchedTag = ref();
  const searchedRecent = ref();
  const searchedUser = ref();
  const noSearch = ref(true);

  const state = reactive({
    activeTab: "highlights",
  });

  watch(
    () => route.params,
    (params, oldParams) => {
      if (params != oldParams) {
        location.reload();
      }
    }
  );

  const props = defineProps({
    tagname: String,
    username: String,
  });

  //navigation tab event handlers

  EventBus.on("isSearching", () => {
    searchedTag.value = [];
    searchedRecent.value = [];
    searchedUser.value = [];
    noSearch.value = true;
  });

  EventBus.on("loadHighlight", () => {
    if (searchedTag.value) {
      noSearch.value = false;
    }
    state.activeTab = "highlights";
  });

  EventBus.on("loadRecent", () => {
    if (searchedRecent.value) {
      noSearch.value = false;
    }

    state.activeTab = "recent";
  });

  EventBus.on("loadSearchUsers", () => {
    if (searchedUser.value) {
      noSearch.value = false;
    }
    state.activeTab = "users";
  });

  function goProfile(username: string) {
    router.push(`/${username}`);
  }

  //HANDLE FOLLOW BUTTON

  function checkFollows(id: number) {
    const user = JSON.parse(localStorage.getItem("user") as string);
    return user.follows.includes(id);
  }

  function checkSameUser(id: number) {
    const user = JSON.parse(localStorage.getItem("user") as string);
    return user.userId == id;
  }

  EventBus.on("handleFollows", async (id) => {
    const user = JSON.parse(localStorage.getItem("user") as string);
    if (user.userId != id) {
      const response = await axios.patch(
        `${API_URL}user/handleFollows?userId=${user.userId}&userToFollowId=${id}`,
        null,
        { withCredentials: true }
      );
      if (response.data.res == "followed") {
        user.follows.push(id);
        localStorage.setItem("user", JSON.stringify(user));
        await searchValues(route.query.value as string);
        state.activeTab = "users";
      }
      if (response.data.res == "unfollowed") {
        user.follows = user.follows.filter((usr: number) => usr != id);
        localStorage.setItem("user", JSON.stringify(user));
        await searchValues(route.query.value as string);
        state.activeTab = "users";
      }
    }
  });

  //función reutilizable que hace query en la API

  async function searchValues(query: string) {
    const response = await axios.get(`${API_URL}utils/search?value=${query}`);
    if (!response.data.error) {
      let searchedValues = response.data;
      searchedTag.value = searchedValues.memesSortedByLike;
      searchedRecent.value = searchedValues.memesSortedByUpdate;
      searchedUser.value = searchedValues.users;

      localStorage.setItem("searchedValues", JSON.stringify(searchedValues));
      if (!searchedTag.value || (searchedRecent.value && searchedUser.value)) {
        state.activeTab = "users";
      }
      if (searchedTag.value) {
        state.activeTab = "highlights";
      }
    }
  }

  //onMount
  onMounted(async () => {
    localStorage.removeItem("searchedValues");
    const tag = props.tagname;
    const user = props.username;

    if (tag) {
      noSearch.value = false;
      EventBus.emit("searchTag", tag);
      const response = await axios.get(`${API_URL}meme/byTag?tag=${tag}`);
      searchedTag.value = response.data;
      searchedRecent.value = response.data;
    }
    if (route.query.value) {
      await searchValues(route.query.value as string);
      noSearch.value = false;
    }

    if (localStorage.getItem("searchedValues")) {
      const local = JSON.parse(
        localStorage.getItem("searchedValues") as string
      );

      noSearch.value = false;
      searchedTag.value = local.memesSortedByLike;
      searchedRecent.value = local.memesSortedByUpdate;
      searchedUser.value = local.users;
      if (!searchedTag.value || (searchedRecent.value && searchedUser.value)) {
        state.activeTab = "users";
      }
      if (searchedTag.value) {
        state.activeTab = "highlights";
      }
    }

    isLoaded.value = true;
  });

  onUnmounted(() => {
    searchedTag.value = null;
    localStorage.setItem("searchedMemes", "");
  });
</script>
