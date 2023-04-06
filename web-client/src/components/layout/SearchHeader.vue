<template lang="">
  <div class="lg:w-full">
    <div
      class="fixed right-0 top-0 z-50 w-full opacity-95 md:left-72 md:ml-1 md:w-6/12 lg:left-1/3 lg:right-2/3 lg:-ml-24 lg:w-2/5"
    >
      <SearchBar :back="true" />
      <SearchNav />
    </div>
  </div>
</template>
<script setup lang="ts">
  import SearchBar from "../ui/SearchBar.vue";
  import SearchNav from "../ui/SearchNav.vue";
</script>
