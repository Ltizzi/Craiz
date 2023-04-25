<template lang="">
  <div class="mx-5 h-screen w-full overflow-y-scroll px-10">
    <div class="my-5 flex flex-row justify-evenly">
      <BaseDashboardCard
        cardType="user"
        class="w-60 shadow-lg shadow-gray-400"
        @click="showUserTable"
      />
      <BaseDashboardCard
        cardType="meme"
        class="w-60 shadow-lg shadow-gray-400"
      />
      <BaseDashboardCard
        cardType="tag"
        class="w-60 shadow-lg shadow-gray-400"
      />
    </div>
    <UserList v-if="state.activeTable == 'user'" />
  </div>
</template>
<script setup lang="ts">
  import UserList from "../ui/UserList.vue";
  import BaseDashboardCard from "../common/BaseDashboardCard.vue";
  import { reactive } from "vue";

  const state = reactive({
    activeTable: "user",
  });

  function showUserTable() {
    state.activeTable = "user";
  }
</script>
