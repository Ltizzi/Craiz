<template>
  <div class="h-screen overflow-hidden">
    <div
      v-if="isLoaded"
      class="flex h-full w-full flex-col items-center overflow-scroll bg-gray-200 pb-20"
      ref="listEl"
    >
      <MemeCard
        v-for="meme in memes"
        :key="meme.memeId"
        :data="meme"
      ></MemeCard>

      <div v-if="isLoading">
        <BaseSpinner />
      </div>
    </div>
  </div>

  <CreateMemeMobileButton v-if="state.isMobile && !state.isProfile" />
  <div
    v-if="!isLoaded"
    class="2xlh-full mx-auto my-auto flex items-center justify-center"
  >
    <BaseSpinner />
  </div>
</template>
<script setup lang="ts">
  import axios from "axios";
  import { onBeforeMount, onMounted, onUnmounted, reactive, ref } from "vue";
  import BaseSpinner from "../common/BaseSpinner.vue";
  import CreateMemeMobileButton from "../ui/CreateMemeMobileButton.vue";
  import MemeCard from "../ui/MemeCard.vue";
  import { API_URL } from "@/main";
  import { useMemesStore } from "@/store/memes";
  import EventBus from "@/utils/EventBus";
  import { useRoute } from "vue-router";
  import { useUserStore } from "@/store";
  import { User } from "@/utils/models";
  import { useInfiniteScroll } from "@vueuse/core";
  import { vInfiniteScroll } from "@vueuse/components";

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

  //Infinite scroll

  const listState = reactive({
    list: "TL",
  });

  const profileId = ref();

  const listEl = ref(null);

  const memesToShow = 10;

  const isLoading = ref(false);

  useInfiniteScroll(
    listEl,
    async () => {
      if (isLoading.value) return;
      if (route.query.tag) return;
      isLoading.value = true;
      await fetchItemsByState();
    },
    { distance: 100 }
  );

  async function fetchItemsByState() {
    if (listState.list == "TL") {
      const newMemes = await fetchMemes(memes.value.length, memesToShow);
      memes.value.push(...newMemes);
    } else {
      const newMemes = await fetchProfileMemes(memes.value.length, memesToShow);
      memes.value.push(...newMemes);
    }
    isLoading.value = false;
  }

  function returnEndpoint() {
    let endpoint = "";
    if (listState.list == "TL") endpoint = "allWoC";
    if (listState.list == "userMemes") endpoint = "byUserWoC";
    if (listState.list == "userLooped") endpoint = "byUserLoopedMemes";
    if (listState.list == "userComments") endpoint = "byUserComments";
    if (listState.list == "userLiked") endpoint = "byUserLikedMemes";
    return endpoint;
  }

  async function fetchMemes(skip: number, limit: number) {
    let endpoint = returnEndpoint();
    try {
      const response = await axios.get(
        `${API_URL}meme/${endpoint}?skip=${skip}&limit=${limit}`
      );
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchProfileMemes(skip: number, limit: number) {
    let endpointPath = returnEndpoint();
    //let id = profileId.value;
    let user = JSON.parse(localStorage.getItem("profileUser") as string);
    if (user) {
      try {
        const response = await axios.get(
          `${API_URL}meme/${endpointPath}?id=${user.userId}&skip=${skip}&limit=${limit}`
        );

        return response.data;
      } catch (err) {
        console.log(err);
      }
    }
  }

  EventBus.on("reloadMemes", () => {
    listState.list = "TL";
    memes.value = memeStore.memesWoC;
  });

  EventBus.on("loadUserMemes", async (id) => {
    isLoaded.value = false;
    listState.list = "userMemes";
    profileId.value = id;
    console.log(id);
    if (id) {
      let fetchedMemes = await fetchProfileMemes(0, 10);
      memes.value = fetchedMemes;
    }

    isLoaded.value = true;
  });

  EventBus.on("loadLoopedMemes", async (id) => {
    isLoaded.value = false;
    listState.list = "userLooped";
    profileId.value = id;
    console.log(id);
    if (id) {
      let fetchedMemes = await fetchProfileMemes(0, 10);
      memes.value = fetchedMemes;
    }
    isLoaded.value = true;
  });

  EventBus.on("loadUserComments", async (id) => {
    isLoaded.value = false;
    listState.list = "userComments";
    profileId.value = id;
    console.log(id);
    if (id) {
      let fetchedMemes = await fetchProfileMemes(0, 10);
      memes.value = fetchedMemes;
    }
    isLoaded.value = true;
  });

  EventBus.on("loadUserLikedMemes", async (id) => {
    isLoaded.value = false;
    listState.list = "userLiked";
    profileId.value = id;
    console.log(id);
    if (id) {
      let fetchedMemes = await fetchProfileMemes(0, 10);
      memes.value = fetchedMemes;
    }

    isLoaded.value = true;
  });

  EventBus.on("loadTL", async () => {
    memes.value = [];
    listState.list = "TL";
    isLoaded.value = false;
    await memeStore.fetchMemesWoC(0, 10);
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
    let userLocal = JSON.parse(localStorage.getItem("user") as string);
    if (!userLocal) {
      try {
        const response = await axios.get(`${API_URL}auth/logincheck`, {
          withCredentials: true,
        });
        userStore.setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } catch (err) {
        console.log(err);
      }
    }

    if (Object.keys(route.params).length === 0 && !props.searchedTag) {
      await memeStore.fetchMemesWoC(0, 10);
      memes.value = memeStore.memesWoC;
      isLoaded.value = true;
      listState.list = "TL";
    } else {
      let user = JSON.parse(localStorage.getItem("profileUser") as string);
      if (!user) {
        user = userStore.profileUser as User;
        localStorage.setItem("profileUser", JSON.stringify(user));
      }
      const response = await axios.get(
        `${API_URL}meme/byUserWoC?id=${user.userId}&skip=0&limit=10`
      );
      memes.value = response.data;
      isLoaded.value = true;
      listState.list = "userMemes";
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
    state.isMobile = window.innerWidth < 1024;
  }

  onUnmounted(() => {
    window.removeEventListener("resize", handleWindowSize);
    localStorage.removeItem("userMemes");
    localStorage.removeItem("userLooped");
    localStorage.removeItem("userComments");
    localStorage.removeItem("userLiked");
    localStorage.removeItem("profileUser");
  });
</script>
<style lang=""></style>
