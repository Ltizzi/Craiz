<template lang="">
  <div class="flex flex-col justify-center">
    <MemeCard :data="meme"></MemeCard>
    <CommentsView></CommentsView>
  </div>
</template>
<script setup lang="ts">
  import MemeCard from "@/components/layout/MemeCard.vue";
  import CommentsView from "@/components/layout/CommentsView.vue";
  import { onMounted, ref } from "vue";
  import { useMemesStore } from "@/store/memes";

  const memesStore = useMemesStore();
  let meme = ref(memesStore.meme);

  console.log(meme.value);
  // meme.value = memesStore.meme;
</script>
<style lang=""></style>
