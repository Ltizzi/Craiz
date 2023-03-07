<template lang="">
  <div
    class="items-left container fixed mt-24 flex w-60 flex-col sm:ml-2 sm:w-2/5 md:mx-3 lg:ml-8"
  >
    <img
      src="../../../public/assets/img/logo.png"
      alt="Craze logo"
      class="w-14 md:ml-1 md:w-20 lg:ml-8 lg:w-32"
    />
    <h1
      @click="goHome()"
      class="my-5 ml-1 text-lg font-bold text-white hover:cursor-pointer sm:text-left sm:text-lg md:text-lg lg:ml-2 lg:text-start"
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
