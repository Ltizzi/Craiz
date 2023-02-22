<template lang="">
  <button
    class="rounded-md bg-green-600 px-2 py-1 font-bold text-white"
    v-if="!isSignedIn"
    @click="handleSignInClick"
  >
    Sign in With Google
  </button>
  <button v-else @click="handleSignOutClick">Sign Out</button>
</template>
<script setup lang="ts">
  import { useUserStore } from "@/store/user";
  import axios from "axios";

  const userStore = useUserStore();

  const handleSignInClick = async () => {
    const response = await axios.get("http://localhost:4246/v1/auth/google");
    window.location = response.data.url;
  };

  const handleSignOutClick = () => {
    userStore.clearAccessToken();
  };
</script>
<style lang=""></style>
