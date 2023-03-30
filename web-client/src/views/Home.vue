<template>
  <div class="bg-gray-800">
    <div
      class="max-w-sm:full xs:justify-start mx-auto flex flex-row justify-center gap-0 bg-slate-700 sm:w-full sm:justify-start md:w-11/12 lg:w-8/12"
    >
      <div
        class="h-screen w-16 rounded-sm sm:w-20 md:w-32 lg:w-2/12"
        v-if="!state.isMobile"
      >
        <LateralMenu></LateralMenu>
      </div>
      <!-- items-center justify-center -->
      <div
        class="flex w-full flex-col items-center rounded-sm border-2 border-stone-500 bg-gray-50 pb-16 sm:w-full md:w-9/12 lg:w-3/5"
      >
        <keep-alive>
          <RouterView></RouterView>
        </keep-alive>
      </div>
      <div
        class="ml-5 flex h-screen w-14 items-center sm:w-14 md:w-32 lg:mx-auto lg:w-72 lg:justify-center"
        v-if="!state.isMobile"
      >
        <LateralRight />
      </div>
    </div>
    <div v-if="state.isMobile">
      <MobileNav class="fixed bottom-0" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import LateralMenu from "../components/layout/LateralMenu.vue";
  import LateralRight from "@/components/layout/LateralRight.vue";
  import Callback from "../components/ui/Callback.vue";
  import MobileNav from "../components/ui/MobileNav.vue";
  import { useUserStore } from "@/store";
  import { useTagStore } from "@/store/tags";
  import {
    onBeforeMount,
    onMounted,
    onUnmounted,
    reactive,
    ref,
    watch,
  } from "vue";
  import axios from "axios";
  import { API_URL } from "@/main";
  import router from "@/router";

  const userStore = useUserStore();
  const tagStore = useTagStore();

  onMounted(async () => {
    // const response = await axios.get(
    //   `${API_URL}auth/logincheck`,
    //   //"http://localhost:4246/v1/auth/logincheck",
    //   { withCredentials: true }
    // );
    // if (!response.data.user) {
    //   isLogged.value = false;
    // } else {
    //   userStore.setUser(response.data.user);
    //   tagStore.fetchTags;
    //   isGuest.value = true;
    // }
    window.addEventListener("resize", handleWindowSize);
    const width = window.innerWidth;
    if (width < 768) {
      state.isMobile = true;
    }
  });

  //responsive design

  const state = reactive({
    isMobile: false,
  });

  function handleWindowSize() {
    state.isMobile = window.innerWidth < 768;
  }

  onUnmounted(() => {
    window.removeEventListener("resize", handleWindowSize);
  });

  //first time entering / guest handler

  const isGuest = ref(false);
  const isLogged = ref(false);

  onBeforeMount(async () => {
    try {
      const response = await axios.get(
        `${API_URL}auth/logincheck`,
        //"http://localhost:4246/v1/auth/logincheck",
        { withCredentials: true }
      );
      userStore.setUser(response.data.user);
      tagStore.fetchTags;
    } catch (err) {
      console.log(err);
      isLogged.value = false;
      console.log("no logueado");
      isGuest.value = userStore.isGuest;
      let localGuest = localStorage.getItem("guest");
      if (isGuest.value || localGuest == "userIsGuest") {
        isLogged.value = true;
      } else {
        router.push("/landing");
      }
    }
  });
</script>
