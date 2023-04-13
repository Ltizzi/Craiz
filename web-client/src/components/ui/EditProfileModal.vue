<template lang="">
  <BaseDialog
    class="absolute z-10 flex flex-col justify-center rounded-3xl px-2 py-5"
    @closeModal="loadFriendsDialog"
  >
    <div
      class="mx-2 my-5 flex flex-col justify-center gap-2 text-lg text-gray-800"
    >
      <h1 class="text-center text-xl font-bold">Editar perfil</h1>
      <div class="relative flex w-full items-center justify-center">
        <label
          for="dropzone-file"
          class="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <img :src="bannerPic" class="mx-auto h-52 w-full" v-if="bannerPic" />
          <div
            class="flex flex-col items-center justify-center pb-6 pt-5"
            v-if="!bannerPic"
          >
            <svg
              aria-hidden="true"
              class="mb-3 h-10 w-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span class="font-semibold">Click para subir</span> o arrastra
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              imágenes para tu banner
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            class="hidden"
            @change="handleFileInput('banner', $event)"
          />
        </label>
      </div>

      <div
        class="absolute top-64 z-50 flex h-20 w-20 items-center justify-center rounded-full"
      >
        <label>
          <!-- for="dropzone-file"
          class="dark:hover:bg-bray-800 flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          -->
          <img
            :src="avatarPic"
            class="mx-auto w-44 rounded-full"
            v-if="avatarPic"
          />
          <div
            class="flex flex-col items-center justify-center pb-6 pt-5"
            v-if="!avatarPic"
          >
            <svg
              aria-hidden="true"
              class="-ml-10 mb-3 h-14 w-14 items-center rounded-full bg-slate-200 px-2 py-1 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
          </div>
          <input
            id="dropzone-file"
            type="file"
            class="hidden"
            @change="handleFileInput('avatar', $event)"
          />
        </label>
      </div>

      <div class="mt-10 grid grid-cols-2 gap-3">
        <div class="flex flex-col justify-start gap-1">
          <label for="name">Nombre:</label>
          <input
            type="text"
            v-model="name"
            :placeholder="user.name"
            :class="[
              'border-2 border-gray-200 px-1 py-2 focus:border-gray-500',
              nameError ? 'border-red-400' : '',
            ]"
          />
          <span v-if="nameError" class="text-xs font-semibold text-red-600">{{
            nameError
          }}</span>
        </div>
        <div class="flex flex-col justify-start gap-1">
          <label for="nickname">Apodo:</label>
          <input
            type="text"
            v-model="nickname"
            :placeholder="user.nickname"
            :class="[
              'border-2 border-gray-200 px-1 py-2 focus:border-gray-500',
              nicknameError ? 'border-red-400' : '',
            ]"
          />
          <span
            v-if="nicknameError"
            class="text-xs font-semibold text-red-600"
            >{{ nicknameError }}</span
          >
        </div>
        <div class="flex flex-col justify-start gap-1">
          <label for="username">Nombre de Usuario:</label>
          <div>
            <input
              type="text"
              v-model="username"
              :placeholder="user.username"
              :class="[
                'relative border-2 border-gray-200 px-1 py-2 pl-8 focus:border-gray-500',
                usernameError ? 'border-red-400' : '',
              ]"
            />
            <font-awesome-icon
              icon="fa-solid fa-at"
              class="absolute left-7 mt-0.5 items-center bg-purple-500 px-1.5 py-3 text-white"
            />
          </div>
          <span
            v-if="usernameError"
            class="text-xs font-semibold text-red-600"
            >{{ usernameError }}</span
          >
        </div>
        <div class="flex flex-col justify-start gap-1">
          <label for="birthday">Fecha de nacimiento:</label>
          <input
            type="date"
            name="birthday"
            v-model="birthday"
            :class="[
              'border-2 border-gray-200 px-1 py-2 focus:border-gray-500',
              birthdayError ? 'border-red-400' : '',
            ]"
          />
          <span
            v-if="birthdayError"
            class="text-xs font-semibold text-red-600"
            >{{ birthdayError }}</span
          >
        </div>
      </div>

      <div class="flex flex-col justify-start">
        <label for="about">Sobre mí:</label>
        <textarea
          name="about"
          id=""
          cols="30"
          rows="5"
          v-model="about"
          :placeholder="user.about"
          :class="[
            'border-2 border-gray-200 px-1 py-2 focus:border-gray-500',
            aboutError ? 'border-red-400' : '',
          ]"
        ></textarea>
        <span v-if="aboutError" class="text-xs font-semibold text-red-600">{{
          aboutError
        }}</span>
      </div>

      <div class="flex justify-center">
        <button
          @click="submitForm"
          class="relative rounded-2xl bg-green-600 px-4 py-2 text-white"
        >
          Actualizar Perfil
        </button>
        <BaseSpinner class="absolute z-10 ml-56" v-show="waitingResponse" />
        <font-awesome-icon
          icon="fa-solid fa-circle-check"
          class="absolute z-10 ml-56 mt-1 rounded-full bg-green-600 p-1 text-2xl text-white"
          v-show="responseOk"
        />
        <font-awesome-icon
          icon="fa-solid fa-circle-xmark"
          class="absolute z-10 ml-56 mt-1 rounded-full bg-red-600 p-1 text-2xl text-white"
          v-show="responseFail"
        />
      </div>
    </div>
  </BaseDialog>
