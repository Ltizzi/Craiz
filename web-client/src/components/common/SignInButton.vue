<template lang="">
  <button
    class="sm:max-w-20 rounded-md bg-emerald-600 px-2 py-1 font-bold text-white sm:w-3/12 sm:text-lg"
    v-if="!userIsSignedIn"
    @click="handleSignInClick"
  >
    Sign in With Google
  </button>
  <button
    v-else
    class="sm:max-w-20 sm:text-md w-64 rounded-md bg-red-400 px-2 py-1 font-bold text-white sm:w-3/12"
    @click="handleSignOutClick"
  >
    Sign Out
  </button>
</template>
<script setup lang="ts">
  import { useUserStore } from "@/store";
  import { ref, watch } from "vue";
  import { API_URL } from "@/main";

  const userStore = useUserStore();
  let userIsSignedIn = ref(userStore.isSignedIn);

  const handleSignInClick = async () => {
    window.location.href = `${API_URL}auth/google`;
    //window.location.href = "http://localhost:4246/v1/auth/google";
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
