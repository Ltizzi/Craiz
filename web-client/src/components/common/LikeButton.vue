<template>
  <div class="flex flex-row bg-white" v-if="liked">
    <BaseButton @click="handleButtonClick">
      <Font-awesome-icon icon="fa-solid fa-heart" />
    </BaseButton>
    <p class="ml-2 pt-3">{{ likeCounter }}</p>
  </div>
  <div class="flex flex-row bg-white" v-else>
    <BaseButton @click="handleButtonClick">
      <Font-awesome-icon icon="fa-regular fa-heart"
    /></BaseButton>
    <p v-if="likeCounter" class="ml-2 pt-3">{{ likeCounter }}</p>
  </div>
</template>

<script setup lang="ts">
  import { Motion } from "motion/vue";
  import { spring } from "motion";
  import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
  import axios from "axios";
  import { onMounted, ref, Ref, watch } from "vue";
  import { API_URL } from "@/main";

  import BaseButton from "./BaseButton.vue";

  let meme = ref<any>({});

  let user = ref<any>({});

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
  });

  let memeId = props.memeId;
  let userId = props.userId;

  const liked = ref(false);
  const likeCounter = ref(0);

  async function handleButtonClick() {
    const response = await axios.post(
      `${API_URL}meme/like?memeId=${meme.value.memeId}&userId=${user.value.userId}`,
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
    if (liked.value) {
      likeCounter.value += 1;
    }
    if (!liked.value) {
      likeCounter.value -= 1;
    }
  }

  async function getMeme(id: number) {
    const response = await axios.get(
      `${API_URL}meme/byId?id=${id}`
      //`http://localhost:4246/v1/meme/byId?id=${id}`
    );
    return response.data;
  }

  async function getUser(id: number) {
    const response = await axios.get(
      `${API_URL}user/byId?id=${id}`
      //`http://localhost:4246/v1/user/byId?id=${id}`,
    );
    return response.data;
  }

  onMounted(async () => {
    try {
      meme.value = await getMeme(memeId);
      user.value = await getUser(userId);

      let likedList = meme.value.likedBy as Array<number>;

      likeCounter.value = likedList.length;
      let isLikedByUser = user.value.likedMemes.filter(
        (mem: number) => mem == meme.value.memeId
      );

      if (isLikedByUser.length > 0) liked.value = true;
      // memeId = meme.memeId;
      // userId = user.userId;
    } catch (err) {
      console.log(err);
    }
  });
</script>
<style lang=""></style>
