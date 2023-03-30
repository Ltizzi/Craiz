<template lang="">
  <div class="flex w-full flex-row gap-2 bg-slate-700 py-3" v-if="props.back">
    <div class="w-1/12">
      <router-link to="/">
        <BaseButton class="mx-5 my-auto text-lg text-white opacity-95">
          <font-awesome-icon icon="fa-solid fa-circle-chevron-left" />
        </BaseButton>
      </router-link>
    </div>

    <div class="flex w-10/12 items-center justify-center">
      <input
        type="text"
        placeholder="Buscar en Craze"
        class="relative w-11/12 rounded-2xl bg-slate-600 py-1 px-2 pl-5 text-white"
        v-model="inputSearch"
        id="inputBar"
        @keyup.enter="handleEnterEvent"
        @keypress="isSearching"
      />
      <font-awesome-icon
        icon="fa-solid fa-magnifying-glass"
        class="absolute right-16 rounded-r-full bg-slate-500 py-2 pr-3 pl-2 text-gray-300"
      />
    </div>
  </div>
  <div class="flex w-full flex-row gap-2 bg-slate-700 py-3" v-else>
    <div class="flex items-center justify-center">
      <input
        type="text"
        placeholder="Buscar en Craze"
        class="relative rounded-2xl bg-slate-600 py-1 px-2 pl-5 text-white"
        v-model="inputSearch"
        id="inputBar"
        @keyup.enter="handleEnterEvent"
        @keypress="isSearching"
      />
      <font-awesome-icon
        icon="fa-solid fa-magnifying-glass"
        class="absolute right-2 rounded-r-full bg-slate-500 py-2 pr-3 pl-2 text-gray-300"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from "vue";
  import BaseButton from "../common/BaseButton.vue";
  import { useSearchStore } from "@/store/search";
  import { useUserStore } from "@/store";
  import axios from "axios";
  import { API_URL } from "@/main";
  import { User } from "@/utils/models";
  import EventBus from "@/utils/EventBus";
  import router from "@/router";

  const props = defineProps({
    back: {
      type: Boolean,
      required: true,
    },
  });

  const searchStore = useSearchStore();
  const userStore = useUserStore();
  const inputSearch = ref("");

  const tagSearch = ref();
  const userSearch = ref([]);

  const inputBar = document.getElementById("#inputBar");

  function isSearching() {
    console.log("isSearching");
    EventBus.emit("isSearching");
  }

  async function handleEnterEvent() {
    localStorage.removeItem("searchedMemes");
    localStorage.removeItem("searchedUsers");
    let textToSearch = inputSearch.value.toLowerCase();

    router.replace(`/search?value=${textToSearch}`);
    // }
  }
</script>
