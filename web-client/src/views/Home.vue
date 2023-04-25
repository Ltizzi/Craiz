<template>
  <div class="h-screen overflow-hidden overscroll-none bg-slate-900">
    <div
      class="max-w-sm:full xs:justify-start mx-auto flex h-screen flex-row justify-center gap-0 bg-slate-700 sm:w-full sm:justify-start md:w-full lg:w-10/12 2xl:w-8/12"
    >
      <!-- md:-ml-32 -->
      <div
        class="h-screen w-16 rounded-sm sm:w-20 lg:w-2/12 2xl:w-3/12"
        v-if="!state.isMobile"
      >
        <LateralMenu></LateralMenu>
      </div>
      <!-- items-center justify-center -->
      <div
        :class="[
          'flex w-full flex-col items-center rounded-sm border-2 border-stone-500 bg-gray-50 pb-0 sm:w-full md:w-full lg:w-3/5 2xl:-ml-24 2xl:w-3/5',
          state.adminDashboard ? 'lg:w-5/6 xl:w-5/6 2xl:w-5/6' : '',
        ]"
      >
        <keep-alive>
          <RouterView></RouterView>
        </keep-alive>
      </div>
      <div
        class="ml-5 mt-10 flex h-full w-14 items-start sm:w-14 lg:w-auto 2xl:mx-auto 2xl:w-auto 2xl:justify-center"
        v-if="!state.isMobile && !state.adminDashboard"
      >
        <LateralRight />
      </div>
    </div>
    <div v-if="state.isMobile">
      <MobileNav class="fixed bottom-0" />
    </div>
    <NotUserModal />
  </div>
</template>

<script setup lang="ts">
  import LateralMenu from "../components/layout/LateralMenu.vue";
  import LateralRight from "@/components/layout/LateralRight.vue";
  import Callback from "../components/ui/Callback.vue";
  import NotUserModal from "@/components/ui/NotUserModal.vue";
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
  import { useRoute } from "vue-router";

  const userStore = useUserStore();
  const tagStore = useTagStore();

  const route = useRoute();

  onMounted(async () => {
    window.addEventListener("resize", handleWindowSize);
    const width = window.innerWidth;
    if (width < 768) {
      state.isMobile = true;
    }
  });

  //responsive design

  const state = reactive({
    isMobile: false,
    adminDashboard: false,
  });

  watch(
    () => route.path,
    (oldPath, newPath) => {
      if (route.path == "/admin") {
        state.adminDashboard = true;
      } else {
        state.adminDashboard = false;
      }
    }
  );

  function handleWindowSize() {
    state.isMobile = window.innerWidth < 1024;
  }

  onUnmounted(() => {
    window.removeEventListener("resize", handleWindowSize);
  });

  //first time entering / guest handler

  const isGuest = ref(false);
  const isLogged = ref(false);

  onBeforeMount(async () => {
    try {
      const response = await axios.get(`${API_URL}auth/logincheck`, {
        withCredentials: true,
      });
      userStore.setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.removeItem("guest");
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

    if (route.path == "/admin") {
      state.adminDashboard = true;
    }
  });
</script>
