<template lang="">
  <BaseButton
    class="sm:w-3/12 sm:text-base mt-2 w-14 rounded-xl bg-violet-500 py-2 text-sm font-bold text-white md:w-full lg:w-full lg:text-lg"
    @click="modalSwitch"
    >Publicar Meme</BaseButton
  >
  <PostMemeDialog />
</template>
<script setup lang="ts">
  import BaseButton from "../common/BaseButton.vue";
  import PostMemeDialog from "../layout/PostMemeDialog.vue";
  import EventBus from "@/utils/EventBus";

  function modalSwitch() {
    EventBus.emit("openDialogNewMeme");
    EventBus.emit("newMeme");
  }
</script>
<style lang=""></style>
