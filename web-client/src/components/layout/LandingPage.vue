<template lang="">
  <div
    class="back z-0 flex h-screen w-screen items-center justify-center bg-slate-900"
  >
    <div
      class="relative z-10 my-auto h-5/6 w-full items-center bg-violet-900 lg:w-10/12 lg:px-5"
    >
      <img
        src="/assets/img/collage.jpg"
        class="absolute top-16 z-0 h-5/6 opacity-40 lg:left-16 lg:top-0 lg:h-full lg:w-11/12 lg:object-fill"
        alt=""
      />
      <img
        src="/assets/img/logo.png"
        class="absolute bottom-72 right-4 z-20 w-36 opacity-90 md:w-52 lg:top-32 lg:left-44 lg:w-1/4"
        alt=""
      />
      <h1
        class="absolute bottom-28 left-5 w-52 text-left font-merriweather text-5xl font-extrabold text-white opacity-95 md:left-14 lg:left-1/2 lg:top-1/4 lg:-ml-60 lg:w-3/6 lg:text-right lg:text-8xl"
      >
        Todos los memes en un sólo lugar al mismo tiempo
      </h1>
      <div
        class="absolute right-8 bottom-36 flex w-28 flex-col gap-2 text-sm md:w-fit md:text-lg lg:bottom-32 lg:right-1/4 lg:-mr-40 lg:flex-row"
      >
        <button
          class="rounded-lg bg-green-600 py-1 px-2 font-bold text-white md:rounded-3xl md:py-1 md:px-3 lg:rounded-3xl lg:py-2 lg:px-4"
          @click="handleSignInClick"
        >
          Loguear con Google
        </button>

        <button
          class="rounded-lg bg-orange-600 py-1 px-2 font-bold text-white md:rounded-3xl md:py-1 md:px-3 lg:py-2 lg:px-4 lg:text-xl"
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
