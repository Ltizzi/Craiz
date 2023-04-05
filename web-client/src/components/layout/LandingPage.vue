<template lang="">
  <div
    class="back z-0 flex h-screen w-screen items-center justify-center bg-slate-900"
  >
    <div
      class="relative z-10 my-auto h-5/6 w-full items-center bg-violet-900 lg:w-10/12 lg:px-5"
    >
      <img
        src="/assets/img/collage.jpg"
        class="absolute top-16 z-0 h-5/6 opacity-40 md:left-14 md:-mt-5 md:w-11/12 md:object-cover lg:left-16 lg:top-4 lg:-mt-3 lg:h-full lg:w-11/12 lg:object-fill"
        alt=""
      />
      <img
        src="/assets/img/logo.png"
        class="absolute bottom-72 right-4 z-20 w-36 opacity-90 md:right-72 md:top-20 md:w-52 lg:left-44 lg:top-32 lg:w-1/4"
        alt=""
      />
      <h1
        class="absolute bottom-28 left-5 w-52 text-left font-merriweather text-5xl font-extrabold text-white opacity-95 md:left-72 md:top-36 md:w-1/3 md:text-6xl lg:left-1/2 lg:top-1/4 lg:-ml-60 lg:w-3/6 lg:text-right lg:text-8xl"
      >
        Todos los memes en un sólo lugar al mismo tiempo
      </h1>
      <div
        class="absolute bottom-36 right-8 flex w-28 flex-col gap-2 text-sm md:right-72 md:w-fit md:flex-row md:text-lg lg:bottom-32 lg:right-1/4 lg:-mr-40 lg:flex-row"
      >
        <button
          class="rounded-lg bg-green-600 px-2 py-1 font-bold text-white md:rounded-3xl md:px-3 md:py-1 lg:rounded-3xl lg:px-4 lg:py-2"
          @click="handleSignInClick"
        >
          Loguear con Google
        </button>

        <button
          class="rounded-lg bg-orange-600 px-2 py-1 font-bold text-white md:rounded-3xl md:px-3 md:py-1 lg:px-4 lg:py-2 lg:text-xl"
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
    background: url("./assets/img/pattern.png");
  }
</style>
