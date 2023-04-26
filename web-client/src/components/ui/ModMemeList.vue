<template lang="">
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
          <th scope="col" class="px-6 py-3">Status</th>
          <th scope="col" class="px-6 py-3">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
          v-for="meme in moderatedMemes"
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
          <td class="px-6 py-4">
            <font-awesome-icon
              icon="fa-solid fa-circle-check"
              class="rounded-full text-2xl text-emerald-500"
              v-if="meme.isReviewed"
            />
            <font-awesome-icon
              icon="fa-solid fa-hammer"
              class="rounded-full bg-red-500 p-1 text-base text-white"
              v-if="meme.softDeleted"
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
          <li
            v-for="page in moderatedPages"
            :key="page"
            class="shadow-lg shadow-gray-400"
          >
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

          <li class="shadow-lg shadow-gray-400">
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
  import { onMounted, reactive, ref } from "vue";

  const moderatedMemes = ref();

  const MEMES_PER_PAGE = 10;

  async function getAllModeratedMemes(skip: number, limit: number) {
    return await axios.get(
      `${API_URL}meme/softDeleted?skip=${skip}&limit=${limit}`
    );
  }

  //pagination

  const totalModeratedCount = ref();
  const moderatedPages = ref<number[]>([]);

  const state = reactive({
    mod: {
      current: 1,
      total: 1,
    },
  });

  async function modGoPrevious() {
    if (state.mod.current != 1) {
      const targetPage = state.mod.current - 1;
      await modGoPage(targetPage);
    }
  }

  async function modGoNext() {
    if (state.mod.current != state.mod.total) {
      const targetPage = state.mod.current + 1;
      await modGoPage(targetPage);
    }
  }

  async function modGoPage(page: number) {
    const skip = page * MEMES_PER_PAGE - MEMES_PER_PAGE;
    const response = await getAllModeratedMemes(skip, MEMES_PER_PAGE);
    moderatedMemes.value = response.data;
    state.mod.current = page;
  }

  async function getModTotalPages() {
    const resModCount = await axios.get(`${API_URL}meme/countMod`);
    totalModeratedCount.value = resModCount.data;
    state.mod.total = Math.ceil(totalModeratedCount.value / MEMES_PER_PAGE);
    for (let i = 1; i <= state.mod.total; i++) {
      moderatedPages.value.push(i);
    }
  }

  onMounted(async () => {
    const resModerated = await getAllModeratedMemes(0, MEMES_PER_PAGE);
    moderatedMemes.value = resModerated.data;
    await getModTotalPages();
  });
</script>
<style lang=""></style>
