<template lang="">
  <div class="relative inline-block">
    <BaseButton @click="showDropdownMenu" class="mt-3">
      <font-awesome-icon icon="fa-solid fa-share-nodes" />
    </BaseButton>
    <div
      class="absolute z-10 block w-48 rounded-2xl bg-slate-600 text-white shadow-lg shadow-slate-800"
      v-if="showDropdown"
    >
      <ul class="m-2 p-2">
        <li
          class="rounded-xl py-2 px-3 text-white hover:cursor-pointer hover:bg-emerald-500"
        >
          Descargar meme
        </li>
        <li
          class="rounded-xl py-2 px-3 text-white hover:cursor-pointer hover:bg-emerald-500"
        >
          Whatsapp
        </li>
        <li
          class="rounded-xl py-2 px-3 text-white hover:cursor-pointer hover:bg-emerald-500"
        >
          Twitter
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from "vue";
  import BaseButton from "../common/BaseButton.vue";

  let showDropdown = ref(false);

  function showDropdownMenu() {
    showDropdown.value = !showDropdown.value;
  }
</script>
<style lang=""></style>
