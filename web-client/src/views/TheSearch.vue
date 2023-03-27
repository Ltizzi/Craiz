<template lang="">
  <div class="flex w-fit flex-col pt-24" v-if="isLoaded">
    <SearchHeader class="w-2/5" />

    <MemeList :searchedTag="searchedTag" />
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
  const serachedUser = ref();

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
