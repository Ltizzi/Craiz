<template lang="">
  <div class="">
    <ProfileHeader :user="user" />
    <ProfileTabNav :id="user.userId" />
    <MemeList />
  </div>
</template>
<script setup lang="ts">
  import ProfileHeader from "@/components/layout/ProfileHeader.vue";
  import ProfileTabNav from "../components/ui/ProfileTabNav.vue";
  import MemeList from "@/components/layout/MemeList.vue";
  import { API_URL } from "@/main";
  import axios from "axios";
  import { onBeforeMount, ref } from "vue";
  import { useRoute } from "vue-router";
  import { useUserStore } from "@/store";
  import EventBus from "@/utils/EventBus";

  const userStore = useUserStore();
  const route = useRoute();

  let user = ref();

  onBeforeMount(async () => {
    const username = route.params.username;
    console.log(username);
    try {
      const response = await axios.get(
        `${API_URL}user/byUsername?username=${username}`
      );
      userStore.setProfileUser(response.data);
      user.value = userStore.profileUser;
      EventBus.emit("loadUserMemes", user.value.userId);
    } catch (err) {
      console.log(err);
    }
  });
</script>
<style lang=""></style>
