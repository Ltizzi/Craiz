<template lang="">
  <div class="relative inline-block">
    <BaseButton @click="showDropdownMenu">
      <font-awesome-icon icon="fa-solid fa-ellipsis" class="text-2xl" />
    </BaseButton>
    <div
      class="absolute z-10 block w-48 rounded-2xl bg-slate-600 text-white shadow-lg shadow-slate-800"
      v-if="showDropdown"
    >
      <ul class="m-2 p-2">
        <li
          class="rounded-xl py-2 px-3 text-white hover:cursor-pointer hover:bg-emerald-500"
          v-if="!userIsOwner"
        >
          Seguir a @{{ user.username }}
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
  import { onMounted, ref } from "vue";
  import BaseButton from "../common/BaseButton.vue";
  import { useUserStore } from "@/store";
  import { useMemesStore } from "@/store/memes";
  import axios from "axios";
  import { API_URL } from "@/main";
  import { Meme, User } from "@/utils/models";
  import EventBus from "@/utils/EventBus";

  let showDropdown = ref(false);
  let userIsOwner = ref(false);

  let props = defineProps({
    memeId: {
      type: Number,
      required: true,
    },
  });

  const user = ref();

  const userStore = useUserStore();
  const memeStore = useMemesStore();

  function showDropdownMenu() {
    showDropdown.value = !showDropdown.value;
  }

  async function deleteMeme() {
    const meme = memeStore.memeById as Meme;
    const user = userStore.user as User;
    console.log("***---***");
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
    await memeStore.fetchMemeById(props.memeId);
    const meme = memeStore.memeById as Meme;
    user.value = userStore.user;

    if (meme.uploader == user.value.userId) {
      userIsOwner.value = true;
    }
  });
</script>
<style lang=""></style>
