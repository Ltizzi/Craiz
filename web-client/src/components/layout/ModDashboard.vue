<template lang="">
  <div class="flex w-5/6 flex-col justify-center">
    <div
      class="border-b border-gray-200 text-center text-sm font-medium text-gray-500"
    >
      <ul class="-mb-px mt-5 flex flex-wrap">
        <li class="mr-2" @click="goFlag">
          <a
            :class="[
              'inline-block rounded-t-lg border-b-2 border-transparent p-4 hover:cursor-pointer hover:border-violet-300 hover:text-violet-600',
              state.currentTab == 'flag'
                ? 'bg-violet-400 font-extrabold text-white hover:text-gray-50'
                : '',
            ]"
            >Flagged Memes</a
          >
        </li>
        <li class="mr-2" @click="goMod">
          <a
            :class="[
              'inline-block rounded-t-lg border-b-2 border-transparent p-4 hover:border-violet-300 hover:text-violet-600',
              state.currentTab == 'mod'
                ? 'bg-violet-400 font-extrabold text-white hover:text-gray-50'
                : '',
            ]"
            aria-current="page"
            >Moderated Memes</a
          >
        </li>
      </ul>
    </div>
    <FlaggedMemeList v-if="state.currentTab == 'flag'" />
    <ModMemeList v-if="state.currentTab == 'mod'" />
  </div>
</template>
<script setup lang="ts">
  import { reactive } from "vue";
  import FlaggedMemeList from "../ui/FlaggedMemeList.vue";
  import ModMemeList from "../ui/ModMemeList.vue";

  function goFlag() {
    state.currentTab = "flag";
  }

  function goMod() {
    state.currentTab = "mod";
  }

  const state = reactive({
    currentTab: "flag",
  });
</script>
<style lang=""></style>
