<template lang="">
  <div>
    <div class="relative overflow-x-auto">
      <table
        class="w-full text-left text-sm text-gray-500 shadow-lg shadow-gray-400"
      >
        <thead
          class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="px-6 py-3">Meme preview</th>
            <th scope="col" class="px-6 py-3">Info</th>
            <th scope="col" class="px-6 py-3">Flag counter</th>
            <th scope="col" class="px-6 py-3">Status</th>
            <th scope="col" class="px-6 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
            v-for="meme in flaggedMemes"
            :key="meme.memeId"
          >
            <th
              scope="row"
              class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
            >
              <router-link :to="'/meme?id=' + meme.memeId">
                <img :src="meme.imgUrl" alt="" class="h-15 w-20 object-cover" />
              </router-link>
            </th>
            <td class="px-6 py-4">
              <div class="flex flex-col">
                <p>
                  <span class="font-extrabold">Uploader Id:</span>
                  {{ meme.uploader }}
                </p>
                <p>
                  <span class="font-extrabold">Likes:</span>
                  {{ meme.likeCounter }}
                </p>
                <p>
                  <span class="font-extrabold">Loops:</span>
                  {{ meme.loopCounter }}
                </p>
                <p>
                  <span class="font-extrabold">Es Comentario:</span>
                  <span v-if="meme.isComment"> Sí</span
                  ><span v-if="!meme.isComment"> No</span>
                </p>
                <p>
                  <span class="font-extrabold">Comentarios:</span>
                  {{ meme.commentsCounter }}
                </p>
              </div>
            </td>
            <td class="px-6 py-4">{{ meme.flagCounter }}</td>
            <td class="px-6 py-4">
              <font-awesome-icon
                icon="fa-solid fa-circle-check"
                class="rounded-full text-2xl text-emerald-500 shadow-lg shadow-gray-400"
                v-if="meme.isReviewed"
              />
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-row gap-1">
                <button @click="reviewMeme(meme.memeId)">
                  <font-awesome-icon
                    icon="fa-solid fa-circle-check"
                    class="rounded-full text-2xl text-emerald-500 shadow-lg shadow-gray-400"
                  />
                </button>
                <button @click="softDeleteMeme(meme.memeId)">
                  <font-awesome-icon
                    icon="fa-solid fa-hammer"
                    class="rounded-full bg-red-500 p-1 text-base text-white shadow-lg shadow-gray-400"
                  />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <nav aria-label="Page navigation example">
        <div class="mb-5 mt-5 flex justify-center">
          <ul class="inline-flex items-center -space-x-px">
            <li class="shadow-lg shadow-gray-400">
              <a
                class="ml-0 block rounded-l-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:cursor-pointer hover:bg-violet-500 hover:text-white"
                @click="flagGoPrevious"
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
            <li
              v-for="page in flaggedPages"
              :key="page"
              class="shadow-lg shadow-gray-400"
            >
              <a
                href="#"
                :class="[
                  'border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-violet-500 hover:font-extrabold hover:text-white',
                  state.flag.current === page
                    ? 'bg-violet-500 font-extrabold text-violet-500'
                    : '',
                ]"
                @click="flagGoPage(page)"
              >
                {{ page }}
              </a>
            </li>

            <li class="shadow-lg shadow-gray-400">
              <a
                class="block rounded-r-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:cursor-pointer hover:bg-violet-500 hover:text-white"
                @click="flagGoNext"
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
  </div>
</template>
<script setup lang="ts">
  import { API_URL } from "@/main";
  import axios from "axios";
  import { onBeforeMount, onMounted, reactive, ref } from "vue";
  import { number } from "yup";

  const flaggedMemes = ref();
  const MEMES_PER_PAGE = 10;

  async function getAllFlaggedMemes(skip: number, limit: number) {
    return await axios.get(
      `${API_URL}meme/getAllFlagged?skip=${skip}&limit=${limit}`
    );
  }

  async function reviewMeme(memeId: number) {
    const response = await axios.get(`${API_URL}meme/review?memeId=${memeId}`);
    const skip = state.flag.current * MEMES_PER_PAGE - MEMES_PER_PAGE;
    const resMemes = await getAllFlaggedMemes(skip, MEMES_PER_PAGE);
    flaggedMemes.value = resMemes.data;
  }

  async function softDeleteMeme(memeId: number) {
    const response = await axios.delete(
      `${API_URL}meme/modDelete?memeId=${memeId}`
    );
    const skip = state.flag.current * MEMES_PER_PAGE - MEMES_PER_PAGE;
    const resMemes = await getAllFlaggedMemes(skip, MEMES_PER_PAGE);
    flaggedMemes.value = resMemes.data;
  }

  //pagination
  const totalFlaggedCount = ref();
  const flaggedPages = ref<number[]>([]);

  const state = reactive({
    currentTab: "flag",
    flag: {
      current: 1,
      total: 1,
    },
  });

  async function flagGoPrevious() {
    if (state.flag.current != 1) {
      const targetPage = state.flag.current - 1;
      await flagGoPage(targetPage);
    }
  }

  async function flagGoNext() {
    if (state.flag.current != state.flag.total) {
      const targetPage = state.flag.current + 1;
      await flagGoPage(targetPage);
    }
  }

  async function flagGoPage(page: number) {
    const skip = page * MEMES_PER_PAGE - MEMES_PER_PAGE;
    const response = await getAllFlaggedMemes(skip, MEMES_PER_PAGE);
    flaggedMemes.value = response.data;
    state.flag.current = page;
  }

  async function getFlagTotalPages() {
    const resFlagCount = await axios.get(`${API_URL}meme/countFlagged`);
    totalFlaggedCount.value = resFlagCount.data;
    state.flag.total = Math.ceil(totalFlaggedCount.value / MEMES_PER_PAGE);
    for (let i = 1; i <= state.flag.total; i++) {
      flaggedPages.value.push(i);
    }
  }

  onMounted(async () => {
    const resFlagged = await getAllFlaggedMemes(0, MEMES_PER_PAGE);
    flaggedMemes.value = resFlagged.data;
    await getFlagTotalPages();
  });
</script>
<style lang=""></style>
