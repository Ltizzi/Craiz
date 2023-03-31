<template>
  <div class="w-full text-start">
    <div class="fixed w-full bg-slate-800 py-3 text-center opacity-90 lg:w-2/5">
      <h1 class="text-xl font-bold text-white">Notificaciones</h1>
    </div>

    <ul class="mt-14 ml-5 flex w-full flex-col gap-4 text-start">
      <li
        v-for="noti in notifications"
        :key="noti.notificationId"
        class="flex flex-row gap-3 py-2 text-xl"
      >
        <img :src="noti.fromUser[0].avatar" alt="" class="w-14 rounded-full" />
        <div
          v-if="noti.type == 'like'"
          class="flex flex-row items-center gap-3 text-xl"
        >
          <p>
            A {{ noti.fromUser[0].nickname }}
            <span v-if="noti.fromUser.length == 1">le gusta</span>
            <span v-if="noti.fromUser.length > 1">
              y a {{ noti.fromUser.length }} usuarios más les gusta
            </span>
            tu <router-link :to="'/meme?id=' + noti.memeId"> meme</router-link>.
          </p>
        </div>
        <div
          v-if="noti.type == 'loop'"
          class="flex flex-row items-center gap-3 text-xl"
        >
          <p>
            {{ noti.fromUser[0].nickname }}
            <span v-if="noti.fromUser.length == 1">ha loopeado</span>
            <span v-if="noti.fromUser.length > 1">
              y {{ noti.fromUser.length }} usuarios más han loopeado
            </span>
            tu <router-link :to="'/meme?id=' + noti.memeId"> meme</router-link>.
          </p>
        </div>
        <div
          v-if="noti.type == 'comment'"
          class="flex flex-row items-center gap-3 text-xl"
        >
          <p>
            {{ noti.fromUser[0].nickname }}
            <span v-if="noti.fromUser.length == 1">ha comentado</span>
            <span v-if="noti.fromUser.length > 1">
              y {{ noti.fromUser.length }} usuarios más han comentado
            </span>
            tu <router-link :to="'/meme?id=' + noti.memeId"> meme</router-link>.
          </p>
        </div>
        <div
          v-if="noti.type === 'follow'"
          class="flex flex-row items-center gap-3 text-xl"
        >
          <p>{{ noti.fromUser[0].nickname }} ha comenzado a seguirte.</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
  import axios from "axios";
  import { onMounted, ref } from "vue";
  import { useUserStore } from "@/store";
  import { API_URL } from "@/main";
  import { User } from "@/utils/models";

  const userStore = useUserStore();

  const notifications = ref();

  const isGuest = ref(false);

  async function fetchNotifications(id: number) {
    const response = await axios.get(
      `${API_URL}notifications/byUserId?id=${id}`
    );
    return response.data;
  }

  onMounted(async () => {
    try {
      const response = await axios.get(`${API_URL}auth/logincheck`, {
        withCredentials: true,
      });
      notifications.value = await fetchNotifications(response.data.user.userId);
    } catch (err) {
      console.log(err);
      isGuest.value = true;
    }
    // const user = userStore.user as User;
    // if (user != undefined) {
    //   notifications.value = await fetchNotifications(user.userId);
    // } else {
    //   const user = JSON.parse(localStorage.getItem("user") as string);
    //   if (user != undefined) {
    //     notifications.value = await fetchNotifications(user.userId);
    //   } else {
    //     try {
    //       const response = await axios.get(`${API_URL}auth/logincheck`, {
    //         withCredentials: true,
    //       });
    //       notifications.value = await fetchNotifications(
    //         response.data.user.userId
    //       );
    //     } catch (err) {
    //       console.log(err);
    //       isGuest.value = true;
    //     }
    //   }
    // }
    console.log(notifications.value);
    notifications.value.forEach((noti: any) => {
      console.log(noti.fromUser[0]);
    });
  });
</script>
