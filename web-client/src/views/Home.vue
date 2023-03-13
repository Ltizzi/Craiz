<template>
  <div class="bg-gray-800">
    <div
      class="max-w-sm:full xs:justify-start mx-auto flex flex-row justify-center gap-0 bg-slate-700 sm:w-full sm:justify-start md:w-11/12 lg:w-8/12"
    >
      <div class="h-screen w-16 rounded-sm sm:w-20 md:w-32 lg:w-64">
        <LateralMenu></LateralMenu>
      </div>
      <!-- items-center justify-center -->
      <div
        class="flex w-10/12 flex-col rounded-sm border-2 border-stone-500 bg-gray-50 sm:w-10/12 md:w-9/12 lg:w-7/12"
      >
        <keep-alive>
          <RouterView></RouterView>
        </keep-alive>
      </div>
      <div class="w-14 sm:w-14 md:w-32 lg:w-52"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import LateralMenu from "../components/layout/LateralMenu.vue";
  import Callback from "../components/ui/Callback.vue";
  import { useUserStore } from "@/store";
  import { useTagStore } from "@/store/tags";
  import { onMounted, ref, watch } from "vue";
  import axios from "axios";
  import { API_URL } from "@/main";

  const userStore = useUserStore();
  const tagStore = useTagStore();

  onMounted(async () => {
    const response = await axios.get(
      `${API_URL}auth/logincheck`,
      //"http://localhost:4246/v1/auth/logincheck",
      { withCredentials: true }
    );
    console.log(response.data.user);
    userStore.setUser(response.data.user);
    tagStore.fetchTags;
  });
</script>
