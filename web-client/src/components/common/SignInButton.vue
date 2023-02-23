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
  import { useAuthStore } from "@/store/user";
  import axios from "axios";

  const userStore = useAuthStore();

  const handleSignInClick = async () => {
    window.location.href = "http://localhost:4246/v1/auth/google";
  };

  const handleSignOutClick = () => {
    userStore.logout();
  };
</script>
<style lang=""></style>
