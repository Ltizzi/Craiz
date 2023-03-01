<template>
  <div class="flex flex-row items-center">
    <font-awesome-icon icon="fa-regular fa-comment" />

    <p v-if="commentCounter" class="my-auto ml-2">{{ commentCounter }}</p>
  </div>
</template>
<script setup lang="ts">
  import { onMounted, ref } from "vue";

  const props = defineProps({
    commentCounter: Number,
  });

  //const commentCounter = ref(2);
</script>
<style lang=""></style>
