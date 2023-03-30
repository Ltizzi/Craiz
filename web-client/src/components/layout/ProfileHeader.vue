<template lang="">
  <div class="flex flex-col items-start justify-start gap-0">
    <ProfileHeaderTop
      :nickname="props.user.nickname"
      :memes="props.user.memes.length"
    />
    <div class="relative w-full">
      <img
        :src="props.user.banner"
        v-if="props.user.banner"
        alt=""
        class="h-72 w-full object-cover"
      />
      <div class="h-56 w-full bg-slate-300" v-else></div>
      <img
        :src="props.user.avatar"
        alt=""
        class="absolute top-64 left-2 h-20 w-20 rounded-full"
      />
      <BaseButton
        class="absolute top-72 right-2 mt-2 rounded-xl bg-slate-500 py-1 px-3 text-white"
        v-if="isOwnProfile"
        @click="modalSwitch"
        >Editar Perfil</BaseButton
      >
      <EditProfileModal v-if="showModal" />
      <BaseButton
        class="absolute top-72 right-2 mt-2 rounded-xl bg-slate-500 py-1 px-3 text-white"
        v-if="!isOwnProfile && !following"
        @click="handleFollows"
        >Seguir</BaseButton
      >
      <BaseButton
        class="absolute top-72 right-2 mt-2 rounded-xl bg-slate-500 py-1 px-3 text-white"
        @click="handleFollows"
        v-if="!isOwnProfile && following"
        >Dejar de seguir</BaseButton
      >
    </div>
    <div class="mt-16 ml-2 flex flex-col justify-start">
      <h1 class="text-2xl font-extrabold text-gray-700">
        {{ props.user.nickname }}
      </h1>
      <h3 class="text-lg italic text-gray-600">@{{ props.user.username }}</h3>
      <p class="my-4 text-lg">{{ props.user.about }}</p>
      <div
        class="flex flex-row items-start justify-start gap-1 text-lg"
        v-show="birthdayWithFormat"
      >
        <p>Fecha de nacimiento:</p>
        <p>{{ birthdayWithFormat }}</p>
      </div>
      <p>{{ props.user.createdAt }}</p>
      <div
        class="mt-2 flex flex-row items-center justify-start gap-2 text-start"
      >
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
  import { onBeforeMount, onMounted, ref } from "vue";
  import ProfileHeaderTop from "../ui/ProfileHeaderTop.vue";
  import BaseButton from "../common/BaseButton.vue";
  import EditProfileModal from "../ui/EditProfileModal.vue";
  import { User } from "@/utils/models";
  import { useUserStore } from "@/store";
  import axios from "axios";
  import { API_URL } from "@/main";
  import EventBus from "@/utils/EventBus";

  const userStore = useUserStore();

  const props = defineProps({
    user: {
      type: Object,
    },
  });

  const isOwnProfile = ref(false);
  const hasBanner = ref(false);

  const following = ref();

  const birthdayWithFormat = ref();

  const loggedUser = ref(userStore.user);
  const profileUser = ref(props.user);

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
      updateUsers();
    }
    if (response.data.res == "unfollowed") {
      console.log("se dejó de seguir a usuario");
      if (props.user) props.user.followersCounter -= 1;
      updateUsers();
    }
  }

  EventBus.on("reloadProfileInfo", (user: any) => {
    if (user == loggedUser.value) {
      isOwnProfile.value = true;
    }
  });

  async function updateUsers() {
    const id = userStore.userId;
    await userStore.fetchUser(id);
    if (props.user) await userStore.refreshProfileUser(props.user.userId);
    loggedUser.value = userStore.user;
    profileUser.value = userStore.profileUser;
    handleUsers(loggedUser.value as User, profileUser.value as User);
  }

  function handleUsers(logUser: User, profUser: User) {
    if (logUser.userId == profUser.userId) isOwnProfile.value = true;
    if (!isOwnProfile.value) {
      const loggedUserFollows = logUser.follows.includes(profUser.userId);
      if (loggedUserFollows) following.value = true;
      else following.value = false;
    }
  }

  function handleDate(date: string) {
    let months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    let firstSplit = date.split("T");
    let dateSplited = firstSplit[0].split("-");
    let birthday = {
      day: dateSplited[2],
      month: dateSplited[1],
      year: dateSplited[0],
    };
    return (
      birthday.day +
      " de " +
      months[parseInt(birthday.month) - 1] +
      " de " +
      birthday.year
    );
  }

  onBeforeMount(async () => {
    handleUsers(loggedUser.value as User, profileUser.value as User);
    if (props.user && props.user.birthday)
      birthdayWithFormat.value = handleDate(props.user.birthday);
  });

  onMounted(async () => {
    handleUsers(loggedUser.value as User, profileUser.value as User);
  });

  //Edit profile Modal

  const showModal = ref(false);

  EventBus.on("closeModal", () => {
    showModal.value = false;
  });

  function modalSwitch() {
    showModal.value = !showModal.value;
    EventBus.emit("openDialog");
  }
</script>
<style lang=""></style>
