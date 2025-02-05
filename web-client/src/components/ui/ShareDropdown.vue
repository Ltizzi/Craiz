<template lang="">
  <div class="relative inline-block">
    <BaseButton @click.stop="showDropdownMenu" class="mt-0">
      <font-awesome-icon icon="fa-solid fa-share-nodes" />
    </BaseButton>
    <div
      class="absolute z-10 block w-48 rounded-2xl bg-slate-600 text-white shadow-lg shadow-slate-800"
      v-if="showDropdown"
      ref="dropdown"
    >
      <ul class="m-2 p-2">
        <li
          class="rounded-xl px-3 py-2 text-white hover:cursor-pointer hover:bg-violet-500"
          @click="downloadImage"
        >
          Descargar meme
        </li>
        <!-- <li
          class="rounded-xl py-2 px-3 text-white hover:cursor-pointer hover:bg-emerald-500"
        >
          Whatsapp
        </li>
        <li
          class="rounded-xl py-2 px-3 text-white hover:cursor-pointer hover:bg-emerald-500"
        >
          Twitter
        </li> -->
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from "vue";
  import BaseButton from "../common/BaseButton.vue";
  // import { stringify } from "querystring";

  const props = defineProps({
    memeUrl: {
      type: String,
      required: true,
    },
  });

  onMounted(() => {
    document.addEventListener("click", handleClickOutside);
  });

  let showDropdown = ref(false);
  const dropdown = ref<HTMLElement | null>(null);

  function showDropdownMenu() {
    showDropdown.value = !showDropdown.value;
  }

  function handleClickOutside(event: MouseEvent) {
    if (
      dropdown.value &&
      !dropdown.value.contains(event.target as HTMLElement)
    ) {
      showDropdown.value = !showDropdown.value;
    }
  }

  function downloadImage() {
    window.open(props.memeUrl);
  }

  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });
</script>
<style lang=""></style>
