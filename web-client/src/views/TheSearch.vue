<template lang="">
  <div class="flex flex-col pt-24 lg:w-fit" v-if="isLoaded">
    <SearchHeader class="w-full lg:w-2/5" />
    <div v-if="noSearch" class="mt-40 text-2xl">Busca tags o usuarios</div>
    <div v-else>
      <MemeList
        :searchedTag="searchedTag"
        v-if="state.activeTab == 'highlights' || state.activeTab == 'recent'"
      />
      <div v-if="state.activeTab == 'users'" class="mt-40">
        <p>asdasdasd</p>
        <div
          class="flex flex-row"
          v-for="user in searchedUser"
          :key="user.userId"
        >
          <img :src="user.avatar" alt="" />
          <p>{{ user.nickname }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import SearchHeader from "@/components/layout/SearchHeader.vue";
  import MemeList from "@/components/layout/MemeList.vue";
  import BaseSpinner from "@/components/common/BaseSpinner.vue";
  import { onMounted, onUnmounted, reactive, ref, watch } from "vue";
  import { useRoute } from "vue-router";
  import EventBus from "@/utils/EventBus";
  import axios from "axios";
  import { API_URL } from "@/main";
  import { useSearchStore } from "@/store/search";

  const route = useRoute();

  const isLoaded = ref(false);

  const searchedTag = ref();
  const searchedUser = ref();
  const noSearch = ref(true);

  const state = reactive({
    activeTab: "highlights",
  });

  const searchStore = useSearchStore();

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

  EventBus.on("isSearching", () => {
    searchedTag.value = [];
    searchedUser.value = [];
    noSearch.value = true;
  });

  EventBus.on("searchFinished", () => {
    noSearch.value = false;
    console.log("preprepre");
    let memes = JSON.parse(localStorage.getItem("searchedMemes") as string);
    let users = JSON.parse(localStorage.getItem("searchedUsers") as string);
    console.log(memes);
    console.log(users);
    if (memes) {
      searchedTag.value = memes;
    }
    if (searchStore.searchedMemes && !memes) {
      searchedTag.value = searchStore.searchedMemes;
    }
    if (users) {
      searchedUser.value = users;
    }
    if (searchStore.searchedUsers && !users) {
      searchedUser.value = searchStore.searchedUsers;
    }
  });

  EventBus.on("loadHighlight", () => {
    noSearch.value = false;
    state.activeTab = "highlights";
  });

  EventBus.on("loadRecent", () => {
    noSearch.value = false;
    state.activeTab = "recent";
  });

  EventBus.on("loadSearchUsers", () => {
    noSearch.value = false;
    state.activeTab = "users";
  });

  onMounted(async () => {
    const tag = props.tagname;
    const user = props.username;

    if (tag) {
      noSearch.value = false;
      EventBus.emit("searchTag", tag);
      const response = await axios.get(`${API_URL}meme/byTag?tag=${tag}`);
      searchedTag.value = response.data;
    }
    const local = JSON.parse(localStorage.getItem("searchedMemes") as string);
    if (local) {
      noSearch.value = false;
      searchedTag.value = local;
    }
    isLoaded.value = true;
  });

  onUnmounted(() => {
    searchedTag.value = null;
  });
</script>
