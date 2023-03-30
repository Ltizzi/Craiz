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
      @click="goHome"
    >
      <h1
        :class="[
          'my-5 ml-1 text-lg font-bold text-gray-300 hover:cursor-pointer sm:text-left sm:text-lg md:text-lg lg:ml-2 lg:text-start lg:text-xl',
          state.activeButton === 'inicio' ? 'font-extrabold text-white' : '',
        ]"
      >
        <font-awesome-icon icon="fa-solid fa-house" class="mr-2 mb-1" />
        Inicio
      </h1>
    </div>

    <router-link to="/search">
      <div
        class="flex h-12 items-center rounded-2xl px-2 hover:cursor-pointer hover:bg-slate-600"
        @click="goSearch"
      >
        <h1
          :class="[
            'my-5 ml-1 text-lg font-bold text-gray-300 hover:cursor-pointer sm:text-left sm:text-lg md:text-lg lg:ml-2 lg:text-start lg:text-xl',
            state.activeButton === 'search' ? 'font-extrabold text-white' : '',
          ]"
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
        @click="goTrends"
      >
        <h1
          :class="[
            'my-5 ml-1 text-lg font-bold text-gray-300 hover:cursor-pointer sm:text-left sm:text-lg md:text-lg lg:ml-2 lg:text-start lg:text-xl',
            state.activeButton === 'trends' ? 'font-extrabold text-white' : '',
          ]"
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
      @click="goNotifications"
    >
      <h1
        :class="[
          'my-5 ml-1 text-lg font-bold text-gray-300 hover:cursor-pointer sm:text-left sm:text-lg md:text-lg lg:ml-2 lg:text-start lg:text-xl',
          state.activeButton === 'notifications'
            ? 'font-extrabold text-white'
            : '',
        ]"
      >
        <font-awesome-icon icon="fa-solid fa-bell" class="mr-2 mb-1" />
        Notificaciones
      </h1>
    </div>

    <div
      class="mb-2 flex h-12 items-center rounded-2xl px-2 hover:cursor-pointer hover:bg-slate-600"
      @click="goProfile"
    >
      <h1
        :class="[
          'my-5 ml-1 text-lg font-bold text-gray-300 hover:cursor-pointer sm:text-left sm:text-lg md:text-lg lg:ml-2 lg:text-start lg:text-xl',
          state.activeButton === 'profile' ? 'font-extrabold text-white' : '',
        ]"
      >
        <font-awesome-icon icon="fa-solid fa-user" class="mr-2 mb-1" />
        Perfil
      </h1>
    </div>

    <!-- <NewMemeMenu></NewMemeMenu> -->
    <CreateMemeButton />
    <SignInButton class="mt-52"></SignInButton>
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
  import { reactive } from "vue";

  const userStore = useUserStore();
  // const route = useRoute();

  const state = reactive({
    activeButton: "inicio",
  });

  function goHome() {
    state.activeButton = "inicio";
    EventBus.emit("goHome");
    EventBus.emit("loadTL");
    router.push({
      path: "/",
      params: {},
    });
  }

  function goSearch() {
    state.activeButton = "search";
  }

  function goTrends() {
    state.activeButton = "trends";
  }

  function goNotifications() {
    state.activeButton = "notifications";
  }

  function goProfile() {
    state.activeButton = "profile";
    const user = userStore.user as User;
    EventBus.emit("loadUserMemes", user.userId);
    EventBus.emit("reloadProfileInfo", user);
    console.log(user);
    router.push(`${user.username}`);
  }
</script>
<style lang=""></style>
