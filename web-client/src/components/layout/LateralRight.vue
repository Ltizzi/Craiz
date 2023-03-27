<template lang="">
  <div class="fixed flex w-52 flex-col gap-14">
    <div class="w-full">
      <SearchBar class="-ml-10 w-64 bg-transparent" :back="false" />
    </div>
    <TrendLateralList
      class="flex w-48 flex-col justify-center rounded-2xl bg-white"
    />
  </div>
</template>
<script setup lang="ts">
  import SearchBar from "../ui/SearchBar.vue";
  import TrendLateralList from "../ui/TrendLateralList.vue";
</script>
