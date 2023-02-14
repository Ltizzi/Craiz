<template lang="">
  <div
    class="rounded-lg px-2 text-sm font-bold text-white hover:cursor-pointer"
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
<style lang=""></style>
