<template lang="">
  <div>
    <a
      href="#"
      :class="[
        'block max-w-sm rounded-lg border border-gray-200 p-6 shadow',
        props.cardType == 'user' ? 'bg-violet-500' : '',
        props.cardType == 'meme' ? 'bg-green-500' : '',
        props.cardType == 'tag' ? 'bg-amber-500' : '',
      ]"
    >
      <h5 class="mb-2 text-2xl font-bold tracking-tight text-white">
        {{ count }}
      </h5>
      <p class="font-normal text-white">{{ countType }}</p>
    </a>
  </div>
</template>
<script setup lang="ts">
  import { API_URL } from "@/main";
  import axios from "axios";
  import { onBeforeMount, ref } from "vue";
  import { string } from "yup";

  const count = ref();
  const countType = ref();

  const props = defineProps({
    cardType: {
      type: String,
      required: true,
    },
  });

  onBeforeMount(async () => {
    if (props.cardType == "user") {
      countType.value = "Usuarios";
      const response = await axios.get(`${API_URL}user/count`);
      count.value = response.data;
    }
    if (props.cardType == "meme") {
      countType.value = "Memes";
      const response = await axios.get(`${API_URL}meme/count`);
      count.value = response.data;
    }
    if (props.cardType == "tag") {
      countType.value = "Custom Tags";
      const response = await axios.get(`${API_URL}tag/count`);
      count.value = response.data;
    }
  });
</script>
<style lang=""></style>
