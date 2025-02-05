<template lang="">
  <div
    class="flex w-full flex-row justify-around gap-2 border-t-2 border-slate-500 bg-slate-700 py-3 text-gray-300"
  >
    <div
      :class="[
        'rounded-t-xl  px-4 py-2 hover:cursor-pointer hover:bg-slate-600 hover:text-white',
        state.activeButton === 'trends'
          ? 'front-bold border-b-2 border-gray-100 text-white'
          : '',
      ]"
      @click="loadTrends"
    >
      <h3>Tendencias</h3>
    </div>
    <div
      :class="[
        'rounded-t-xl  px-4 py-2 hover:cursor-pointer hover:bg-slate-600 hover:text-white',
        state.activeButton === 'personalTrends'
          ? 'front-bold border-b-2 border-gray-100 text-white'
          : '',
      ]"
      @click="loadPersonalTrends"
    >
      <h3>Para vos</h3>
    </div>
    <div
      :class="[
        'rounded-t-xl  px-4 py-2 hover:cursor-pointer hover:bg-slate-600 hover:text-white',
        state.activeButton === 'topUsers'
          ? 'front-bold border-b-2 border-gray-100 text-white'
          : '',
      ]"
      @click="loadTopUsers"
    >
      <h3>Top Usuarios</h3>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { reactive } from "vue";
  import EventBus from "@/utils/EventBus";

  const state = reactive({
    activeButton: "trends",
  });

  function loadTrends() {
    state.activeButton = "trends";
    EventBus.emit("loadTrends");
  }

  function loadPersonalTrends() {
    state.activeButton = "personalTrends";
    EventBus.emit("loadPersonalTrends");
  }

  function loadTopUsers() {
    state.activeButton = "topUsers";
    EventBus.emit("loadTopUsers");
  }
</script>
<style lang=""></style>
