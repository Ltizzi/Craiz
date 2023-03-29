<template lang="">
  <div
    class="flex w-full flex-row justify-around gap-2 border-t-2 border-slate-500 bg-slate-700 py-3 text-gray-300"
  >
    <div
      :class="[
        ' px-4 py-2 hover:cursor-pointer hover:bg-slate-600 hover:text-white',
        state.activeButton === 'highlight'
          ? 'front-bold border-b-2 border-gray-100 text-white'
          : '',
      ]"
      @click="loadHighlight"
    >
      <h3>Destacado</h3>
    </div>
    <div
      :class="[
        ' px-4 py-2 hover:cursor-pointer hover:bg-slate-600 hover:text-white',
        state.activeButton === 'recent'
          ? 'front-bold border-b-2 border-gray-100 text-white'
          : '',
      ]"
      @click="loadRecent"
    >
      <h3>Más reciente</h3>
    </div>
    <div
      :class="[
        ' px-4 py-2 hover:cursor-pointer hover:bg-slate-600 hover:text-white',
        state.activeButton === 'searchUsers'
          ? 'front-bold border-b-2 border-gray-100 text-white'
          : '',
      ]"
      @click="loadUsers"
    >
      <h3>Personas</h3>
    </div>
  </div>
</template>
<script setup lang="ts">
  import EventBus from "@/utils/EventBus";
  import { reactive } from "vue";

  const state = reactive({
    activeButton: "highlight",
  });

  function loadHighlight() {
    state.activeButton = "highlight";
    EventBus.emit("loadHighlight");
  }

  function loadRecent() {
    state.activeButton = "recent";
    EventBus.emit("loadRecent");
  }

  function loadUsers() {
    state.activeButton = "searchUsers";
    EventBus.emit("loadSearchUsers");
  }
</script>
