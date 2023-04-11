<template lang="">
  <div
    class="items-left sm:ml-2 sm:w-2/5 container fixed mt-24 flex flex-col gap-4 md:-ml-20 md:mt-12 md:w-fit md:gap-2 lg:ml-36 lg:w-fit"
  >
    <img
      src="/assets/img/logo.png"
      alt="Craze logo"
      class="w-14 md:ml-4 md:w-20 lg:ml-8 lg:w-32"
    />

    <div
      class="flex h-12 items-center rounded-2xl px-2 hover:cursor-pointer hover:bg-slate-600"
      @click="goHome"
    >
      <h1
        :class="[
          'sm:text-left sm:text-lg my-5 ml-1 text-lg font-bold text-gray-300 hover:cursor-pointer md:text-lg lg:ml-2 lg:text-start lg:text-xl',
          state.activeButton === 'inicio' ? 'font-extrabold text-white' : '',
        ]"
      >
        <font-awesome-icon icon="fa-solid fa-house" class="mb-1 mr-2" />
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
            'sm:text-left sm:text-lg my-5 ml-1 text-lg font-bold text-gray-300 hover:cursor-pointer md:text-lg lg:ml-2 lg:text-start lg:text-xl',
            state.activeButton === 'search' ? 'font-extrabold text-white' : '',
          ]"
        >
          <font-awesome-icon
            icon="fa-solid fa-magnifying-glass"
            class="mb-1 mr-2"
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
            'sm:text-left sm:text-lg my-5 ml-1 text-lg font-bold text-gray-300 hover:cursor-pointer md:text-lg lg:ml-2 lg:text-start lg:text-xl',
            state.activeButton === 'trends' ? 'font-extrabold text-white' : '',
          ]"
        >
          <font-awesome-icon
            icon="fa-solid fa-arrow-trend-up"
            class="mb-1 mr-2 text-lg"
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
          'sm:text-left sm:text-lg my-5 ml-1 text-lg font-bold text-gray-300 hover:cursor-pointer md:text-lg lg:ml-2 lg:text-start lg:text-xl',
          state.activeButton === 'notifications'
            ? 'font-extrabold text-white'
            : '',
        ]"
      >
        <font-awesome-icon icon="fa-solid fa-bell" class="relative mb-1 mr-2" />
        <span
          class="absolute -ml-4 -mt-2 rounded-full bg-purple-500 px-1 text-xs font-bold text-white"
          v-if="notis > 0"
          >{{ notis }}</span
        >
        Notificaciones
      </h1>
    </div>

    <div
      class="mb-2 flex h-12 items-center rounded-2xl px-2 hover:cursor-pointer hover:bg-slate-600"
      @click="goProfile"
    >
      <h1
        :class="[
          'sm:text-left sm:text-lg my-5 ml-1 text-lg font-bold text-gray-300 hover:cursor-pointer md:text-lg lg:ml-2 lg:text-start lg:text-xl',
          state.activeButton === 'profile' ? 'font-extrabold text-white' : '',
        ]"
      >
        <font-awesome-icon icon="fa-solid fa-user" class="mb-1 mr-2" />
        Perfil
      </h1>
    </div>

    <!-- <NewMemeMenu></NewMemeMenu> -->
    <CreateMemeButton />
    <SignInButton class="md:mt-14 lg:mt-72"></SignInButton>
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
  import { onMounted, reactive, ref } from "vue";
  import axios from "axios";
  import { API_URL, RELOAD_TIMER } from "@/main";

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
    router.push("/notifications");
  }

  function goProfile() {
    state.activeButton = "profile";
    const user = userStore.user as User;
    EventBus.emit("loadUserMemes", user.userId);
    EventBus.emit("reloadProfileInfo", user);
    console.log(user);
    router.push(`${user.username}`);
  }

  const notis = ref();
  const user = ref();

  async function loadNotifications(id: number) {
    const res = await axios.get(`${API_URL}notifications/newByUserId?id=${id}`);
    notis.value = res.data.length;
  }

  EventBus.on("reloadNewNotis", () => {
    const usuario = JSON.parse(localStorage.getItem("user") as string);
    let id = usuario.userId;
    loadNotifications(id);
  });

  onMounted(async () => {
    let user = JSON.parse(localStorage.getItem("user") as string);
    if (!user) {
      const response = await axios.get(`${API_URL}auth/logincheck`, {
        withCredentials: true,
      });
      user = response.data.user;
      user.value = user;
    }
    user.value = user;
    if (user != undefined) {
      loadNotifications(user.userId);
    }
    setInterval(() => {
      loadNotifications(user.userId);
    }, RELOAD_TIMER);
  });
</script>
<style lang=""></style>
