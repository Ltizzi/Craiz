<template lang="">
  <div class="flex flex-col items-start justify-start gap-0">
    <ProfileHeaderTop
      :nickname="props.user.nickname"
      :memes="props.user.memes.length"
    />
    <div class="relative w-full">
      <img :src="props.user.banner" v-if="!props.user.banner" alt="" class="" />
      <div class="mt-10 h-44 w-full bg-slate-300"></div>
      <img
        :src="props.user.avatar"
        alt=""
        class="absolute top-48 left-2 w-20 rounded-full"
      />
      <BaseButton
        class="absolute top-56 right-2 rounded-xl bg-slate-500 py-1 px-3 text-white"
        >Editar Perfil</BaseButton
      >
    </div>
    <div class="mt-16 ml-2 flex flex-col justify-start">
      <h1>{{ props.user.nickname }}</h1>
      <h3>@{{ props.user.username }}</h3>
      <p>{{ props.user.about }}</p>
      <p>{{ props.user.birthday }}</p>
      <p>{{ props.user.createdAt }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { onBeforeMount, ref } from "vue";
  import ProfileHeaderTop from "../ui/ProfileHeaderTop.vue";
  import BaseButton from "../common/BaseButton.vue";
  import { User } from "@/utils/models";

  const props = defineProps({
    user: {
      type: Object,
    },
  });

  onBeforeMount(async () => {});
</script>
<style lang=""></style>
