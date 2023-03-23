<template lang="">
  <div class="relative inline-block">
    <button @click.stop="showDropdownMenu">
      <font-awesome-icon icon="fa-solid fa-ellipsis" class="text-2xl" />
    </button>
    <div
      class="absolute -left-52 z-10 block w-60 rounded-2xl bg-slate-600 text-white shadow-lg shadow-slate-800"
      v-if="showDropdown"
      ref="dropdown"
    >
      <ul class="m-2 p-2">
        <li
          class="rounded-xl py-2 px-3 text-white hover:cursor-pointer hover:bg-emerald-500"
          v-if="!userIsOwner && !following"
          @click="handleFollows"
        >
          Seguir a @{{ memeOwner.username }}
        </li>
        <li
          class="rounded-xl py-2 px-3 text-white hover:cursor-pointer hover:bg-emerald-500"
          v-if="!userIsOwner && following"
          @click="handleFollows"
        >
          Dejar de seguir a @{{ memeOwner.username }}
        </li>
        <li
          class="rounded-xl py-2 px-3 text-white hover:cursor-pointer hover:bg-emerald-500"
        >
          Reportar Meme
        </li>
        <li
          class="rounded-xl py-2 px-3 text-white hover:cursor-pointer hover:bg-emerald-500"
          @click="deleteMeme"
          v-if="userIsOwner"
        >
          Borrar Meme
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from "vue";
  import { useUserStore } from "@/store";
  import { useMemesStore } from "@/store/memes";
  import axios from "axios";
  import { API_URL } from "@/main";
  import { Meme, User } from "@/utils/models";
  import EventBus from "@/utils/EventBus";

  let userIsOwner = ref(false);

  let props = defineProps({
    memeId: {
      type: Number,
      required: true,
    },
  });

  const user = ref();
  const memeOwner = ref();

  const userStore = useUserStore();
  const memeStore = useMemesStore();

  async function deleteMeme() {
    await memeStore.fetchMemeById(props.memeId);
    const meme = memeStore.memeById as Meme;
    const user = userStore.user as User;
    console.log("meme: ", meme.memeId);
    console.log("user: ", user.userId);
    try {
      const response = await axios.delete(
        `${API_URL}meme/delete?memeId=${meme.memeId}&userId=${user.userId}`,
        { withCredentials: true }
      );
      console.log(response.data);
      if (meme.isComment) {
        await memeStore.fetchCommentsById(meme.parentMeme);
        EventBus.emit("reloadComments");
        showDropdown.value = !showDropdown.value;
      } else {
        await memeStore.fetchMemesWoC();
        EventBus.emit("reloadMemes");
        showDropdown.value = !showDropdown.value;
      }
    } catch (err) {
      console.log(err);
    }
  }
  onMounted(async () => {
    document.addEventListener("click", handleClickOutside);
    const response = await axios.get(`${API_URL}meme/byId?id=${props.memeId}`);
    const meme = response.data;
    const fetchUserResponse = await axios.get(
      `${API_URL}user/byId?id=${meme.uploader}`
    );
    memeOwner.value = fetchUserResponse.data;
    user.value = userStore.user;

    if (meme.uploader == user.value.userId) {
      userIsOwner.value = true;
    }
    if (user.value.follows.includes(memeOwner.value.userId))
      following.value = true;
    else following.value = false;
  });

  //following handler
  const following = ref();

  async function handleFollows() {
    const response = await axios.patch(
      `${API_URL}user/handleFollows?userId=${user.value.userId}&userToFollowId=${memeOwner.value.userId}`,
      null,
      { withCredentials: true }
    );
    if (response.data.res == "followed") {
      following.value = true;
    }
    if (response.data.res == "unfollowed") {
      following.value = false;
    }
  }

  //open-close dropdown

  const dropdown = ref<HTMLElement | null>(null);

  let showDropdown = ref(false);

  function showDropdownMenu() {
    console.log("asdasd");
    showDropdown.value = !showDropdown.value;
  }

  function handleClickOutside(event: MouseEvent) {
    if (
      dropdown.value &&
      !dropdown.value.contains(event.target as HTMLElement)
    ) {
      showDropdown.value = !showDropdown.value;
    }
  }

  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });
</script>
<style lang=""></style>
