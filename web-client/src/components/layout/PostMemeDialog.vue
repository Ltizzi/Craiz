<template lang="">
  <BaseDialog :is-active="showModal" v-if="showModal" @closeModal="modalSwitch">
    <div class="sm:px-7 sm:py-5 flex flex-col justify-center px-2 py-2">
      <h1 class="2xltext-3xl text-center text-xl font-bold">
        Qué te gustaría hacer?
      </h1>
      <div class="flex flex-row justify-around py-3">
        <BaseButton
          class="2xltext-lg mr-5 rounded-lg bg-pink-600 px-3 py-1 text-base font-bold text-white"
          @click="turnShowUpload"
          >Subir meme</BaseButton
        >
        <!-- v-if="btnTurn"
        v-else -->
        <BaseButton
          class="2xltext-lg rounded-lg bg-green-500 px-3 py-1 text-base font-bold text-white"
          @click="turnShowCreate"
          >Crear nuevo meme</BaseButton
        >
      </div>
      <UploadMeme v-if="showUpload" @closeModal="modalSwitch"></UploadMeme>
      <CreateMeme @closeModal="modalSwitch" v-if="!showUpload"></CreateMeme>
    </div>
  </BaseDialog>
</template>
<script setup lang="ts">
  import BaseDialog from "../common/BaseDialog.vue";
  import BaseButton from "../common/BaseButton.vue";
  import UploadMeme from "../ui/UploadMeme.vue";
  import CreateMeme from "../ui/CreateMeme.vue";
  import EventBus from "@/utils/EventBus";
  import { btnClasses } from "../../utils/models";
  import { useMemesStore } from "@/store/memes";
  import { ref } from "vue";

  const memeStore = useMemesStore();

  let showModal = ref(false);

  let showUpload = ref(true);

  let btnTurn = ref(false);

  EventBus.on("openDialogComment", () => {
    showModal.value = true;
  });

  EventBus.on("openDialogNewMeme", () => {
    showModal.value = true;
  });

  EventBus.on("closeDialog", () => {
    showModal.value = false;
  });

  function turnShowUpload() {
    showUpload.value = !showUpload.value;
    btnTurn.value = !btnTurn.value;
  }

  function turnShowCreate() {
    showUpload.value = !showUpload.value;
    btnTurn.value = !btnTurn.value;
  }

  function modalSwitch() {
    showModal.value = !showModal.value;
    memeStore.clearParentMeme();
    console.log("coso");
  }
</script>
<style lang=""></style>
