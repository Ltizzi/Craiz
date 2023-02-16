<template>
  <div class="flex flex-col items-center justify-center">
    <CreateMeme></CreateMeme>
    <MemeCard></MemeCard>
    <MemeCard></MemeCard>
    <MemeCard></MemeCard>
  </div>
</template>

<script setup lang="ts">
  import LikeButton from "./components/common/LikeButton.vue";
  import MemeCard from "./components/layout/MemeCard.vue";
  import CreateMeme from "./components/layout/CreateMeme.vue";
</script>

<style scoped></style>
