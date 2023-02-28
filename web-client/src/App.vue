<template>
  <div class="flex flex-col items-center justify-center">
    <SignInButton></SignInButton>
    <NewMemeMenu></NewMemeMenu>
    <MemeList></MemeList>
    <Callback></Callback>
  </div>
</template>

<script setup lang="ts">
  import SignInButton from "./components/common/SignInButton.vue";
  import MemeList from "./components/layout/MemeList.vue";
  import NewMemeMenu from "./components/layout/NewMemeMenu.vue";
  import Callback from "./components/common/Callback.vue";
  import { useUserStore } from "@/store";
  import { onMounted } from "vue";
  import axios from "axios";

  const userStore = useUserStore();

  onMounted(async () => {
    const response = await axios.get(
      "http://localhost:4246/v1/auth/logincheck",
      { withCredentials: true }
    );
    console.log(response.data.user);
    userStore.setUser(response.data.user);
  });
</script>

<style scoped></style>