</template>
<script setup lang="ts">
  import BaseDialog from "../common/BaseDialog.vue";
  import BaseSpinner from "../common/BaseSpinner.vue";
  import { useUserStore } from "@/store";
  import { onMounted, reactive, ref } from "vue";
  import { User } from "@/utils/models";
  import axios from "axios";
  import { API_URL } from "@/main";
  import EventBus from "@/utils/EventBus";
  import { emitKeypressEvents } from "readline";
  import { useField, useForm } from "vee-validate";
  import * as yup from "yup";
  import { faBirthdayCake } from "@fortawesome/free-solid-svg-icons";

  const userStore = useUserStore();

  // const name = ref("");
  // const nickname = ref("");
  // const username = ref("");
  // const about = ref("");
  let avatar: any;
  const avatarPic = ref();
  let banner: any;
  const bannerPic = ref();

  let user: any = reactive({});

  //modal

  const emits = defineEmits({
    closeModal: () => true,
  });

  function modalSwitch() {
    EventBus.emit("closeModal");
  }

  //status/spinner
  const waitingResponse = ref(false);
  const responseOk = ref(false);
  const responseFail = ref(false);

  //file upload handler

  function handleFileInput(tipo: string, event: any) {
    const file = event.target.files[0];
    if (!file) {
      console.error("Select a file!");
      return;
    }
    if (tipo === "avatar") {
      avatar = file;
    }
    if (tipo === "banner") {
      banner = file;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && tipo === "avatar") {
        avatarPic.value = event.target.result;
      }
      if (event.target && tipo === "banner") {
        bannerPic.value = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  }

  //validaciones

  const schema = yup.object({
    name: yup
      .string()
      .min(3, "Mínimo de 3 caracteres")
      .max(20, "Máximo 20 caracteres")
      .matches(/^[a-zA-Z\s]+$/, "Solo letras y espacios"),
    nickname: yup
      .string()
      .min(4, "Mínimo de 4 caracteres")
      .max(15, "Máximo de 15 caracteres")
      .matches(/^[a-zA-Z0-9\s]+$/, "Solo letras, números y espacios"),
    username: yup
      .string()
      .min(4, "Mínimo de 4 caracteres")
      .max(15, "Máximo de 15 caracteres")
      .matches(/^[a-zA-Z0-9]+$/, "Solo letras y números"),
    about: yup
      .string()
      .min(3, "Mínimo de 3 caracteres")
      .max(200, "Máximo de 200 caracteres"),
    birthday: yup
      .date()
      .max(new Date(Date.now() - 567648000000), "Debe tener al menos 18 años"),
  });

  const { handleSubmit } = useForm({ validationSchema: schema });

  const { value: name, errorMessage: nameError } = useField("name");
  const { value: nickname, errorMessage: nicknameError } = useField("nickname");
  const { value: username, errorMessage: usernameError } = useField("username");
  const { value: about, errorMessage: aboutError } = useField("about");
  const { value: birthday, errorMessage: birthdayError } = useField("birthday");

  const submitForm = handleSubmit(handleForm);

  //form submit

  async function handleForm() {
    waitingResponse.value = true;
    const formData = new FormData();
    console.log(avatar);
    let avatarUrl = "";
    if (avatar) {
      formData.append("file", avatar);
      console.log(formData);
      const avatarRes = await axios.post(
        `${API_URL}utils/uploadImg`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      console.log(avatarRes.data.url);
      avatarUrl = avatarRes.data.url;
    }

    const formData2 = new FormData();
    let bannerUrl = "";
    if (banner) {
      formData2.append("file", banner);
      const bannerRes = await axios.post(
        `${API_URL}utils/uploadImg`,
        formData2,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log(bannerRes.data.url);
      bannerUrl = bannerRes.data.url;
    }

    const updatedUser: any = {
      userId: user.userId,
      email: user.email,
      name: name.value,
      nickname: nickname.value,
      username: username.value,
      avatar: avatarUrl,
      banner: bannerUrl,
      about: about.value,
    };

    for (const prop in user) {
      if (!updatedUser[prop]) {
        updatedUser[prop] = user[prop];
      }
    }

    const response = await axios.patch(`${API_URL}user/update`, updatedUser, {
      withCredentials: true,
    });
    console.log(response);
    userStore.setUser(response.data.user);
    waitingResponse.value = false;
    if (response.status == 200) {
      responseOk.value = true;
      EventBus.emit("reloadProfileInfo", response.data);
      setTimeout(() => {
        EventBus.emit("closeModal");
        emits("closeModal");
      }, 1000);
    } else {
      responseFail.value = true;
      console.log(response.data);
    }
  }

  onMounted(async () => {
    const response = await axios.get(
      `${API_URL}auth/logincheck`,

      { withCredentials: true }
    );

    user = response.data.user;
  });
</script>
<style lang=""></style>
