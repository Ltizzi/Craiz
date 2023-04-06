<template>
  <div
    v-if="isLoaded"
    class="flex w-full flex-col items-center justify-center bg-gray-200"
  >
    <MemeCard v-for="meme in memes" :key="meme.memeId" :data="meme"></MemeCard>
  </div>
  <CreateMemeMobileButton v-if="state.isMobile && !state.isProfile" />
  <div
    v-if="!isLoaded"
    class="mx-auto my-auto flex items-center justify-center lg:h-full"
  >
    <BaseSpinner />
  </div>
</template>
<script setup lang="ts">
  import axios from "axios";
  import { onMounted, onUnmounted, reactive, ref } from "vue";
  import BaseSpinner from "../common/BaseSpinner.vue";
  import CreateMemeMobileButton from "../ui/CreateMemeMobileButton.vue";
  import MemeCard from "../ui/MemeCard.vue";
  import { API_URL } from "@/main";
  import { useMemesStore } from "@/store/memes";
  import EventBus from "@/utils/EventBus";
  import { useRoute } from "vue-router";
  import { useUserStore } from "@/store";
  import { User } from "@/utils/models";

  let memes: any = ref([]); //meme collection
  const isLoaded = ref(false);

  const route = useRoute();
  const memeStore = useMemesStore();
  const userStore = useUserStore();

  //este componente se reutiliza tanto para visualizar la TL como para los memes, comentarios y likes que se ven en
  //el perfil de cada usuario, por lo que utilizo varios eventos usando un singleton de mit para avisarle como se tiene
  //que comportar

  const props = defineProps({
    searchedTag: {
      type: Array,
    },
  });

  EventBus.on("reloadMemes", () => {
    memes.value = memeStore.memesWoC;
  });

  EventBus.on("loadUserMemes", async (id) => {
    isLoaded.value = false;
    console.log(id);
    if (id) {
      const response = await axios.get(`${API_URL}meme/byUserWoC?id=${id}`);
      memes.value = response.data;
    }

    isLoaded.value = true;
  });

  EventBus.on("loadLoopedMemes", async (id) => {
    isLoaded.value = false;
    console.log(id);
    const response = await axios.get(
      `${API_URL}meme/byUserLoopedMemes?id=${id}`
    );
    memes.value = response.data;
    isLoaded.value = true;
  });

  EventBus.on("loadUserComments", async (id) => {
    isLoaded.value = false;
    console.log(id);
    const response = await axios.get(`${API_URL}meme/byUserComments?id=${id}`);
    memes.value = response.data;
    isLoaded.value = true;
  });

  EventBus.on("loadUserLikedMemes", async (id) => {
    isLoaded.value = false;
    console.log(id);
    const response = await axios.get(
      `${API_URL}meme/byUserLikedMemes?id=${id}`
    );
    memes.value = response.data;
    isLoaded.value = true;
  });

  // EventBus.on("searchTag", async (tag) => {
  //   isLoaded.value = false;
  //   console.log("evento tag emitido y recibido");
  //   console.log(tag);
  //   const response = await axios.get(`${API_URL}meme/byTag?tag=${tag}`);
  //   memes.value = response.data;
  //   isLoaded.value = true;
  // });

  EventBus.on("loadTL", async () => {
    memes.value = [];
    isLoaded.value = false;
    await memeStore.fetchMemesWoC();
    memes.value = memeStore.memesWoC;
    isLoaded.value = true;
  });

  onMounted(async () => {
    if (props.searchedTag) {
      console.log("searchedTag");
      memes.value = props.searchedTag;
      console.log(memes.value);
      isLoaded.value = true;
    }
    try {
      const response = await axios.get(
        `${API_URL}auth/logincheck`,
        //"http://localhost:4246/v1/auth/logincheck",
        { withCredentials: true }
      );
      userStore.setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (err) {
      console.log(err);
    }

    if (Object.keys(route.params).length === 0 && !props.searchedTag) {
      await memeStore.fetchMemesWoC();
      memes.value = memeStore.memesWoC;
      isLoaded.value = true;
    } else {
      const user = userStore.profileUser as User;
      const response = await axios.get(
        `${API_URL}meme/byUserWoC?id=${user.userId}`
      );
      memes.value = response.data;
      isLoaded.value = true;
    }
    window.addEventListener("resize", handleWindowSize);
    const width = window.innerWidth;
    if (width < 768) {
      state.isMobile = true;
    }
    if (Object.keys(route.params).length > 0) {
      state.isProfile = true;
    }
  });

  //create meme mobile button

  const state = reactive({
    isMobile: false,
    isProfile: false,
  });

  function handleWindowSize() {
    state.isMobile = window.innerWidth < 768;
  }

  onUnmounted(() => {
    window.removeEventListener("resize", handleWindowSize);
  });
</script>
<style lang=""></style>
