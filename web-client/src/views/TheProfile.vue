<template lang="">
  <div class="w-full" v-if="isLoaded">
    <ProfileHeader :user="user" />
    <ProfileTabNav :id="user.userId" />
    <keep-alive>
      <MemeList />
    </keep-alive>
  </div>
  <div
    class="mx-auto my-auto flex items-center justify-center"
    v-if="!isLoaded"
  >
    <BaseSpinner />
  </div>
</template>
<script setup lang="ts">
  import ProfileHeader from "@/components/layout/ProfileHeader.vue";
  import ProfileTabNav from "../components/ui/ProfileTabNav.vue";
  import MemeList from "@/components/layout/MemeList.vue";
  import BaseSpinner from "@/components/common/BaseSpinner.vue";
  import { API_URL } from "@/main";
  import axios from "axios";
  import { onBeforeMount, onMounted, ref, watch } from "vue";
  import { useRoute } from "vue-router";
  import { useUserStore } from "@/store";
  import EventBus from "@/utils/EventBus";

  const userStore = useUserStore();
  const route = useRoute();

  const isLoaded = ref(false);

  let user = ref();

  EventBus.on("reloadProfileInfo", (userInfo) => {
    user.value = userInfo;
  });

  watch(
    () => route.params,
    (params, oldParams) => {
      if (params != oldParams) {
        location.reload();
      }
    }
  );

  onMounted(async () => {
    const username = route.params.username;
    console.log(username);
    try {
      const response = await axios.get(
        `${API_URL}user/byUsername?username=${username}`
      );
      const fetchedUser = response.data;
      userStore.setProfileUser(fetchedUser);
      user.value = userStore.profileUser;
      isLoaded.value = true;
      EventBus.emit("loadUserMemes", fetchedUser.userId);
    } catch (err) {
      console.log(err);
    }
  });

  // onBeforeMount(async () => {
  //   const username = route.params.username;
  //   console.log(username);
  //   try {
  //     const response = await axios.get(
  //       `${API_URL}user/byUsername?username=${username}`
  //     );
  //     userStore.setProfileUser(response.data);
  //     user.value = userStore.profileUser;
  //     isLoaded.value = true;
  //     EventBus.emit("loadUserMemes", user.value.userId);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // });
</script>
<style lang=""></style>
