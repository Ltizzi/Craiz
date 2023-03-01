<template lang="">
  <button
    class="w-64 rounded-md bg-emerald-600 px-2 py-1 font-bold text-white"
    v-if="!userIsSignedIn"
    @click="handleSignInClick"
  >
    Sign in With Google
  </button>
  <button
    v-else
    class="w-64 rounded-md bg-red-400 px-2 py-1 font-bold text-white"
    @click="handleSignOutClick"
  >
    Sign Out
  </button>
</template>
<script setup lang="ts">
  import { useUserStore } from "@/store";
  import { ref, watch } from "vue";

  const userStore = useUserStore();
  let userIsSignedIn = ref(userStore.isSignedIn);

  const handleSignInClick = async () => {
    window.location.href = "http://localhost:4246/v1/auth/google";
  };

  const handleSignOutClick = () => {
    userStore.logout();
  };

  watch(
    () => userStore.isSignedIn,
    (newValue) => {
      userIsSignedIn.value = newValue;
    }
  );
</script>
<style lang=""></style>
