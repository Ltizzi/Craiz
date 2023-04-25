<template>
  <div
    class="h-screen w-full overflow-hidden bg-gray-200 text-start"
    v-if="isLoaded"
  >
    <div
      class="l fixed w-full bg-slate-800 py-3 text-center opacity-90 lg:-ml-0.5 lg:w-6/12 2xl:w-2/5"
    >
      <h1 class="text-xl font-bold text-white">Notificaciones</h1>
    </div>

    <ul
      class="mt-14 flex h-screen w-full flex-col gap-0 overflow-scroll text-start"
      id="lista"
      ref="listEl"
    >
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
            class="flex flex-row items-center gap-3 text-lg lg:text-xl"
          >
            <p>
              A
              <router-link
                :to="'/' + noti.fromUser[noti.fromUser.length - 1].username"
              >
                <span
                  class="hover:cursor-pointer hover:font-bold hover:text-violet-500"
                  >{{ noti.fromUser[noti.fromUser.length - 1].nickname }}
                </span>
              </router-link>

              <span v-if="noti.fromUser.length == 1"> le gusta</span>
              <span v-if="noti.fromUser.length > 1">
                y a {{ noti.fromUser.length }} usuarios más les gusta
              </span>
              tu
              <router-link :to="'/meme?id=' + noti.memeId">
                <span
                  class="hover:cursor-pointer hover:font-bold hover:text-violet-500"
                >
                  meme</span
                ></router-link
              >.
            </p>
          </div>
          <div
            v-if="noti.type == 'loop'"
            class="flex flex-row items-center gap-3 text-lg lg:text-xl"
          >
            <p>
              <router-link
                :to="'/' + noti.fromUser[noti.fromUser.length - 1].username"
              >
                <span
                  class="hover:cursor-pointer hover:font-bold hover:text-violet-500"
                >
                  {{ noti.fromUser[noti.fromUser.length - 1].nickname }}
                </span>
              </router-link>
              <span v-if="noti.fromUser.length == 1"> ha loopeado</span>
              <span v-if="noti.fromUser.length > 1">
                y {{ noti.fromUser.length }} usuarios más han loopeado
              </span>
              tu
              <router-link :to="'/meme?id=' + noti.memeId">
                <span
                  class="hover:cursor-pointer hover:font-bold hover:text-violet-500"
                >
                  meme</span
                ></router-link
              >.
            </p>
          </div>

          <div
            v-if="noti.type == 'comment'"
            class="flex flex-row items-center gap-3 text-lg lg:text-xl"
          >
            <p>
              <router-link
                :to="'/' + noti.fromUser[noti.fromUser.length - 1].username"
              >
                <span
                  class="hover:cursor-pointer hover:font-bold hover:text-violet-500"
                >
                  {{ noti.fromUser[noti.fromUser.length - 1].nickname }}
                </span>
              </router-link>

              <span v-if="noti.fromUser.length == 1"> ha comentado</span>
              <span v-if="noti.fromUser.length > 1">
                y {{ noti.fromUser.length }} usuarios más han comentado
              </span>
              tu
              <router-link :to="'/meme?id=' + noti.memeId">
                <span
                  class="hover:cursor-pointer hover:font-bold hover:text-violet-500"
                >
                  meme</span
                ></router-link
              >.
            </p>
          </div>
          <div
            v-if="noti.type === 'follow'"
            class="flex flex-row items-center gap-3 text-lg lg:text-xl"
          >
            <router-link :to="'/' + noti.fromUser[0].username">
              <p>
                <span
                  class="hover:cursor-pointer hover:font-bold hover:text-violet-500"
                >
                  {{ noti.fromUser[0].nickname }}
                </span>
                ha comenzado a seguirte.
              </p>
            </router-link>

            <!-- <BaseFollow
              :userToFollowoId="noti.fromUser[0].userId"
              :userFollow="!checkFollows(noti.fromUser[0].userId)"
              :sameUser="checkSameUser(noti.fromUser[0].userId)"
            /> -->
          </div>
        </div>
        <router-link :to="'/meme?id=' + noti.memeId" class="mx-auto">
          <img
            :src="noti.ownerMemeUrl"
            v-if="noti.type != 'comment'"
            class="mx-auto w-72"
            alt=""
          />
        </router-link>

        <router-link :to="'/meme?id=' + noti.memeId" class="mx-auto">
          <img
            :src="noti.fromUser[noti.fromUser.length - 1].commentUrl"
            v-if="noti.type == 'comment'"
            class="mx-auto w-72"
            alt=""
          />
        </router-link>
      </li>
      <div v-if="isLoading">
        <BaseSpinner />
      </div>
    </ul>
  </div>
</template>
<script setup lang="ts">
  // import BaseFollow from "@/components/common/BaseFollow.vue";
  import axios from "axios";
  import { onBeforeMount, onMounted, ref } from "vue";
  import BaseSpinner from "@/components/common/BaseSpinner.vue";
  import EventBus from "@/utils/EventBus";
  import { API_URL } from "@/main";
  import { UseInfiniteScrollOptions, useInfiniteScroll } from "@vueuse/core";

  const notifications = ref();

  const isGuest = ref(false);
  const isLoaded = ref(false);

  const userId = ref();

  //metodo que hace query de notificaciones por id

  async function fetchNotifications(id: number, skip: number, limit: number) {
    const response = await axios.get(
      `${API_URL}notifications/byUserId?id=${id}&skip=${skip}&limit=${limit}`
    );
    return response.data;
  }

  //agrega mouseover event listener para marcar notificaciones como vistas

  async function addHoverCheck() {
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

  //infinite scroll

  const listEl = ref(null);

  const notisToShow = 10;

  const isLoading = ref(false);

  useInfiniteScroll(
    listEl,
    async () => {
      if (isLoading.value) return;
      isLoading.value = true;
      const newNotis = await fetchNotifications(
        userId.value,
        notifications.value.length,
        notisToShow
      );
      notifications.value.push(...newNotis);
      addHoverCheck();
      isLoading.value = false;
    },
    { distance: 100 }
  );

  //para actualizar las notificaciones cuando son vistas

  const currentNoti = ref();

  //HANDLE FOLLOW BUTTON

  // function checkFollows(id: number){
  //   const user = JSON.parse(localStorage.getItem("user")as string);
  //   return user.follows.includes(id);
  // }

  // function checkSameUser(id:number){
  //   const user = JSON.parse(localStorage.getItem("user")as string);
  //   return user.userId == id;
  // }

  // EventBus.on("handleFollows", async(id)=>{
  //   const user = JSON.parse(localStorage.getItem("user") as string);
  //   if(user.userId != id) {
  //     const response = await axios.patch(`${API_URL}user/handleFollows?userId=${user.userId}&userToFollowId=${id}`, null, {withCredentials:true})
  //   };
  //   if(response.data.res =="followed"){
  //     user.follows.push(id);
  //     localStorage.setItem("user", JSON.stringify(user));

  //   }
  //   if(response.data.res == "unfollowed"){
  //     user.follows = user.follows.filter((usr:number)=> usr != id);
  //     localStorage.setItem("user", JSON.stringify(user));

  //   }
  // })

  onBeforeMount(async () => {
    try {
      const response = await axios.get(`${API_URL}auth/logincheck`, {
        withCredentials: true,
      });
      userId.value = response.data.user.userId;
      notifications.value = await fetchNotifications(userId.value, 0, 10);
      isLoaded.value = true;
    } catch (err) {
      console.log(err);
      isGuest.value = true;
    }
  });

  onMounted(async () => {
    setTimeout(() => {
      if (isLoaded.value) {
        addHoverCheck();
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
