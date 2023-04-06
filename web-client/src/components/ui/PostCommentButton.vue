<template lang="">
  <BaseButton
    class="mx-auto mt-2 w-11/12 rounded-xl bg-violet-500 py-1 text-sm font-bold text-white sm:w-11/12 sm:text-base md:w-11/12 lg:w-10/12"
    @click="modalSwitch"
    >Comment</BaseButton
  >
  <PostMemeDialog v-if="showModal" />
</template>
<script setup lang="ts">
  import BaseButton from "../common/BaseButton.vue";
  import PostMemeDialog from "../layout/PostMemeDialog.vue";
  import EventBus from "@/utils/EventBus";
  import { useMemesStore } from "@/store/memes";
  import { ref } from "vue";

  const memeStore = useMemesStore();

  const showModal = ref(false);

  let props = defineProps({
    memeId: {
      type: Number,
    },
  });

  EventBus.on("closeModal", () => {
    showModal.value = false;
  });

  async function modalSwitch() {
    localStorage.removeItem("parentId");
    EventBus.emit("openDialogComment");
    EventBus.emit("newComment", { parentMeme: props.memeId });
    await memeStore.fetchParentMeme(props.memeId as number);
    localStorage.set("parentId", props.memeId);
    showModal.value = true;
  }
</script>
<style lang=""></style>
