<template lang="">
  <div class="flex w-full flex-row gap-2 bg-slate-700 py-3">
    <div class="w-1/12">
      <router-link to="/" v-if="props.back">
        <BaseButton class="mx-5 my-auto text-lg text-white opacity-95">
          <font-awesome-icon icon="fa-solid fa-circle-chevron-left" />
        </BaseButton>
      </router-link>
    </div>

    <div class="flex w-10/12 justify-center">
      <input
        type="text"
        placeholder="Buscar en Craze"
        class="w-11/12 rounded-2xl bg-slate-600 py-1 px-2 pl-5 text-white"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
  import BaseButton from "../common/BaseButton.vue";

  const props = defineProps({
    back: {
      type: Boolean,
      required: true,
    },
  });
</script>
