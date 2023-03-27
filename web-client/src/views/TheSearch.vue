<template lang="">
  <div class="flex flex-col pt-24 lg:w-fit" v-if="isLoaded">
    <SearchHeader class="w-full lg:w-2/5" />
    <div v-if="noSearch" class="mt-40 text-2xl">Busca tags o usuarios</div>
    <MemeList :searchedTag="searchedTag" v-else />
  </div>
</template>
<script setup lang="ts">
  import SearchHeader from "@/components/layout/SearchHeader.vue";
  import MemeList from "@/components/layout/MemeList.vue";
  import BaseSpinner from "@/components/common/BaseSpinner.vue";
  import { onMounted, onUnmounted, ref, watch } from "vue";
  import { useRoute } from "vue-router";
  import EventBus from "@/utils/EventBus";
  import axios from "axios";
  import { API_URL } from "@/main";

  const route = useRoute();

  const isLoaded = ref(false);

  const searchedTag = ref();
  const searchedUser = ref();
  const noSearch = ref(true);

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

  onMounted(async () => {
    const tag = props.tagname;
    const user = props.username;

    if (tag) {
      noSearch.value = false;
      EventBus.emit("searchTag", tag);
      const response = await axios.get(`${API_URL}meme/byTag?tag=${tag}`);
      searchedTag.value = response.data;
    }
    isLoaded.value = true;
  });

  onUnmounted(() => {
    searchedTag.value = null;
  });
</script>
