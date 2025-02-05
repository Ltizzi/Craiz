<template lang="">
  <div
    class="flex flex-row justify-evenly bg-slate-600 px-4 py-3 text-center text-lg text-gray-300"
  >
    <div
      :class="[
        'rounded-t-xl px-4 py-2 hover:cursor-pointer hover:bg-slate-500 hover:text-white',
        state.activeButton === 'memes'
          ? 'border-b-2 border-gray-100 font-bold text-white'
          : '',
      ]"
      @click="loadUserMemes"
    >
      <h1 class="">Memes</h1>
    </div>
    <div
      :class="[
        'rounded-t-xl px-4 py-2 hover:cursor-pointer hover:bg-slate-500 hover:text-white',
        state.activeButton === 'loops'
          ? 'border-b-2 border-gray-100 font-bold text-white'
          : '',
      ]"
      @click="loadUserLoops"
    >
      <h1 class="">Loops</h1>
    </div>
    <div
      :class="[
        'rounded-t-xl px-4 py-2 hover:cursor-pointer hover:bg-slate-500 hover:text-white',
        state.activeButton === 'comments'
          ? 'border-b-2 border-gray-100 font-bold text-white'
          : '',
      ]"
      @click="loadUserComments"
    >
      <h1 class="">Comentarios</h1>
    </div>
    <div
      :class="[
        'rounded-t-xl px-4 py-2 hover:cursor-pointer hover:bg-slate-500 hover:text-white',
        state.activeButton === 'likes'
          ? 'border-b-2 border-gray-100 font-bold text-white'
          : '',
      ]"
      @click="loadUserLikedMemes"
    >
      <h1 class="">Me gusta</h1>
    </div>
  </div>
</template>
<script setup lang="ts">
  import EventBus from "@/utils/EventBus";
  import { reactive } from "vue";

  const props = defineProps({
    id: {
      type: Number,
    },
  });

  const state = reactive({
    activeButton: "memes",
  });

  function loadUserMemes() {
    state.activeButton = "memes";
    EventBus.emit("loadUserMemes", props.id);
  }

  function loadUserLoops() {
    state.activeButton = "loops";
    EventBus.emit("loadLoopedMemes", props.id);
  }

  function loadUserComments() {
    state.activeButton = "comments";
    EventBus.emit("loadUserComments", props.id);
  }

  function loadUserLikedMemes() {
    state.activeButton = "likes";
    EventBus.emit("loadUserLikedMemes", props.id);
  }
</script>
<style lang=""></style>
