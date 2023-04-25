<template lang="">
  <div
    class="items-left container mt-24 flex h-screen flex-col gap-4 sm:ml-2 sm:w-2/5 lg:ml-2 lg:mt-12 lg:w-32 lg:gap-2 xl:w-36 2xl:ml-4 2xl:w-48"
  >
    <img
      src="/assets/img/logo.png"
      alt="Craze logo"
      class="w-14 max-w-2xl lg:ml-4 lg:w-20 2xl:ml-8 2xl:w-32"
    />

    <div
      class="flex h-12 items-center rounded-2xl px-2 hover:cursor-pointer hover:bg-slate-600"
      @click="goHome"
    >
      <h1
        :class="[
          'my-5 ml-1 text-lg font-bold text-gray-300 hover:cursor-pointer sm:text-left sm:text-lg lg:text-lg 2xl:ml-2 2xl:text-start 2xl:text-xl',
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
            'my-5 ml-1 text-lg font-bold text-gray-300 hover:cursor-pointer sm:text-left sm:text-lg lg:text-lg 2xl:ml-2 2xl:text-start 2xl:text-xl',
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
            'my-5 ml-1 text-lg font-bold text-gray-300 hover:cursor-pointer sm:text-left sm:text-lg lg:text-lg 2xl:ml-2 2xl:text-start 2xl:text-xl',
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
          'my-5 ml-1 text-lg font-bold text-gray-300 hover:cursor-pointer sm:text-left sm:text-lg lg:text-lg 2xl:ml-2 2xl:text-start 2xl:text-xl',
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
      class="mb-1 flex h-12 items-center rounded-2xl px-2 hover:cursor-pointer hover:bg-slate-600"
      @click="goProfile"
    >
      <h1
        :class="[
          'my-5 ml-1 text-lg font-bold text-gray-300 hover:cursor-pointer sm:text-left sm:text-lg lg:text-lg 2xl:ml-2 2xl:text-start 2xl:text-xl',
          state.activeButton === 'profile' ? 'font-extrabold text-white' : '',
        ]"
      >
        <font-awesome-icon icon="fa-solid fa-user" class="mb-1 mr-2" />

        Perfil
      </h1>
    </div>
    <router-link to="/admin">
      <div
        class="mb-1 flex h-12 items-center rounded-2xl px-2 hover:cursor-pointer hover:bg-slate-600"
        @click="goAdmin"
        v-if="isAdmin"
      >
        <h1
          :class="[
            'my-5 ml-1 text-lg font-bold text-gray-300 hover:cursor-pointer sm:text-left sm:text-lg lg:text-lg 2xl:ml-2 2xl:text-start 2xl:text-xl',
            state.activeButton === 'admin' ? 'font-extrabold text-white' : '',
          ]"
        >
          <font-awesome-icon
            icon="fa-solid fa-lock"
            class="relative mb-1 mr-2"
          />
          Admin
        </h1>
      </div>
    </router-link>

    <div
      class="mb-1 flex h-12 items-center rounded-2xl px-2 hover:cursor-pointer hover:bg-slate-600"
      @click="goMod"
      v-if="isMod"
    >
      <h1
        :class="[
          'my-5 ml-1 text-lg font-bold text-gray-300 hover:cursor-pointer sm:text-left sm:text-lg lg:text-lg 2xl:ml-2 2xl:text-start 2xl:text-xl',
          state.activeButton === 'mod' ? 'font-extrabold text-white' : '',
        ]"
      >
        <font-awesome-icon
          icon="fa-solid fa-hammer"
          class="relative mb-1 mr-2"
        />
        Mod
      </h1>
    </div>

    <CreateMemeButton />
    <SignInButton
      :class="[
        'lg:mt-14 2xl:mt-72',
        isAdmin || isMod ? 'lg:mt-5 2xl:mt-44' : '',
      ]"
    ></SignInButton>
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
  import { notUserModalHandler } from "@/utils/notUserModalHandler";
  import { faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";

  const userStore = useUserStore();
  // const route = useRoute();

  const state = reactive({
    activeButton: "inicio",
  });

  const userIsSignIn = ref(false);

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
    if (!userIsSignIn.value) {
      notUserModalHandler();
    } else {
      state.activeButton = "profile";
      const user = userStore.user as User;
      EventBus.emit("loadUserMemes", user.userId);
      EventBus.emit("reloadProfileInfo", user);
      console.log(user);
      router.push(`${user.username}`);
    }
  }

  function goMod() {
    state.activeButton = "mod";
  }

  function goAdmin() {
    state.activeButton = "admin";
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

  EventBus.on("logout", () => {
    userIsSignIn.value = false;
  });

  //is User Admin/Mod?
  const isAdmin = ref(false);
  const isMod = ref(false);

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
      userIsSignIn.value = true;
    }
    setInterval(() => {
      loadNotifications(user.userId);
    }, RELOAD_TIMER);
    if (user.value.isAdmin) {
      isAdmin.value = true;
    }
    if (user.value.isMod) {
      isMod.value = true;
    }
  });
</script>
<style lang=""></style>
