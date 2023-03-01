<template>
  <div class="flex h-screen items-center justify-center bg-gray-800">
    <div class="mx-auto h-2/4 w-2/3 bg-gray-50 p-10">
      <div v-if="!isUserDataLoaded">
        <h1>Autenticando con google..</h1>
      </div>
      <div v-else>
        <p class="text-center text-xl font-semibold">
          Welcome {{ user.nickname }}, you are signed in with Google. Now, we
          need you to fullfil this form to complete your profile
        </p>
        <form class="mx-24 my-5 flex flex-col items-center justify-center">
          <div class="my-2 flex w-1/3 flex-col justify-center">
            <label for="nickname">Pick a nickname:</label>
            <input
              type="text"
              id="nickname"
              v-model="nickname"
              :placeholder="user.nickname"
              class="border-2 border-gray-300 py-2 px-5 focus:border-gray-900"
            />
          </div>
          <div class="my-2 flex w-1/3 flex-col justify-center">
            <label for="username">Pick the username:</label>
            <input
              type="text"
              id="username"
              v-model="username"
              placeholder="@example123"
              class="border-2 border-gray-300 py-2 px-5 focus:border-gray-900"
            />
          </div>
          <div class="my-2 flex w-1/3 flex-col justify-center">
            <label for="birthday">Pick your birthday:</label>
            <input
              type="date"
              id="birthday"
              v-model="birthday"
              class="border-2 border-gray-300 py-2 px-5 focus:border-gray-900"
            />
          </div>
          <button
            @click="handleSubmit"
            class="mt-2 rounded-xl bg-blue-500 px-5 py-2 font-bold text-white"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useUserStore } from "@/store";
  import { useRouter } from "vue-router";
  import { onMounted, reactive, ref, watch } from "vue";
  import axios from "axios";

  const userStore = useUserStore();
  const router = useRouter();

  const isUserDataLoaded = ref(false);

  let userIsSignedIn = ref(userStore.isSignedIn);
  let user: any = reactive({});

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
      "http://localhost:4246/v1/user/update",
      updatedUser,
      { withCredentials: true }
    );
    console.log(response);
    userStore.setUser(response.data.user);
    if (response.data.user) {
      router.push("/");
    }
  }

  onMounted(async () => {
    const response = await axios.get(
      "http://localhost:4246/v1/auth/logincheck",
      { withCredentials: true }
    );

    user = response.data.user;
    isUserDataLoaded.value = true;
    //router.push("/");

    //else router.push("/");
  });

  watch(
    () => userStore.isSignedIn,
    (newValue) => {
      userIsSignedIn.value = newValue;
    }
  );
</script>
