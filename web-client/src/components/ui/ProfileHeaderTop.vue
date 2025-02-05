<template lang="">
  <div
    class="fixed top-0 z-20 w-full bg-slate-700 bg-opacity-95 lg:left-72 lg:-ml-0.5 lg:w-3/6 2xl:left-1/4 2xl:ml-10 2xl:w-5/12"
  >
    <div class="mx-5 flex flex-row items-center py-2">
      <router-link to="/">
        <BaseButton class="mx-5 my-auto text-lg text-white">
          <font-awesome-icon icon="fa-solid fa-circle-chevron-left" />
        </BaseButton>
      </router-link>

      <div class="flex flex-col justify-start border-l-2 border-gray-300">
        <h1 class="ml-5 text-lg font-extrabold text-white">
          {{ props.nickname }}
        </h1>
        <p class="ml-5 text-sm text-gray-300">{{ props.memes }} memes</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  const props = defineProps({
    nickname: {
      type: String,
    },
    memes: {
      type: Number,
    },
  });
</script>
<style lang=""></style>
