<template lang="">
  <div
    class="fixed right-0 top-0 z-50 opacity-95 md:left-72 md:ml-1 md:w-6/12 lg:right-1/3 lg:-mr-5"
  >
    <SearchBar :back="true" />
    <SearchNav />
  </div>
</template>
<script setup lang="ts">
  import SearchBar from "../ui/SearchBar.vue";
  import SearchNav from "../ui/SearchNav.vue";
</script>
