<template lang="">
  <div class="relative overflow-x-auto">
    <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
      <thead
        class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th scope="col" class="px-6 py-3">Avatar</th>
          <th scope="col" class="px-6 py-3">Username</th>
          <th scope="col" class="px-6 py-3">Nickname</th>
          <th scope="col" class="px-6 py-3">Estado</th>
          <th scope="col" class="px-6 py-3">Info</th>
          <th scope="col" class="px-6 py-3">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
          v-for="user in users"
          :key="user.userId"
        >
          <td>
            <img
              :src="user.avatar"
              class="mx-auto h-10 w-10 rounded-full"
              alt=""
            />
          </td>
          <router-link :to="'/' + user.username">
            <th
              scope="row"
              class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
            >
              {{ user.username }}
            </th>
          </router-link>

          <td class="px-6 py-4">{{ user.nickname }}</td>
          <td class="px-6 py-4">
            <div class="row flex flex-row gap-2">
              <font-awesome-icon
                icon="fa-solid fa-lock"
                class="text-amber-500"
                v-if="user.isAdmin"
              />
              <font-awesome-icon
                icon="fa-solid fa-hammer"
                v-if="user.isMod"
                class="text-slate-700"
              />
              <font-awesome-icon
                icon="fa-solid fa-circle-minus"
                class="text-red-600"
                v-if="user.softDeleted"
              />
            </div>
          </td>
          <td class="px-6 py-4">
            <div class="flex flex-col">
              <p>Memes: {{ user.memes.length }}</p>
              <p>Likes: {{ user.likeCounter }}</p>
            </div>
          </td>
          <td class="px-6 py-4">
            <div class="flex flex-row gap-1">
              <button
                class="rounded-xl bg-amber-500 px-2 py-1 text-white shadow-md shadow-gray-400"
                @click="makeUserAdmin(user.userId)"
              >
                <font-awesome-icon icon="fa-solid fa-lock" />
              </button>
              <button
                class="rounded-xl bg-slate-700 px-2 py-1 text-white shadow-md shadow-gray-400"
                @click="makeUserMod(user.userId)"
              >
                <font-awesome-icon icon="fa-solid fa-hammer" />
              </button>
              <button
                class="rounded-xl bg-red-500 px-2 py-1 text-white shadow-md shadow-gray-400"
              >
                <font-awesome-icon icon="fa-solid fa-circle-minus" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
  import { API_URL } from "@/main";
  import axios from "axios";
  import { onBeforeMount, ref } from "vue";

  const users = ref();

  async function makeUserAdmin(userId: number) {
    const response = await axios.get(`${API_URL}user/makeAdmin?id=${userId}`);
    if (response.data.message == "ok") {
      console.log("user is admin");
      const response = await getAllUsers();
      users.value = response.data;
    } else console.log("something went wrong");
  }

  async function makeUserMod(userId: number) {
    const response = await axios.get(`${API_URL}user/makeMod?id=${userId}`);
    if (response.data.message == "ok") {
      console.log("user is mod");
      const response = await getAllUsers();
      users.value = response.data;
    } else console.log("something went wrong");
  }

  async function getAllUsers() {
    return await axios.get(`${API_URL}user/all`);
  }

  onBeforeMount(async () => {
    const response = await getAllUsers();
    users.value = response.data;
  });
</script>
