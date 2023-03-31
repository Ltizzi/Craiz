<template lang="">
  <BaseDialog
    class="absolute z-10 flex flex-col justify-center rounded-3xl py-5 px-2"
    @closeModal="modalSwitch"
  >
    <div
      class="my-5 mx-2 flex flex-col justify-center gap-2 text-lg text-gray-800"
    >
      <div class="flex flex-col justify-start gap-1">
        <label for="name">Nombre:</label>
        <input
          type="text"
          v-model="name"
          placeholder="José Perez"
          class="border-2 border-gray-200 py-2 px-1 focus:border-gray-500"
        />
      </div>
      <div class="flex flex-col justify-start">
        <label for="nickname">Apodo:</label>
        <input
          type="text"
          v-model="nickname"
          placeholder="Josesito"
          class="border-2 border-gray-200 py-2 px-1 focus:border-gray-500"
        />
      </div>
      <div class="flex flex-col justify-start">
        <label for="username">Nombre de Usuario:</label>
        <input
          type="text"
          v-model="username"
          placeholder="@Pepeuwu"
          class="border-2 border-gray-200 py-2 px-1 focus:border-gray-500"
        />
      </div>
      <div class="flex flex-col justify-start">
        <img
          :src="avatarPic"
          class="mx-auto w-10 rounded-full"
          v-if="avatarPic"
        />
      </div>
      <div class="flex flex-col justify-start">
        <label for="avatar">Avatar:</label>
        <input type="file" @change="handleFileInput('avatar', $event)" />
      </div>
      <div class="flex flex-col justify-start">
        <img :src="bannerPic" class="mx-auto w-20" v-if="bannerPic" />
      </div>
      <div class="flex flex-col justify-start">
        <label for="banner">Banner</label>
        <input type="file" @change="handleFileInput('banner', $event)" />
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
        ></textarea>
      </div>
      <div class="flex flex-col justify-start">
        <label for="birthday">Fecha de nacimiento:</label>
        <input type="date" name="birthday" v-model="birthday" />
      </div>
      <div class="flex justify-center">
        <button
          @click="handleSubmit"
          class="relative rounded-2xl bg-green-600 py-2 px-4 text-white"
        >
          Actualizar Perfil
        </button>
        <BaseSpinner class="absolute z-10 ml-56" v-show="waitingResponse" />
        <font-awesome-icon
          icon="fa-solid fa-circle-check"
          class="absolute z-10 mt-1 ml-56 rounded-full bg-green-600 p-1 text-2xl text-white"
          v-show="responseOk"
        />
        <font-awesome-icon
          icon="fa-solid fa-circle-xmark"
          class="absolute z-10 mt-1 ml-56 rounded-full bg-red-600 p-1 text-2xl text-white"
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

  const userStore = useUserStore();

  const name = ref("");
  const nickname = ref("");
  const username = ref("");
  const about = ref("");
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

  async function handleSubmit() {
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
