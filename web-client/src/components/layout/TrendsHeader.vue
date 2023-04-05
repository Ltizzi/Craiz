<template lang="">
  <div
    class="fixed top-0 z-50 opacity-95 md:left-72 md:ml-1 md:w-2/4 lg:left-1/3 lg:right-2/3 lg:-ml-24 lg:w-2/5"
  >
    <SearchBar :back="true" />
    <TrendsNav />
  </div>
</template>
<script setup lang="ts">
  import SearchBar from "../ui/SearchBar.vue";
  import TrendsNav from "../ui/TrendsNav.vue";
</script>
