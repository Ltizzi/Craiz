<template lang="">
  <div v-if="!isSignedIn">
    <p>Authenticating...</p>
  </div>
  <div v-else>
    <p>You are signed in with Google.</p>
  </div>
</template>

<script setup lang="ts">
  import { useUserStore } from "@/store";
  import { useRouter } from "vue-router";
  import { onMounted } from "vue";
  import axios from "axios";

  const userStore = useUserStore();
  const router = useRouter();
  onMounted(async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");
    if (code) {
      const response = await axios.post(
        "localhost:4246/v1/auth/google/callback",
        { code }
      );
      userStore.setAccessToken(response.data.access_token);
      router.push("/");
    }
  });

  const isSignedIn = userStore.isSignedIn;
</script>

<style lang=""></style>
