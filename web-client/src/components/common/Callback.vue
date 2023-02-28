<template lang="">
  <div v-if="!userIsSignedIn">
    <p>Authenticating...</p>
  </div>
  <div v-else>
    <p>
      Welcome {{ user.value.nickname }}You are signed in with Google. Now, we
      need you to fullfil this form to complete your profile
    </p>
    <form>
      <div>
        <label for="nickname">Pick a nickname:</label>
        <input
          type="text"
          id="nickname"
          v-model="nickname"
          placeholder="user.value.nickname"
        />
      </div>
      <div>
        <label for="username">Pick the username (@example123):</label>
        <input type="text" id="username" v-model="username" />
      </div>
      <div>
        <label for="birthday">Pick your birthday:</label>
        <input type="date" id="birthday" v-model="birthday" />
      </div>
      <BaseButton @submit.prevent="handleSubmit">Update Profile</BaseButton>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { useUserStore } from "@/store";
  import { useRouter } from "vue-router";
  import { onMounted, reactive, ref, watch } from "vue";
  import axios from "axios";

  const userStore = useUserStore();
  const router = useRouter();

  let userIsSignedIn = ref(userStore.isSignedIn);
  let user: any = reactive(userStore.user);

  const nickname = ref("");
  const username = ref("");
  const birthday = ref("");

  async function handleSubmit() {
    const updatedUser = {
      userId: user.userId,
      email: user.email,
      nickname: nickname.value,
      username: username.value,
      birthday: birthday.value,
    };
    const response = await axios.patch(
      "localhost:4246/v1/user/update",
      updatedUser,
      { withCredentials: true }
    );
    console.log(response);
    userStore.setUser(response.data.user);
  }

  onMounted(async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const loggedIn = searchParams.get("loggedIn");
    if (loggedIn) {
      const response = await axios.get(
        "http://localhost:4246/v1/auth/logincheck",
        { withCredentials: true }
      );

      userStore.setUser(response.data.user);

      //router.push("/");
    } else router.push("/");
  });

  watch(
    () => userStore.isSignedIn,
    (newValue) => {
      userIsSignedIn.value = newValue;
    }
  );
</script>

<style lang=""></style>
