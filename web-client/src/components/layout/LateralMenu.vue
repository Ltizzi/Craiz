<template lang="">
  <div
    class="items-left container fixed mt-24 flex w-60 flex-col gap-4 sm:ml-2 sm:w-2/5 md:mx-3 lg:ml-4 lg:w-fit"
  >
    <img
      src="/assets/img/logo.png"
      alt="Craze logo"
      class="w-14 md:ml-1 md:w-20 lg:ml-8 lg:w-32"
    />

    <div
      class="flex h-12 items-center rounded-2xl px-2 hover:cursor-pointer hover:bg-slate-600"
    >
      <h1
        class="my-5 ml-1 text-lg font-bold text-white hover:cursor-pointer sm:text-left sm:text-lg md:text-lg lg:ml-2 lg:text-start lg:text-xl"
        @click="goHome"
      >
        <font-awesome-icon icon="fa-solid fa-house" class="mr-2 mb-1" />
        Inicio
      </h1>
    </div>

    <router-link to="/search">
      <div
        class="flex h-12 items-center rounded-2xl px-2 hover:cursor-pointer hover:bg-slate-600"
      >
        <h1
          class="my-5 ml-1 text-lg font-bold text-white hover:cursor-pointer sm:text-left sm:text-lg md:text-lg lg:ml-2 lg:text-start lg:text-xl"
        >
          <font-awesome-icon
            icon="fa-solid fa-magnifying-glass"
            class="mr-2 mb-1"
          />
          Buscar
        </h1>
      </div>
    </router-link>

    <router-link to="/trends">
      <div
        class="flex h-12 items-center rounded-2xl px-2 hover:cursor-pointer hover:bg-slate-600"
      >
        <h1
          class="my-5 ml-1 text-lg font-bold text-white hover:cursor-pointer sm:text-left sm:text-lg md:text-lg lg:ml-2 lg:text-start lg:text-xl"
        >
          <font-awesome-icon
            icon="fa-solid fa-arrow-trend-up"
            class="mr-2 mb-1 text-lg"
          />Tendencias
        </h1>
      </div>
    </router-link>

    <div
      class="flex h-12 items-center rounded-2xl px-2 hover:cursor-pointer hover:bg-slate-600"
    >
      <h1
        class="my-5 ml-1 text-lg font-bold text-white hover:cursor-pointer sm:text-left sm:text-lg md:text-lg lg:ml-2 lg:text-start lg:text-xl"
      >
        <font-awesome-icon icon="fa-solid fa-bell" class="mr-2 mb-1" />
        Notificaciones
      </h1>
    </div>

    <div
      class="mb-2 flex h-12 items-center rounded-2xl px-2 hover:cursor-pointer hover:bg-slate-600"
    >
      <h1
        class="my-5 ml-1 text-lg font-bold text-white hover:cursor-pointer sm:text-left sm:text-lg md:text-lg lg:ml-2 lg:text-start lg:text-xl"
        @click="goProfile"
      >
        <font-awesome-icon icon="fa-solid fa-user" class="mr-2 mb-1" />
        Perfil
      </h1>
    </div>

    <!-- <NewMemeMenu></NewMemeMenu> -->
    <CreateMemeButton />
    <SignInButton class="mt-72"></SignInButton>
  </div>
</template>
<script setup lang="ts">
  import SignInButton from "../ui/SignInButton.vue";
  import NewMemeMenu from "./NewMemeMenu.vue";
  import CreateMemeButton from "../ui/CreateMemeButton.vue";
  import router from "@/router";
  // import { useRoute } from "vue-router";
  import EventBus from "@/utils/EventBus";
  import { useUserStore } from "@/store";
  import { User } from "@/utils/models";

  const userStore = useUserStore();
  // const route = useRoute();

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
