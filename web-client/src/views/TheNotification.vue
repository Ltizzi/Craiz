<template>
  <div class="h-full w-full bg-gray-200 text-start" v-if="isLoaded">
    <div
      class="fixed w-full bg-slate-800 py-3 text-center opacity-90 md:-ml-0.5 md:w-6/12 lg:w-2/5"
    >
      <h1 class="text-xl font-bold text-white">Notificaciones</h1>
    </div>

    <ul class="mt-14 flex w-full flex-col gap-0 text-start" id="lista">
      <li
        v-for="(noti, index) in notifications"
        :key="noti.notificationId"
        class="noti-list flex min-h-min flex-col items-start justify-start gap-3 border-2 border-t-0 border-gray-300 bg-gray-50 px-4 py-2 text-xl text-gray-600"
        :class="{ 'bg-purple-200': noti.isNewN }"
        :id="index.toString()"
      >
        <div class="flex flex-row justify-start gap-2">
          <img
            :src="noti.fromUser[noti.fromUser.length - 1].avatar"
            alt=""
            class="h-14 w-14 rounded-full"
          />
          <div
            v-if="noti.type == 'like'"
            class="flex flex-row items-center gap-3 text-lg md:text-xl"
          >
            <p>
              A {{ noti.fromUser[noti.fromUser.length - 1].nickname }}
              <span v-if="noti.fromUser.length == 1">le gusta</span>
              <span v-if="noti.fromUser.length > 1">
                y a {{ noti.fromUser.length }} usuarios más les gusta
              </span>
              tu
              <router-link :to="'/meme?id=' + noti.memeId">
                <span class="hover:font-extrabold hover:text-violet-600">
                  meme</span
                ></router-link
              >.
            </p>
          </div>
          <div
            v-if="noti.type == 'loop'"
            class="flex flex-row items-center gap-3 text-lg md:text-xl"
          >
            <p>
              {{ noti.fromUser[noti.fromUser.length - 1].nickname }}
              <span v-if="noti.fromUser.length == 1">ha loopeado</span>
              <span v-if="noti.fromUser.length > 1">
                y {{ noti.fromUser.length }} usuarios más han loopeado
              </span>
              tu
              <router-link :to="'/meme?id=' + noti.memeId">
                <span class="hover:font-extrabold hover:text-violet-600">
                  meme</span
                ></router-link
              >.
            </p>
          </div>

          <div
            v-if="noti.type == 'comment'"
            class="flex flex-row items-center gap-3 text-lg md:text-xl"
          >
            <p>
              {{ noti.fromUser[noti.fromUser.length - 1].nickname }}
              <span v-if="noti.fromUser.length == 1">ha comentado</span>
              <span v-if="noti.fromUser.length > 1">
                y {{ noti.fromUser.length }} usuarios más han comentado
              </span>
              tu
              <router-link :to="'/meme?id=' + noti.memeId">
                <span class="hover:font-extrabold hover:text-violet-600">
                  meme</span
                ></router-link
              >.
            </p>
          </div>
          <div
            v-if="noti.type === 'follow'"
            class="flex flex-row items-center gap-3 text-lg md:text-xl"
          >
            <p>{{ noti.fromUser[0].nickname }} ha comenzado a seguirte.</p>
          </div>
        </div>
        <img
          :src="noti.ownerMemeUrl"
          v-if="noti.type != 'comment'"
          class="mx-auto w-72"
          alt=""
        />
        <img
          :src="noti.fromUser[noti.fromUser.length - 1].commentUrl"
          v-if="noti.type == 'comment'"
          class="ml-14 w-40"
          alt=""
        />
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
  import axios from "axios";
  import { onBeforeMount, onMounted, ref } from "vue";
  import EventBus from "@/utils/EventBus";
  import { API_URL } from "@/main";

  const notifications = ref();

  const isGuest = ref(false);
  const isLoaded = ref(false);

  async function fetchNotifications(id: number) {
    const response = await axios.get(
      `${API_URL}notifications/byUserId?id=${id}`
    );
    return response.data;
  }

  //para actualizar las notificaciones cuando son vistas

  const currentNoti = ref();

  onBeforeMount(async () => {
    try {
      const response = await axios.get(`${API_URL}auth/logincheck`, {
        withCredentials: true,
      });
      notifications.value = await fetchNotifications(response.data.user.userId);
      isLoaded.value = true;
    } catch (err) {
      console.log(err);
      isGuest.value = true;
    }
  });

  onMounted(async () => {
    setTimeout(() => {
      if (isLoaded.value) {
        const allLis = document.querySelectorAll(".noti-list");
        allLis.forEach((element) => {
          element.addEventListener("mouseover", async (event) => {
            const index = parseInt(element.getAttribute("id") as string);
            const noti = notifications.value[index];
            if (noti.isNewN) {
              await axios
                .post(`${API_URL}notifications/check`, noti, {
                  withCredentials: true,
                })
                .then((res) => {
                  noti.isNewN = false;
                  EventBus.emit("reloadNewNotis");
                });
            }
          });
        });
      }
    }, 2000);

    // setTimeout(() => {
    //   const observer = new IntersectionObserver(async (entries) => {
    //     entries.forEach(async (entry) => {
    //       if (entry.intersectionRatio > 0) {
    //         console.log(entry);
    //         const target = entry.target as HTMLElement;
    //         currentNoti.value = target.getAttribute("data-id");
    //         console.log(currentNoti.value);
    //         const notification =
    //           notifications.value[parseInt(currentNoti.value)];

    //         if (notification && notification.isNewN == true) {
    //           await axios
    //             .post(`${API_URL}notifications/check`, notification, {
    //               withCredentials: true,
    //             })
    //             .then((res) => {
    //               notification.isNewN = false;
    //               observer.unobserve(entry.target);
    //             });
    //         }
    //       }
    //     });
    //   });
    //   document.querySelectorAll("li").forEach((el) => {
    //     observer.observe(el);
    //   });
    // }, 3000);
  });
</script>
