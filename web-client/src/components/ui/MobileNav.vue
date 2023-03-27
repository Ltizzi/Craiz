<template lang="">
  <nav class="w-full bg-slate-700 bg-opacity-90 text-gray-300">
    <ul class="flex flex-row items-center justify-evenly py-2 text-xl">
      <li
        class="transition-transform duration-500 hover:scale-110 hover:cursor-pointer"
      >
        <img
          src="/assets/img/logo.png"
          alt=""
          class="w-8 hover:cursor-pointer"
          @click="goHome"
        />
      </li>
      <router-link to="/search">
        <li
          class="transition-transform duration-500 hover:scale-110 hover:cursor-pointer hover:text-white"
        >
          <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
        </li>
      </router-link>
      <router-link to="/trends">
        <li
          class="transition-transform duration-500 hover:scale-110 hover:cursor-pointer hover:text-white"
        >
          <font-awesome-icon icon="fa-solid fa-arrow-trend-up" />
        </li>
      </router-link>

      <li
        class="transition-transform duration-500 hover:scale-110 hover:cursor-pointer hover:text-white"
      >
        <font-awesome-icon icon="fa-solid fa-bell" />
      </li>
      <li
        class="transition-transform duration-500 hover:scale-110 hover:cursor-pointer hover:text-white"
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
  import { API_URL } from "@/main";
  import router from "@/router";
  import { useUserStore } from "@/store";
  import EventBus from "@/utils/EventBus";
  import { User } from "@/utils/models";
  import axios from "axios";
  import { ref } from "vue";

  const userStore = useUserStore();
  let userIsSignedIn = ref(userStore.isSignedIn);

  function goHome() {
    EventBus.emit("goHome");
    EventBus.emit("loadTL");
    router.push({ path: "/", params: {} });
  }

  function goProfile() {
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
</script>
