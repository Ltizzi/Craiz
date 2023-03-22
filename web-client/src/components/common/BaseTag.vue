<template lang="">
  <div
    class="rounded-lg px-2 py-0.5 text-xs font-bold text-white hover:cursor-pointer sm:text-base md:px-2 lg:px-2 lg:text-base"
    @click="openTag(tag.link)"
  >
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
  // import { useRouter } from "vue-router";
  interface Tag {
    class: String;
    link: String;
  }

  const tag: Tag = {
    class: "",
    link: "",
  };

  function openTag(link: string) {
    //TODO
    // const router = useRouter();
    // router.push(tag);
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
  .art {
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
</style>
