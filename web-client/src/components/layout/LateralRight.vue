<template lang="">
  <div class="fixed flex w-64 flex-col gap-2 md:w-52 lg:-ml-5">
    <div class="w-full">
      <SearchBar class="ml-0 w-64 bg-transparent" :back="false" />
    </div>
    <TrendLateralList
      class="flex w-48 flex-col justify-center rounded-2xl md:w-56"
    />
    <UserTopLateral
      class="flex w-48 flex-col justify-center rounded-2xl md:w-56"
    />
    <div class="flex flex-col text-center text-sm text-gray-400 md:text-xs">
      <p>©Craze 2023</p>
      <p>Creada por Leonardo Terlizzi</p>
      <p>@ltizzi</p>
    </div>
  </div>
</template>
<script setup lang="ts">
  import SearchBar from "../ui/SearchBar.vue";
  import TrendLateralList from "../ui/TrendLateralList.vue";
  import UserTopLateral from "../ui/UserTopLateral.vue";
</script>
