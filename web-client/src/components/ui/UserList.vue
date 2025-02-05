<template lang="">
  <div class="relative overflow-x-auto">
    <table
      class="mb-5 w-full rounded-2xl text-left text-sm text-gray-500 shadow-xl shadow-gray-400 dark:text-gray-400"
    >
      <thead
        class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th scope="col" class="px-6 py-3">Avatar</th>
          <th scope="col" class="px-6 py-3">Usuario</th>
          <!-- <th scope="col" class="px-6 py-3">Email</th> -->
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
              <div class="flex flex-col justify-center">
                <p>
                  <span class="font-extrabold">Usuario: </span>
                  {{ user.username }}
                </p>
                <p>
                  <span class="font-extrabold">Nickname: </span>
                  {{ user.nickname }}
                </p>
                <p>
                  <span class="font-extrabold">E-mail: </span> {{ user.email }}
                </p>
                <p>
                  <span class="font-extrabold">Nombre: </span> {{ user.name }}
                </p>
              </div>
            </th>
          </router-link>

          <!-- <td class="px-6 py-4">{{ user.nickname }}</td> -->
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
              <button
                class="rounded-xl bg-fuchsia-700 px-2 py-1 text-white shadow-md shadow-gray-400"
              >
                <font-awesome-icon icon="fa-solid fa-ban" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <nav aria-label="Page navigation example">
      <div class="mb-5 flex justify-center">
        <ul class="inline-flex items-center -space-x-px">
          <li>
            <a
              class="ml-0 block rounded-l-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:cursor-pointer hover:bg-violet-500 hover:text-white"
              @click="goPrevious"
            >
              <span class="sr-only">Anterior</span>
              <svg
                aria-hidden="true"
                class="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </a>
          </li>
          <li v-for="page in pages" :key="page">
            <a
              href="#"
              :class="[
                'border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-violet-500 hover:font-extrabold hover:text-white',
                state.currentPage === page
                  ? 'bg-violet-500 font-extrabold text-violet-500'
                  : '',
              ]"
              @click="goPage(page)"
            >
              {{ page }}
            </a>
          </li>

          <li>
            <a
              class="block rounded-r-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:cursor-pointer hover:bg-violet-500 hover:text-white"
              @click="goNext"
            >
              <span class="sr-only">Siguiente</span>
              <svg
                aria-hidden="true"
                class="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>
<script setup lang="ts">
  import { API_URL } from "@/main";
  import axios from "axios";
  import { onBeforeMount, reactive, ref } from "vue";

  const users = ref();

  const USERS_PER_PAGE = 5;

  async function makeUserAdmin(userId: number) {
    const response = await axios.get(`${API_URL}user/makeAdmin?id=${userId}`);
    if (response.data.message == "ok") {
      console.log("user is admin");
      const skip = state.currentPage * USERS_PER_PAGE - USERS_PER_PAGE;
      const response = await getAllUsers(skip, USERS_PER_PAGE);
      users.value = response.data;
    } else console.log("something went wrong");
  }

  async function makeUserMod(userId: number) {
    const response = await axios.get(`${API_URL}user/makeMod?id=${userId}`);
    if (response.data.message == "ok") {
      console.log("user is mod");
      const skip = state.currentPage * USERS_PER_PAGE - USERS_PER_PAGE;
      const response = await getAllUsers(skip, USERS_PER_PAGE);
      users.value = response.data;
    } else console.log("something went wrong");
  }

  async function getAllUsers(skip: number, limit: number) {
    return await axios.get(`${API_URL}user/all?skip=${skip}&limit=${limit}`);
  }

  onBeforeMount(async () => {
    const response = await getAllUsers(0, USERS_PER_PAGE);
    users.value = response.data;

    const res = await axios.get(`${API_URL}user/count`);
    totalUserCount.value = res.data;
    state.totalPages = Math.ceil(totalUserCount.value / USERS_PER_PAGE);
    for (let i = 1; i <= state.totalPages; i++) {
      pages.value.push(i);
    }
  });

  //pagination
  const totalUserCount = ref();
  const pages = ref<number[]>([]);

  const state = reactive({
    currentPage: 1,
    totalPages: 1,
  });

  async function goPrevious() {
    if (state.currentPage != 1) {
      const targetPage = state.currentPage - 1;
      await goPage(targetPage);
    }
  }

  async function goNext() {
    if (state.currentPage != state.totalPages) {
      const targetPage = state.currentPage + 1;
      await goPage(targetPage);
    }
  }

  async function goPage(page: number) {
    const skip = page * USERS_PER_PAGE - USERS_PER_PAGE;
    const response = await getAllUsers(skip, USERS_PER_PAGE);
    users.value = response.data;
    state.currentPage = page;
  }
</script>
