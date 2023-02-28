<template>
  <div class="flex flex-row bg-white" v-if="liked">
    <BaseButton :class="props.classes" @click="handleButtonClick">
      <Font-awesome-icon icon="fa-solid fa-heart" />
    </BaseButton>
    <p class="ml-2 pt-3">{{ likeCounter }}</p>
  </div>
  <div class="flex flex-row bg-white" v-else>
    <BaseButton :class="props.classes" @click="handleButtonClick">
      <Font-awesome-icon icon="fa-regular fa-heart"
    /></BaseButton>
    <p v-if="likeCounter" class="ml-2 pt-3">{{ likeCounter }}</p>
  </div>
</template>
<script setup lang="ts">
  import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
  import axios from "axios";
  import { onMounted, ref, Ref } from "vue";
  import { useMemeStore } from "@/store/meme";
  import { useUserStore } from "@/store";
  import BaseButton from "./BaseButton.vue";
  import { Meme, User } from "../../utils/models";

  const memeStore = useMemeStore();
  const userStore = useUserStore();

  let meme: Meme;

  let user: User;

  let memeId = 0;
  let userId = 0;

  const props = {
    classes: "text-black justify-center items-center",
  };

  const liked: Ref<boolean> = ref(false);
  const likeCounter = ref();

  async function handleButtonClick() {
    const response = await axios.post(
      `http://localhost:4246/v1/meme/like?memeId=${memeId}&userId=${userId}`
    );
    console.log(response.data);
    if (response.data.ok == "liked meme") {
      liked.value = true;
    }
    if (response.data.ok == "unliked meme") {
      liked.value = false;
    }
    if (liked.value) {
      likeCounter.value += 1;
    }
    if (!liked.value) {
      likeCounter.value -= 1;
    }
  }

  onMounted(async () => {
    meme = (await memeStore.meme) as Meme;
    user = (await userStore.user) as User;
    console.log(meme);
    console.log(user);
    if (meme && user) {
      let likedList = meme.likedBy as Array<number>;
      likeCounter.value = likedList.length;
      let isLikedByUser = user.likedMemes.filter(
        (mem: number) => mem == meme.memeId
      );

      if (isLikedByUser.length > 0) liked.value = true;
      memeId = meme.memeId;
      userId = user.userId;
    }
  });
</script>
<style lang=""></style>
