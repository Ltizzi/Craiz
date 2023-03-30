<template lang="">
  <div class="fixed top-0 z-50 opacity-95 lg:right-1/3 lg:-mr-5">
    <SearchBar :back="true" />
    <TrendsNav />
  </div>
</template>
<script setup lang="ts">
  import SearchBar from "../ui/SearchBar.vue";
  import TrendsNav from "../ui/TrendsNav.vue";
</script>
