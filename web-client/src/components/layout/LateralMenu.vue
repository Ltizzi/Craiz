<template lang="">
  <div
    class="items-left container fixed mt-24 flex w-60 flex-col sm:ml-2 sm:w-2/5 lg:ml-2"
  >
    <h1
      @click="goHome()"
      class="my-5 text-xl font-bold text-white hover:cursor-pointer sm:text-left sm:text-lg lg:ml-2 lg:text-start"
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
