<template lang="">
  <div class="fixed top-0 left-1/4 z-50 ml-24 opacity-95">
    <SearchBar :back="true" />
    <SearchNav />
  </div>
</template>
<script setup lang="ts">
  import SearchBar from "../ui/SearchBar.vue";
  import SearchNav from "../ui/SearchNav.vue";
</script>
