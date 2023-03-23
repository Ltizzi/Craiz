<template lang="">
  <div class="flex w-fit flex-col pt-24">
    <SearchHeader class="w-2/5" />
    <keep-alive>
      <MemeList />
    </keep-alive>
  </div>
</template>
<script setup lang="ts">
  import SearchHeader from "@/components/layout/SearchHeader.vue";
  import MemeList from "@/components/layout/MemeList.vue";
</script>
