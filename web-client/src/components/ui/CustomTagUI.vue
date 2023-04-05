<template lang="">
  <div class="flex flex-col">
    <form class="flex items-center" @submit.prevent="searchTags">
      <label for="simple-search" class="sr-only">Buscar tag</label>
      <div class="relative my-2 w-full">
        <div
          class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
        >
          <svg
            aria-hidden="true"
            class="h-5 w-5 text-gray-500 dark:text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
        <input
          type="text"
          id="simple-search"
          class="block w-full rounded-l-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-violet-500 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder="Search"
          v-model="tagValue"
          @keyup.enter="searchTags"
          @keypress="isTyping"
          required
        />
      </div>
      <button
        type="submit"
        class="ml-0 rounded-r-full border border-slate-700 bg-slate-400 p-2.5 text-sm font-medium text-white hover:bg-violet-600 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        @click="searchTags"
      >
        <svg
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
        <span class="sr-only">Buscar tag</span>
      </button>
    </form>
    <div class="flex flex-col justify-around gap-1">
      <div class="flex flex-row gap-1">
        <BaseTag
          v-for="tag in searchedTags"
          :key="tag.tagId"
          class="sm:text-base custom rounded-lg px-2 py-1 pb-2 text-base font-bold text-white hover:cursor-pointer md:px-2 md:text-base lg:px-2 lg:text-base"
          @click="selectTag(tag)"
          :clickeable="true"
          >{{ tag.name }}</BaseTag
        >
      </div>

      <p v-if="noSearch" class="py-2">
        Clickea en
        <BaseTag
          class="sm:text-base custom rounded-lg px-2 py-1 pb-2 text-base font-bold text-white hover:cursor-pointer md:px-2 md:text-base lg:px-2 lg:text-base"
          :clickeable="true"
          :name="tagValue"
          @click="createTag"
          >{{ tagValue.toLowerCase() }}</BaseTag
        >
        para crear el tag
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { API_URL } from "@/main";
  import BaseTagVue from "../common/BaseTag.vue";
  import axios from "axios";
  import { ref } from "vue";
  import EventBus from "@/utils/EventBus";
  import { useTagStore } from "@/store/tags";

  const tagStore = useTagStore();

  const tagValue = ref();

  const searchedTags = ref();
  const noSearch = ref(false);

  function isTyping() {
    noSearch.value = false;
    searchedTags.value = null;
  }

  async function searchTags() {
    // localStorage.removeItem("customTag");
    let searchValue = tagValue.value.toLowerCase();
    const response = await axios.get(
      `${API_URL}tag/byName?value=${searchValue}`
    );
    console.log("*****--********");
    console.log(response.data);
    searchedTags.value = response.data;
    let filtro = response.data.filter((tag: any) => tag.name === searchValue);
    if ((await response.data.length) == 0 || filtro.length == 0) {
      noSearch.value = true;
    }
  }

  function selectTag(tag: any) {
    EventBus.emit("createdCustom", tag);
  }

  async function createTag() {
    let tag: any = {
      name: tagValue.value.toLowerCase(),
      class: "custom",
      isCustom: true,
      description: "Custom tag created by an user",
    };
    const response = await axios.post(`${API_URL}tag/custom`, tag, {
      withCredentials: true,
    });
    console.log(response.data);
    // localStorage.setItem("customTag", JSON.stringify(response.data));

    EventBus.emit("createdCustom", response.data);
    tagStore.pushTag(response.data);
  }
</script>
