<template lang="">
  <button
    class="sm:max-w-20 sm:w-3/12 sm:text-base w-14 rounded-xl bg-emerald-600 px-0 py-1 text-sm font-bold text-white md:w-fit md:px-4 md:text-base lg:w-40"
    v-if="!userIsSignedIn"
    @click="handleSignInClick"
  >
    Sign in With Google
  </button>
  <button
    v-else
    class="sm:max-w-20 sm:text-md sm:w-3/12 sm:text-base w-14 rounded-xl bg-red-400 px-0 py-1 text-sm font-bold text-white md:w-20 md:text-base lg:w-40"
    @click="handleSignOutClick"
  >
    Sign Out
  </button>
</template>
<script setup lang="ts">
  import { useUserStore } from "@/store";
  import { ref, watch } from "vue";

  import { spring } from "motion";

  import { API_URL } from "@/main";
  import axios from "axios";

  const userStore = useUserStore();
  let userIsSignedIn = ref(userStore.isSignedIn);

  const handleSignInClick = async () => {
    localStorage.removeItem("guest");
    window.location.href = `${API_URL}auth/google`;
  };

  const handleSignOutClick = async () => {
    localStorage.removeItem("guest");
    const response = await axios.get(`${API_URL}logout`, {
      withCredentials: true,
    });
    console.log(response);
    if (response.status == 200) {
      userStore.logout();
    }
  };

  watch(
    () => userStore.isSignedIn,
    (newValue) => {
      userIsSignedIn.value = newValue;
    }
  );
</script>
<style lang=""></style>
