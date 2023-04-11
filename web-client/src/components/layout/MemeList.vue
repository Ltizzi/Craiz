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

  function sameUser(memes: Array<any>, id: any) {
    if (memes && memes[0]) {
      let uploaderMemeId = memes[0].uploader;
      console.log("**** ", uploaderMemeId, " = ", id);
      if (uploaderMemeId == id) {
        return true;
      }
    } else return false;
  }

  EventBus.on("reloadMemes", () => {
    memes.value = memeStore.memesWoC;
  });

  async function loadMemesAndSetLocal(id: any, type: string) {
    let endpointPath = "";
    if (type == "userMemes") endpointPath = "byUserWoC";
    if (type == "userLooped") endpointPath = "byUserLoopedMemes";
    if (type == "userComments") endpointPath = "byUserComments";
    if (type == "userLiked") endpointPath = "byUserLikedMemes";
    console.log(type, " ", endpointPath);
    const response = await axios.get(`${API_URL}meme/${endpointPath}?id=${id}`);
    memes.value = response.data;
    localStorage.setItem(`${type}`, JSON.stringify(response.data));
  }

  EventBus.on("loadUserMemes", async (id) => {
    isLoaded.value = false;
    console.log(id);
    if (id) {
      let userMemes = JSON.parse(localStorage.getItem("userMemes") as string);
      let isSameUser = userMemes ? sameUser(userMemes, id) : false;
      if (
        !userMemes ||
        (userMemes && !isSameUser) ||
        (!userMemes && !isSameUser)
      ) {
        loadMemesAndSetLocal(id, "userMemes");
      } else if (userMemes && isSameUser) {
        memes.value = userMemes;
      } else {
        memes.value = [];
      }
    }

    isLoaded.value = true;
  });

  EventBus.on("loadLoopedMemes", async (id) => {
    isLoaded.value = false;
    console.log(id);
    if (id) {
      let loopedMemes = JSON.parse(
        localStorage.getItem("userLooped") as string
      );
      let isSameUser = loopedMemes ? sameUser(loopedMemes, id) : false;
      if (
        !loopedMemes ||
        (loopedMemes && !isSameUser) ||
        (!loopedMemes && !isSameUser)
      ) {
        loadMemesAndSetLocal(id, "userLooped");
      } else if (loopedMemes && isSameUser) {
        memes.value = loopedMemes;
      } else {
        memes.value = [];
      }
    }
    isLoaded.value = true;
  });

  EventBus.on("loadUserComments", async (id) => {
    isLoaded.value = false;
    console.log(id);
    if (id) {
      let userComments = JSON.parse(
        localStorage.getItem("userComments") as string
      );
      let isSameUser = userComments ? sameUser(userComments, id) : false;
      if (
        !userComments ||
        (userComments && !isSameUser) ||
        (!userComments && !isSameUser)
      ) {
        loadMemesAndSetLocal(id, "userComments");
      } else if (userComments && isSameUser) {
        memes.value = userComments;
      } else {
        memes.value = [];
      }
    }
    isLoaded.value = true;
  });

  EventBus.on("loadUserLikedMemes", async (id) => {
    isLoaded.value = false;
    console.log(id);
    if (id) {
      let userLiked = JSON.parse(localStorage.getItem("userLiked") as string);
      let isSameUser = userLiked ? sameUser(userLiked, id) : false;
      if (
        !userLiked ||
        (userLiked && !isSameUser) ||
        (!userLiked && !isSameUser)
      ) {
        loadMemesAndSetLocal(id, "userLiked");
      } else if (userLiked && isSameUser) {
        memes.value = userLiked;
      } else {
        memes.value = [];
      }
    }

    isLoaded.value = true;
  });

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
      await memeStore.fetchMemesWoC();
      memes.value = memeStore.memesWoC;
      isLoaded.value = true;
    } else {
      let user = JSON.parse(localStorage.getItem("profileUser") as string);
      if (!user) {
        user = userStore.profileUser as User;
        localStorage.setItem("profileUser", JSON.stringify(user));
      }
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
    localStorage.removeItem("userMemes");
    localStorage.removeItem("userLooped");
    localStorage.removeItem("userComments");
    localStorage.removeItem("userLiked");
    localStorage.removeItem("profileUser");
  });
</script>
<style lang=""></style>
