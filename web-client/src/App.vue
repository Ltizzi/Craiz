<template>
  <div class="flex flex-col items-center justify-center">
    <SignInButton></SignInButton>
    <NewMemeMenu></NewMemeMenu>
    <MemeCard></MemeCard>
    <MemeCard></MemeCard>
    <MemeCard></MemeCard>
  </div>
</template>

<script setup lang="ts">
  import SignInButton from "./components/common/SignInButton.vue";
  import MemeCard from "./components/layout/MemeCard.vue";
  import NewMemeMenu from "./components/layout/NewMemeMenu.vue";
</script>

<style scoped></style>
