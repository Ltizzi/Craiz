<template lang="">
  <BaseButton
    class="fixed bottom-20 right-5 rounded-full bg-purple-500 px-3 py-1 text-2xl text-white shadow-xl shadow-gray-700 transition-transform duration-500 hover:scale-125"
    @click="modalSwitch"
  >
    <font-awesome-icon icon="fa-solid fa-plus" />
  </BaseButton>
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
