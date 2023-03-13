<template lang="">
  <div class="flex flex-col items-start justify-start gap-0">
    <ProfileHeaderTop
      :nickname="props.user.nickname"
      :memes="props.user.memes.length"
    />
    <div class="relative w-full">
      <img :src="props.user.banner" v-if="!props.user.banner" alt="" class="" />
      <div class="mt-10 h-44 w-full bg-slate-300"></div>
      <img
        :src="props.user.avatar"
        alt=""
        class="absolute top-48 left-2 w-20 rounded-full"
      />
      <BaseButton
        class="absolute top-56 right-2 rounded-xl bg-slate-500 py-1 px-3 text-white"
        v-if="isOwnProfile"
        >Editar Perfil</BaseButton
      >
      <BaseButton
        class="absolute top-56 right-2 rounded-xl bg-slate-500 py-1 px-3 text-white"
        v-if="!isOwnProfile && !following"
        @click="handleFollows"
        >Seguir</BaseButton
      >
      <BaseButton
        class="absolute top-56 right-2 rounded-xl bg-slate-500 py-1 px-3 text-white"
        @click="handleFollows"
        v-if="!isOwnProfile && following"
        >Dejar de seguir</BaseButton
      >
    </div>
    <div class="mt-16 ml-2 flex flex-col justify-start">
      <h1 class="text-xl font-extrabold text-gray-700">
        {{ props.user.nickname }}
      </h1>
      <h3 class="text-lg italic text-gray-600">@{{ props.user.username }}</h3>
      <p>{{ props.user.about }}</p>
      <p>{{ props.user.birthday }}</p>
      <p>{{ props.user.createdAt }}</p>
      <div class="mt-2 flex flex-row items-center justify-around gap-10">
        <div class="flex items-center gap-1">
          <span class="text-lg font-bold">{{ props.user.followsCounter }}</span>
          <p class="text-text-gray-500 italic">Siguiendo</p>
        </div>
        <div class="flex items-center gap-1">
          <span class="text-lg font-bold">{{
            props.user.followersCounter
          }}</span>
          <p class="text-text-gray-500 italic">Seguidores</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { onBeforeMount, ref } from "vue";
  import ProfileHeaderTop from "../ui/ProfileHeaderTop.vue";
  import BaseButton from "../common/BaseButton.vue";
  import { User } from "@/utils/models";
  import { useUserStore } from "@/store";
  import axios from "axios";
  import { API_URL } from "@/main";

  const userStore = useUserStore();

  const props = defineProps({
    user: {
      type: Object,
    },
  });

  const isOwnProfile = ref(false);

  const following = ref();

  async function handleFollows() {
    const user = userStore.user as User;
    const profileUser = props.user as User;
    const response = await axios.patch(
      `${API_URL}user/handleFollows?userId=${user.userId}&userToFollowId=${profileUser.userId}`,
      null,
      { withCredentials: true }
    );
    if (response.data.res == "followed") {
      console.log("usuario seguido");
      if (props.user) props.user.followersCounter += 1;
    }
    if (response.data.res == "unfollowed") {
      console.log("se dejó de seguir a usuario");
      if (props.user) props.user.followersCounter -= 1;
    }
  }

  onBeforeMount(async () => {
    const loggedUser = userStore.user as User;
    const profileUser = props.user as User;
    if (loggedUser.userId == profileUser.userId) isOwnProfile.value = true;
    if (!isOwnProfile.value) {
      const loggedUserFollows = loggedUser.follows.includes(profileUser.userId);
      if (loggedUserFollows) following.value = false;

      // .filter(
      //   (usr) => profileUser.userId
      // );
    }
  });
</script>
<style lang=""></style>
