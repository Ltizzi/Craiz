<template lang="">
  <div
    class="fixed left-14 top-0 z-20 w-4/5 bg-slate-700 lg:left-1/4 lg:ml-20 lg:w-2/5"
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
