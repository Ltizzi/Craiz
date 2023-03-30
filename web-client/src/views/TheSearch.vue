<template lang="">
  <div class="flex flex-col pt-24 lg:w-full" v-if="isLoaded">
    <SearchHeader class="w-full lg:w-2/5" />
    <div v-if="noSearch" class="mt-40 w-full text-2xl">
      Busca tags o usuarios
    </div>
    <div v-else>
      <MemeList
        :searchedTag="searchedTag"
        v-if="state.activeTab == 'highlights'"
      />
      <MemeList
        :searchedTag="searchedRecent"
        v-if="state.activeTab == 'recent'"
      />
      <div v-if="state.activeTab == 'users'" class="mt-40">
        <div
          class="mb-5 flex flex-row gap-2"
          v-for="user in searchedUser"
          :key="user.userId"
        >
          <img :src="user.avatar" alt="" class="w-14 rounded-full" />
          <p class="text-xl font-bold">{{ user.nickname }}</p>
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
  const searchedRecent = ref();
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

  onMounted(async () => {
    localStorage.removeItem("searchedValues");
    const tag = props.tagname;
    const user = props.username;

    if (tag) {
      noSearch.value = false;
      EventBus.emit("searchTag", tag);
      const response = await axios.get(`${API_URL}meme/byTag?tag=${tag}`);
      searchedTag.value = response.data;
    }
    if (route.query.value) {
      const response = await axios.get(
        `${API_URL}utils/search?value=${route.query.value}`
      );
      if (!response.data.error) {
        let searchedValues = response.data;
        searchedTag.value = searchedValues.memesSortedByLike;
        searchedRecent.value = searchedValues.memesSortedByUpdate;
        searchedUser.value = searchedValues.users;
        noSearch.value = false;
        localStorage.setItem("searchedValues", JSON.stringify(searchedValues));
        if (
          !searchedTag.value ||
          (searchedRecent.value && searchedUser.value)
        ) {
          state.activeTab = "users";
        }
        if (searchedTag.value) {
          state.activeTab = "highlights";
        }
      }
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
