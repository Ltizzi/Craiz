<template lang="">
  <div class="fixed top-0 left-0 z-50 opacity-95 lg:left-1/4 lg:ml-24">
    <SearchBar :back="true" />
    <SearchNav />
  </div>
</template>
<script setup lang="ts">
  import SearchBar from "../ui/SearchBar.vue";
  import SearchNav from "../ui/SearchNav.vue";
</script>
