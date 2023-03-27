<template lang="">
  <div class="fixed flex w-52 flex-col gap-5">
    <div class="w-full">
      <SearchBar class="-ml-10 w-64 bg-transparent" :back="false" />
    </div>
    <TrendLateralList
      class="flex w-48 flex-col justify-center rounded-2xl bg-white"
    />
    <UserTopLateral
      class="flex w-48 flex-col justify-center rounded-2xl bg-white"
    />
    <div class="flex flex-col text-center text-sm text-gray-400">
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
