<template lang="">
  <div class="mt-2 text-lg hover:cursor-pointer">
    <BaseButton v-if="!isLooped" @click="loopMeme">
      <font-awesome-icon icon="fa-solid fa-arrows-rotate" />
    </BaseButton>
    <BaseButton v-else @click="loopMeme" class="text-xl text-green-600">
      <font-awesome-icon icon="fa-solid fa-arrows-rotate" />
    </BaseButton>
  </div>
</template>
<script setup lang="ts">
  import { ref } from "vue";

  let isLooped = ref(false);

  async function loopMeme() {
    isLooped.value = !isLooped.value;
  }
</script>
<style lang=""></style>
