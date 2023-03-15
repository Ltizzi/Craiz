<template lang="">
  <div
    class="items-left container fixed mt-24 flex w-60 flex-col sm:ml-2 sm:w-2/5 md:mx-3 lg:ml-8 lg:w-fit"
  >
    <img
      src="/assets/img/logo.png"
      alt="Craze logo"
      class="w-14 md:ml-1 md:w-20 lg:ml-8 lg:w-32"
    />

    <h1
      class="my-5 ml-1 text-lg font-bold text-white hover:cursor-pointer sm:text-left sm:text-lg md:text-lg lg:ml-2 lg:text-start"
      @click="goHome"
    >
      Inicio
    </h1>

    <h1
      class="my-5 ml-1 text-lg font-bold text-white hover:cursor-pointer sm:text-left sm:text-lg md:text-lg lg:ml-2 lg:text-start"
      @click="goProfile"
    >
      Perfil
    </h1>

    <SignInButton></SignInButton>
    <!-- <NewMemeMenu></NewMemeMenu> -->
    <CreateMemeButton />
  </div>
</template>
<script setup lang="ts">
  import SignInButton from "../ui/SignInButton.vue";
  import NewMemeMenu from "./NewMemeMenu.vue";
  import CreateMemeButton from "../ui/CreateMemeButton.vue";
  import router from "@/router";
  import { useRoute } from "vue-router";
  import EventBus from "@/utils/EventBus";
  import { useUserStore } from "@/store";
  import { User } from "@/utils/models";

  const userStore = useUserStore();
  const route = useRoute();

  function goHome() {
    EventBus.emit("goHome");
    EventBus.emit("loadTL");
    router.push({
      path: "/",
      params: {},
    });
  }

  function goProfile() {
    const user = userStore.user as User;
    EventBus.emit("loadUserMemes", user.userId);
    EventBus.emit("reloadProfileInfo", user);
    console.log(user);
    router.push(`${user.username}`);
  }
</script>
<style lang=""></style>
