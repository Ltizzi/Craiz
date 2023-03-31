<template lang="">
  <nav class="w-full bg-slate-700 bg-opacity-90 text-gray-400">
    <ul class="flex flex-row items-center justify-evenly py-2 text-xl">
      <li
        class="transition-transform duration-500 hover:scale-110 hover:cursor-pointer"
      >
        <img
          src="/assets/img/logo.png"
          alt=""
          :class="[
            'w-8 hover:cursor-pointer',
            state.activeButton == 'inicio' ? 'w-10' : '',
          ]"
          @click="goHome"
        />
      </li>
      <router-link to="/search">
        <li
          :class="[
            'transition-transform duration-500 hover:scale-110 hover:cursor-pointer hover:text-white',
            state.activeButton == 'search' ? 'text-white' : '',
          ]"
          @click="goSearch"
        >
          <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
        </li>
      </router-link>
      <router-link to="/trends">
        <li
          :class="[
            'transition-transform duration-500 hover:scale-110 hover:cursor-pointer hover:text-white',
            state.activeButton == 'trends' ? 'text-white' : '',
          ]"
          @click="goTrends"
        >
          <font-awesome-icon icon="fa-solid fa-arrow-trend-up" />
        </li>
      </router-link>

      <li
        :class="[
          'relative transition-transform duration-500 hover:scale-110 hover:cursor-pointer hover:text-white',
          state.activeButton == 'notifications' ? 'text-white' : '',
        ]"
        @click="goNotifications"
      >
        <font-awesome-icon icon="fa-solid fa-bell" />
        <span
          class="absolute -mt-1 -ml-1 rounded-full bg-purple-500 px-1 text-xs font-bold text-white"
          v-if="notis > 0"
          >{{ notis }}</span
        >
      </li>
      <li
        :class="[
          'transition-transform duration-500 hover:scale-110 hover:cursor-pointer hover:text-white',
          state.activeButton == 'profile' ? 'text-white' : '',
        ]"
      >
        <font-awesome-icon icon="fa-solid fa-user" @click="goProfile" />
      </li>
      <li
        class="text-green-500 transition-transform duration-500 hover:scale-110 hover:cursor-pointer hover:text-green-400"
        v-if="userIsSignedIn"
        @click="handleSignInClick"
      >
        <font-awesome-icon icon="fa-solid fa-right-to-bracket" />
      </li>
      <li
        class="text-red-700 transition-transform duration-500 hover:scale-110 hover:cursor-pointer hover:text-red-600"
        v-else
        @click="handleSignOutClick"
      >
        <font-awesome-icon icon="fa-solid fa-right-from-bracket" />
      </li>
    </ul>
  </nav>
</template>
<script setup lang="ts">
  import { API_URL, RELOAD_TIMER } from "@/main";
  import router from "@/router";
  import { useUserStore } from "@/store";
  import EventBus from "@/utils/EventBus";
  import { User } from "@/utils/models";
  import axios from "axios";
  import { onMounted, reactive, ref } from "vue";

  const userStore = useUserStore();
  let userIsSignedIn = ref(userStore.isSignedIn);

  const state = reactive({
    activeButton: "inicio",
  });

  function goHome() {
    state.activeButton = "inicio";
    EventBus.emit("goHome");
    EventBus.emit("loadTL");
    router.push({ path: "/", params: {} });
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
    router.push(`${user.username}`);
  }

  async function handleSignInClick() {
    window.location.href = `${API_URL}auth/google`;
  }

  async function handleSignOutClick() {
    const response = await axios.get(`${API_URL}logout`, {
      withCredentials: true,
    });
    if (response.status == 200) {
      userStore.logout();
    }
    router.push("/");
    location.reload();
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
    const response = await axios.get(`${API_URL}auth/logincheck`, {
      withCredentials: true,
    });

    const user = response.data.user;
    user.value = user;
    if (user != undefined) {
      loadNotifications(user.userId);
    }
    setInterval(() => {
      loadNotifications(user.userId);
    }, RELOAD_TIMER);
  });
</script>
