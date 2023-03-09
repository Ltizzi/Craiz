<template lang="">
  <div class="mt-2 flex flex-col">
    <BaseButton
      class="w-14 rounded-xl bg-emerald-500 py-1 text-sm font-bold text-white sm:w-3/12 sm:text-base"
      @click="modalSwitch"
      >Crear Meme</BaseButton
    >

    <BaseDialog
      :is-active="showModal"
      v-if="showModal"
      @closeModal="modalSwitch"
    >
      <div class="flex flex-col justify-center px-7 py-5">
        <h1 class="text-center text-3xl font-bold">What do you want to do?</h1>
        <div class="flex flex-row justify-around py-3">
          <BaseButton
            class="mr-5 rounded-lg bg-purple-500 py-1 px-3 text-lg font-bold text-white"
            @click="turnShowUpload"
            >Upload meme</BaseButton
          >
          <BaseButton
            class="rounded-lg bg-green-500 py-1 px-3 text-lg font-bold text-white"
            @click="turnShowCreate"
            >Create new meme</BaseButton
          >
        </div>
        <UploadMeme v-if="showUpload" @closeModal="modalSwitch"></UploadMeme>
        <CreateMeme @closeModal="modalSwitch" v-if="!showUpload"></CreateMeme>
      </div>
    </BaseDialog>
  </div>
</template>
<script setup lang="ts">
  import { ref, watch } from "vue";

  import BaseDialog from "../common/BaseDialog.vue";
  import BaseButton from "../common/BaseButton.vue";
  import CreateMeme from "../ui/CreateMeme.vue";
  import UploadMeme from "../ui/UploadMeme.vue";
  import { btnClasses } from "../../utils/models";

  let showModal = ref(false);

  let showUpload = ref(true);

  function turnShowUpload() {
    showUpload.value = !showUpload.value;
  }

  function turnShowCreate() {
    showUpload.value = !showUpload.value;
  }

  function modalSwitch() {
    showModal.value = !showModal.value;
    console.log("coso");
  }
</script>
<style lang=""></style>
