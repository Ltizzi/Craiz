<template lang="">
  <div class="mt-2 flex flex-row justify-around">
    <BaseButton :class="btnClasses.green" @click="modalSwitch"
      >Crear Meme</BaseButton
    >
    <CreateMeme v-if="showModal" @closeModal="modalSwitch"></CreateMeme>
  </div>
</template>
<script setup lang="ts">
  import { ref } from "vue";
  import BaseButton from "../common/BaseButton.vue";
  import CreateMeme from "./CreateMeme.vue";
  import { btnClasses } from "../../utils/models";

  let showModal = ref(false);

  function modalSwitch() {
    showModal.value = !showModal.value;
    console.log("coso");
  }
</script>
<style lang=""></style>
