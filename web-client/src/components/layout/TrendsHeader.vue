<template lang="">
  <div
    class="fixed top-0 z-50 opacity-95 lg:left-72 lg:-ml-0.5 lg:w-2/4 2xl:left-1/3 2xl:right-2/3 2xl:-ml-24 2xl:w-2/5"
  >
    <SearchBar :back="true" />
    <TrendsNav />
  </div>
</template>
<script setup lang="ts">
  import SearchBar from "../ui/SearchBar.vue";
  import TrendsNav from "../ui/TrendsNav.vue";
</script>
