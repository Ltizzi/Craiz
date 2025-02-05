<template lang="">
  <div
    class="container flex max-w-5xl flex-col gap-2 lg:-ml-2 2xl:ml-0 2xl:gap-10"
  >
    <div class="w-full">
      <SearchBar class="ml-0 w-auto max-w-xs bg-transparent" :back="false" />
    </div>
    <TrendLateralList
      class="flex max-w-xs flex-col justify-center rounded-2xl lg:w-auto"
    />
    <UserTopLateral
      class="flex w-48 flex-col justify-center rounded-2xl lg:w-56"
    />
    <div class="flex flex-col text-center text-sm text-gray-400 lg:text-xs">
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
