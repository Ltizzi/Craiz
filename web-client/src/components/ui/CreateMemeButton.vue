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
  import { notUserModalHandler } from "@/utils/notUserModalHandler";

  function modalSwitch() {
    let user = JSON.parse(localStorage.getItem("user") as string);
    if (!user) {
      notUserModalHandler();
    } else {
      EventBus.emit("openDialogNewMeme");
      EventBus.emit("newMeme");
    }
  }
</script>
<style lang=""></style>
