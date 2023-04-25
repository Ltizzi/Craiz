<template lang="">
  <div class="2xlw-full">
    <div
      class="fixed right-0 top-0 z-50 w-full opacity-95 lg:left-72 lg:-ml-0.5 lg:w-6/12 2xl:left-1/3 2xl:right-2/3 2xl:-ml-24 2xl:w-2/5"
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
