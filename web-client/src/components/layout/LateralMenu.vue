<template lang="">
  <div class="items-left fixed ml-4 mt-24 flex w-60 flex-col">
    <h1
      @click="goHome()"
      class="my-5 text-center text-xl font-bold text-white hover:cursor-pointer"
    >
      Inicio
    </h1>
    <SignInButton></SignInButton>
    <NewMemeMenu></NewMemeMenu>
  </div>
</template>
<script setup lang="ts">
  import SignInButton from "../common/SignInButton.vue";
  import NewMemeMenu from "./NewMemeMenu.vue";
  import router from "@/router";

  function goHome() {
    router.push({ path: "/" });
  }
</script>
<style lang=""></style>
