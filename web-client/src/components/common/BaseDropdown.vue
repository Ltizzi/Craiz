<template lang="">
  <div class="relative inline-block">
    <slot name="button" @click="showDropdownMenu"></slot>
    <div
      class="absolute z-10 block w-48 rounded-2xl bg-slate-600 text-white shadow-lg shadow-slate-800"
      v-if="showDropdown"
    >
      <slot name="menu"></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from "vue";

  let showDropdown = ref(false);

  function showDropdownMenu() {
    showDropdown.value = !showDropdown.value;
  }
</script>
<style lang=""></style>
