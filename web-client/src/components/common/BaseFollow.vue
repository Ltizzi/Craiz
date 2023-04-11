<template lang="">
  <div v-if="!props.sameUser">
    <BaseButton
      v-if="props.userFollow && !props.recentFollow"
      class="rounded-xl bg-violet-500 px-2 py-1 text-base text-white hover:bg-green-500"
      @click="handleFollows"
      >Seguir</BaseButton
    >
    <BaseButton
      class="rounded-xl bg-indigo-800 px-2 py-1 text-base text-white hover:bg-red-500"
      @click="handleFollows"
      v-if="!props.userFollow || props.recentFollow"
      >Dejar de seguir</BaseButton
    >
  </div>
</template>
<script setup lang="ts">
  import BaseButton from "./BaseButton.vue";
  import EventBus from "@/utils/EventBus";

  const props = defineProps({
    userFollow: {
      type: Boolean,
      required: true,
    },
    userToFollowId: {
      type: Number,
      required: true,
    },
    sameUser: {
      type: Boolean,
      required: true,
    },
    recentFollow: {
      type: Boolean,
      required: true,
    },
  });

  function handleFollows() {
    EventBus.emit("handleFollows", props.userToFollowId);
  }
</script>
