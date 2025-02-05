<template lang="">
  <div
    v-if="props.list"
    class="sm:text-base lg:px-2 lg:text-base 2xl:px-2 2xl:text-base rounded-lg px-2 py-0.5 text-base font-bold text-white hover:cursor-pointer"
    @click="openTag(props.name)"
  >
    <slot></slot>
  </div>
  <div
    v-else
    class="sm:text-base lg:px-2 lg:text-sm 2xl:px-2 2xl:text-base rounded-lg px-2 py-0.5 text-xs font-bold text-white hover:cursor-pointer"
    @click="openTag(props.name)"
  >
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
  import router from "@/router";
  import EventBus from "@/utils/EventBus";

  interface Tag {
    class: String;
    link: String;
  }

  const tag: Tag = {
    class: "",
    link: "",
  };

  const props = defineProps({
    name: {
      type: String,
      required: false,
    },
    list: {
      type: Boolean,
      required: false,
    },
    clickeable: {
      type: Boolean,
      required: false,
    },
  });

  function openTag(link: string) {
    if (!props.clickeable) {
      router.push(`/search?tag=${link}`);
    }
  }
</script>
<style>
  .sports {
    @apply bg-sky-400;
  }
  .fun {
    @apply bg-orange-400;
  }
  .wholesome {
    @apply bg-emerald-400;
  }
  .justbad {
    @apply bg-red-400;
  }
  .dadmeme {
    @apply bg-amber-700;
  }
  .auntmeme {
    @apply bg-gray-700;
  }
  .emo {
    @apply bg-pink-600;
  }
  .trash {
    @apply bg-slate-800;
  }
  .classic {
    @apply bg-purple-500;
  }
  .celeb {
    @apply bg-fuchsia-500;
  }
  .pop {
    @apply bg-lime-500;
  }
  .plus18 {
    @apply bg-rose-600;
  }
  .politics {
    @apply bg-fuchsia-900;
  }
  .random {
    @apply bg-amber-400;
  }
  .custom {
    @apply bg-gradient-to-r from-orange-300 via-pink-500 to-sky-400;
  }
</style>
