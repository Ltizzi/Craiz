<template>
  <div class="flex flex-row bg-white" v-if="liked">
    <BaseButton :class="props.classes" @click="handleButtonClick">
      <Font-awesome-icon icon="fa-solid fa-heart" />
    </BaseButton>
    <p class="pt-5">{{ likeCounter }}</p>
  </div>
  <div class="flex flex-row bg-white" v-else>
    <BaseButton :class="props.classes" @click="handleButtonClick">
      <Font-awesome-icon icon="fa-regular fa-heart"
    /></BaseButton>
    <p v-if="likeCounter" class="pt-5">{{ likeCounter }}</p>
  </div>
</template>
<script setup lang="ts">
  import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
  import { ref, Ref } from "vue";

  import BaseButton from "./BaseButton.vue";

  const props = {
    classes: "text-black p-5 ",
  };

  const liked: Ref<boolean> = ref(false);
  const likeCounter: Ref<number> = ref(1);

  function handleButtonClick() {
    liked.value = !liked.value;
    if (liked.value) {
      likeCounter.value += 1;
    }
    if (!liked.value) {
      likeCounter.value -= 1;
    }
  }
</script>
<style lang=""></style>
