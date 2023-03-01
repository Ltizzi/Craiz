<template>
  <div class="bg-gray-800">
    <div class="mx-auto flex w-9/12 flex-row justify-center bg-slate-700">
      <div class="h-screen w-1/5 rounded-sm">
        <LateralMenu></LateralMenu>
      </div>
      <div
        class="flex w-3/5 flex-col items-center justify-center rounded-sm border-2 border-stone-500 bg-gray-50"
      >
        <MemeList></MemeList>
        <Callback></Callback>
      </div>
      <div class="w-1/5"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import MemeList from "../components/layout/MemeList.vue";
  import LateralMenu from "../components/layout/LateralMenu.vue";
  import Callback from "../components/common/Callback.vue";
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
