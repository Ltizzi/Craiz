<template lang="">
  <div
    class="back z-0 flex h-screen w-screen items-center justify-center bg-slate-900"
  >
    <div
      class="2xlw-10/12 2xl:px-5 relative z-10 my-auto h-5/6 w-full items-center bg-violet-900"
    >
      <img
        src="/assets/img/collage.jpg"
        class="lg:left-14 lg:-mt-5 lg:w-11/12 lg:object-cover 2xl:left-16 2xl:top-4 2xl:-mt-3 2xl:h-full 2xl:w-11/12 2xl:object-fill absolute top-16 z-0 h-5/6 opacity-40"
        alt=""
      />
      <img
        src="/assets/img/logo.png"
        class="lg:right-72 lg:top-20 lg:w-52 2xl:left-44 2xl:top-32 2xl:w-1/4 absolute bottom-72 right-4 z-20 w-36 opacity-90"
        alt=""
      />
      <h1
        class="lg:left-72 lg:top-36 lg:w-1/3 lg:text-6xl 2xl:left-1/2 2xl:top-1/4 2xl:-ml-60 2xl:w-3/6 2xl:text-right 2xl:text-8xl absolute bottom-28 left-5 w-52 text-left font-merriweather text-5xl font-extrabold text-white opacity-95"
      >
        Todos los memes en un sólo lugar al mismo tiempo
      </h1>
      <div
        class="lg:right-72 lg:w-fit lg:flex-row lg:text-lg 2xl:bottom-32 2xl:right-1/4 2xl:-mr-40 2xl:flex-row absolute bottom-36 right-8 flex w-28 flex-col gap-2 text-sm"
      >
        <button
          class="lg:rounded-3xl lg:px-3 lg:py-1 2xl:rounded-3xl 2xl:px-4 2xl:py-2 rounded-lg bg-green-600 px-2 py-1 font-bold text-white"
          @click="handleSignInClick"
        >
          Loguear con Google
        </button>

        <button
          class="lg:rounded-3xl lg:px-3 lg:py-1 2xl:px-4 2xl:py-2 2xl:text-xl rounded-lg bg-orange-600 px-2 py-1 font-bold text-white"
          @click="goHome"
        >
          Ver memes
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { API_URL } from "@/main";
  import router from "@/router";
  import EventBus from "@/utils/EventBus";
  import { useUserStore } from "@/store";
  import { onMounted } from "vue";

  const userStore = useUserStore();

  function handleSignInClick() {
    window.location.href = `${API_URL}auth/google`;
  }

  function goHome() {
    userStore.setGuest();
    localStorage.setItem("guest", "userIsGuest");
    router.push("/");
  }

  //background effect

  onMounted(() => {
    const el = document.querySelector(".back") as HTMLElement;

    if (el) {
      el.addEventListener("mousemove", (e) => {
        el.style.backgroundPositionX = -e.offsetX / 10 + "px";
        el.style.backgroundPositionY = -e.offsetY / 10 + "px";
      });
    }
  });
</script>
<style scoped>
  .back {
    background: url("./img/pattern.png");
  }
</style>
