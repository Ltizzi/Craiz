<template>
  <div class="flex h-screen items-center bg-gray-800">
    <div class="mx-auto h-fit w-2/3 rounded-xl bg-gray-50 p-10">
      <div v-if="!isUserDataLoaded">
        <h1>Autenticando con google..</h1>
      </div>
      <div v-else class="flex flex-col justify-center">
        <img src="/assets/img/banner.png" alt="" class="w-full" />
        <p class="text-center text-xl font-semibold">
          Bienvenido {{ user.nickname }}, el logueo mediante Google fue un
          éxito, pero vamos a necesitar que agregues información adicional para
          tu perfil
        </p>
        <form class="my-5 flex flex-col items-center text-center">
          <div class="my-2 flex flex-col justify-center">
            <label for="nickname">Tu apodo:</label>
            <input
              type="text"
              id="nickname"
              v-model="nickname"
              :placeholder="user.nickname"
              class="w-40 rounded-xl border-2 border-gray-300 py-2 px-5 focus:border-gray-900"
            />
          </div>
          <div class="my-2 mx-auto flex flex-col">
            <label for="username">Nombre de usuario:</label>
            <input
              type="text"
              id="username"
              v-model="username"
              placeholder="example123"
              class="w-40 rounded-xl border-2 border-gray-300 py-2 px-5 focus:border-gray-900"
            />
          </div>
          <div class="my-2 flex flex-col justify-center">
            <label for="birthday">Fecha de nacimiento:</label>
            <input
              type="date"
              id="birthday"
              v-model="birthday"
              class="w-40 rounded-xl border-2 border-gray-300 py-2 px-5 focus:border-gray-900"
            />
          </div>
          <button
            @click="handleSubmit"
            class="mt-2 rounded-xl bg-blue-500 px-5 py-2 font-bold text-white"
          >
            Actualizar Perfil
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
  import { API_URL } from "@/main";

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
      `${API_URL}user/update`,
      //"http://localhost:4246/v1/user/update",
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
      `${API_URL}auth/logincheck`,

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
