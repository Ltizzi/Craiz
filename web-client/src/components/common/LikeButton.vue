<template>
  <div class="flex flex-row bg-white" v-if="liked">
    <BaseButton @click="handleButtonClick">
      <Font-awesome-icon icon="fa-solid fa-heart" />
    </BaseButton>
    <p class="ml-2">{{ likeCounter }}</p>
  </div>
  <div class="flex flex-row bg-white" v-else>
    <BaseButton @click="handleButtonClick">
      <Font-awesome-icon icon="fa-regular fa-heart"
    /></BaseButton>
    <p v-if="likeCounter" class="ml-2">{{ likeCounter }}</p>
    <p v-else class="ml-2 opacity-0">{{ likeCounter }}</p>
  </div>
</template>

<script setup lang="ts">
  import { Motion } from "motion/vue";
  import { spring } from "motion";
  import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
  import axios from "axios";
  import { onMounted, ref } from "vue";
  import { API_URL } from "@/main";
  import { useUserStore } from "@/store";
  import BaseButton from "./BaseButton.vue";
  import { User } from "@/utils/models";
  import { notUserModalHandler } from "@/utils/notUserModalHandler";

  const userStore = useUserStore();

  const props = defineProps({
    //classes: "text-black justify-center items-center",
    memeId: {
      type: Number,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
    meme: {
      type: Object,
      required: true,
    },
  });

  let user = userStore.user as User;

  const liked = ref(false);
  const likeCounter = ref(props.meme.likeCounter);

  async function handleButtonClick() {
    notUserModalHandler();
    liked.value = !liked.value;
    if (liked.value) {
      likeCounter.value += 1;
    } else {
      likeCounter.value -= 1;
    }
    const response = await axios.post(
      `${API_URL}meme/like?memeId=${props.meme.memeId}&userId=${user.userId}`,
      null,
      { withCredentials: true }
    );
    console.log(response.data);
    if (response.data.ok == "liked meme") {
      liked.value = true;
    }
    if (response.data.ok == "unliked meme") {
      liked.value = false;
    }
    // if (liked.value) {
    //   likeCounter.value += 1;
    // }
    // if (!liked.value) {
    //   likeCounter.value -= 1;
    // }
  }

  async function getMeme(id: number) {
    const response = await axios.get(`${API_URL}meme/byId?id=${id}`);
    return response.data;
  }

  async function getUser(id: number) {
    const response = await axios.get(`${API_URL}user/byId?id=${id}`);
    return response.data;
  }

  onMounted(async () => {
    try {
      let likedList = props.meme.likedBy as Array<number>;

      likeCounter.value = likedList.length;
      // likeCounter.value = props.meme.likeCounter;

      let user = userStore.user as User;
      //console.log(user.likedMemes);
      let isLikedByUser = user.likedMemes.includes(props.meme.memeId);
      //console.log("liked by user:", isLikedByUser);
      // if (isLikedByUser.length > 0) liked.value = true;
      if (isLikedByUser) liked.value = true;
      // memeId = meme.memeId;
      // userId = user.userId;
    } catch (err) {
      console.log(err);
    }
  });
</script>
<style lang=""></style>
