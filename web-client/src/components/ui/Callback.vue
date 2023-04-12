<template>
  <div
    class="h-screen w-full items-center bg-gradient-to-b from-violet-950 via-violet-400 to-purple-900"
  >
    <div v-if="!isLoaded" class="flex items-center justify-center">
      <BaseSpinner />
    </div>
    <div
      class="mx-auto h-fit w-2/3 rounded-xl bg-gray-50 p-10 shadow-2xl shadow-slate-950"
      v-else
    >
      <div class="flex flex-col justify-center">
        <img src="/assets/img/banner.png" alt="" class="w-full" />
        <p class="mt-2 text-center text-xl font-semibold">
          Bienvenido {{ user.nickname }}!, el logueo mediante Google fue un
          éxito, pero vamos a necesitar que agregues información adicional para
          tu perfil
        </p>
        <form
          class="my-5 flex flex-col items-center text-center"
          @submit.prevent="submitForm"
        >
          <div class="justify-centerx my-2 flex flex-col">
            <label for="nickname">Tu apodo:</label>
            <input
              type="text"
              id="nickname"
              v-model="nickname"
              :placeholder="user.nickname"
              class="mx-auto w-40 rounded-xl border-2 border-gray-300 px-5 py-2 focus:border-gray-900"
            />
            <span v-if="nicknameError" class="font-bold text-red-600">{{
              nicknameError
            }}</span>
          </div>
          <div class="mx-auto my-2 flex flex-col">
            <label for="username">Nombre de usuario:</label>
            <input
              type="text"
              id="username"
              v-model="username"
              placeholder="example123"
              class="mx-auto w-40 rounded-xl border-2 border-gray-300 px-5 py-2 focus:border-gray-900"
            />
            <span v-if="usernameError" class="font-bold text-red-600">{{
              usernameError
            }}</span>
          </div>
          <div class="my-2 flex flex-col justify-center">
            <label for="birthday">Fecha de nacimiento:</label>
            <input
              type="date"
              id="birthday"
              v-model="birthday"
              class="mx-auto w-40 rounded-xl border-2 border-gray-300 px-5 py-2 focus:border-gray-900"
            />
            <span v-if="birthdayError" class="font-bold text-red-600">{{
              birthdayError
            }}</span>
          </div>
          <div class="relative flex flex-col justify-around">
            <button
              @click="submitForm"
              class="mt-2 rounded-xl bg-violet-500 px-5 py-2 font-bold text-white"
            >
              Actualizar Perfil
            </button>
            <BaseSpinner class="absolute ml-44 w-10" v-if="isUploading" />
            <font-awesome-icon
              icon="fa-solid fa-circle-check"
              class="absolute ml-44 rounded-full bg-green-600 p-1 text-2xl text-white"
              v-show="uploadComplete"
            />
            <font-awesome-icon
              icon="fa-solid fa-circle-xmark"
              class="absolute ml-44 rounded-full bg-red-600 p-1 text-2xl text-white"
              v-show="uploadFailed"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useUserStore } from "@/store";
  import { useRouter } from "vue-router";
  import BaseSpinner from "../common/BaseSpinner.vue";
  import { onMounted, reactive, ref } from "vue";
  import axios from "axios";
  import { API_URL } from "@/main";
  import { useField, useForm } from "vee-validate";
  import * as yup from "yup";

  const userStore = useUserStore();
  const router = useRouter();

  const isUserDataLoaded = ref(false);

  let user: any = reactive({});

  const isLoaded = ref(false);

  // const birthday = ref("");
  // const username = ref("");
  // const nickname = ref("");

  //VALIDATIONS

  const schema = yup.object({
    nickname: yup
      .string()
      .required("El apodo es necesario")
      .min(4, "El apodo tiene que tener entre 4 y 15 caracteres")
      .max(15, "El apodo tiene que tener entre 4 y 15 caracteres")
      .matches(
        /^[a-zA-Z0-9\s]+$/,
        "El nickname solo puede tener letras, números y espacios"
      ),
    username: yup
      .string()
      .required("El nombre de usuario es necesario")
      .min(6, "El nombre de usuario debe tener entre 6 y 15 caracteres")
      .max(12, "El nombre de usuario debe tener entre 6 y 15 caracteres")
      .matches(
        /^[a-zA-Z0-9]+$/,
        "El nombre de usuario solo puede tener letras, números y espacios"
      ),
    birthday: yup
      .date()
      .max(new Date(Date.now() - 567648000000), "Debes tener mínimo 18 años")
      .required("La fecha de cumpleaños es necesaria"),
  });

  const { handleSubmit } = useForm({
    validationSchema: schema,
  });

  const { value: nickname, errorMessage: nicknameError } = useField("nickname");
  const { value: username, errorMessage: usernameError } = useField("username");
  const { value: birthday, errorMessage: birthdayError } = useField("birthday");

  const submitForm = handleSubmit(uploadForm);

  async function uploadForm() {
    isUploading.value = true;
    const updatedUser = {
      userId: user.userId,
      email: user.email,
      nickname: nickname.value,
      username: username.value,
      birthday: birthday.value,
    };
    const response = await axios.patch(
      `${API_URL}user/update`,

      updatedUser,
      { withCredentials: true }
    );

    userStore.setUser(response.data.user);
    let responseUser = response.data.userId;
    let responseError = response.data.error;
    if (responseUser) {
      isUploading.value = false;
      uploadComplete.value = true;
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
    if (responseError) {
      isUploading.value = false;
      uploadFailed.value = true;
    }
  }

  //visual info when updating info

  const isUploading = ref(false);
  const uploadComplete = ref(false);
  const uploadFailed = ref(false);

  onMounted(async () => {
    const response = await axios.get(
      `${API_URL}auth/logincheck`,

      { withCredentials: true }
    );

    user = response.data.user;
    if (await response.data) {
      isLoaded.value = true;
    }
    //router.push("/");

    //else router.push("/");
  });
</script>
