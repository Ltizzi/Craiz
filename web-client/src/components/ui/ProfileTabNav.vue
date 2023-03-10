<template lang="">
  <div
    class="mt-5 flex flex-row justify-evenly bg-slate-600 py-3 px-4 text-center text-lg text-gray-300"
  >
    <div
      class="rounded-2xl px-4 py-2 text-white hover:cursor-pointer hover:bg-slate-500 hover:text-white active:text-gray-100"
      @click="loadUserMemes"
    >
      <h1 class="">Memes</h1>
    </div>
    <div
      class="rounded-2xl px-4 py-2 hover:cursor-pointer hover:bg-slate-500 hover:text-white active:text-gray-100"
      @click="loadUserComments"
    >
      <h1 class="">Comentarios</h1>
    </div>
    <div
      class="rounded-2xl px-4 py-2 hover:cursor-pointer hover:bg-slate-500 hover:text-white active:text-gray-100"
      @click="loadUserLikedMemes"
    >
      <h1 class="">Me gusta</h1>
    </div>
  </div>
</template>
<script setup lang="ts">
  import EventBus from "@/utils/EventBus";

  const props = defineProps({
    id: {
      type: Number,
    },
  });

  function loadUserMemes() {
    EventBus.emit("loadUserMemes", props.id);
  }

  function loadUserComments() {
    EventBus.emit("loadUserComments", props.id);
  }

  function loadUserLikedMemes() {
    EventBus.emit("loadUserLikedMemes", props.id);
  }
</script>
<style lang=""></style>
