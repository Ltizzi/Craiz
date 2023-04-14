<template lang="">
  <div
    class="flex flex-row items-center text-lg hover:cursor-pointer"
    v-if="!isLoopedByUser"
  >
    <BaseButton @click="loopMeme">
      <font-awesome-icon icon="fa-solid fa-arrows-rotate" />
    </BaseButton>
    <p v-if="counter != 0" class="ml-2 mt-0.5 text-base">{{ counter }}</p>
    <p v-else class="ml-2 text-base opacity-0">{{ counter }}</p>
  </div>
  <div class="flex flex-row text-lg hover:cursor-pointer" v-else>
    <BaseButton @click="loopMeme" class="text-xl text-green-600">
      <font-awesome-icon icon="fa-solid fa-arrows-rotate" />
    </BaseButton>
    <p v-if="counter != 0" class="ml-2 mt-0.5 text-base">{{ counter }}</p>
    <p v-else class="ml-2 opacity-0">{{ counter }}</p>
  </div>
</template>
<script setup lang="ts">
  import { API_URL } from "@/main";
  import axios from "axios";
  import { onMounted, ref, watch } from "vue";
  import BaseButton from "./BaseButton.vue";
  import { notUserModalHandler } from "@/utils/notUserModalHandler";

  let isLoopedByUser = ref(false);

  const props = defineProps({
    memeId: {
      type: Number,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
    loopCounter: {
      type: Number,
      required: true,
    },
    userIsLooper: {
      type: Boolean,
      required: true,
    },
  });

  const counter = ref();

  async function loopMeme() {
    notUserModalHandler();
    isLoopedByUser.value = !isLoopedByUser.value;
    if (isLoopedByUser.value) {
      counter.value += 1;
    } else {
      counter.value -= 1;
    }
    const response = await axios.post(
      `${API_URL}meme/loop?memeId=${props.memeId}&userId=${props.userId}`,
      null,
      { withCredentials: true }
    );
    console.log(response.data);
    if (response.data.ok == "looped Meme") {
      isLoopedByUser.value = true;
    }
    if (response.data.ok == "unlooped Meme") {
      isLoopedByUser.value = false;
    }
    // if (isLoopedByUser.value) {
    //   counter.value += 1;
    // }
    // if (!isLoopedByUser.value) {
    //   counter.value -= 1;
    // }
  }

  watch(
    () => props.userIsLooper,
    (newValue) => {
      isLoopedByUser.value = newValue;
    }
  );

  onMounted(() => {
    isLoopedByUser.value = props.userIsLooper;
    counter.value = props.loopCounter;
  });
</script>
<style lang=""></style>
