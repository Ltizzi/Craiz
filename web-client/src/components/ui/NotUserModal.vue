<template lang="">
  <BaseDialog @closeModal="modalSwitch" v-if="showNotUserModal">
    <div class="my-2 rounded-xl border-2 border-violet-500 px-2">
      <h1 class="pt-5 text-center text-xl font-semibold">
        Usuario no registrado
      </h1>
      <div class="flex flex-row items-center gap-2 py-10">
        <font-awesome-icon
          icon="fa-solid fa-circle-exclamation"
          class="rounded-full bg-white text-2xl text-red-600"
        />
        <p class="text-lg">
          Para realizar esta acción debería registrarse como usuario
        </p>
      </div>
      <div class="flex w-full flex-row justify-center gap-2 pb-5 text-sm">
        <button
          class="lg:rounded-3xl lg:px-3 lg:py-1 2xl:rounded-3xl 2xl:px-4 2xl:py-2 2xl:text-lg rounded-lg bg-green-600 px-2 py-1 font-bold text-white"
          @click="handleSignInClick"
        >
          Loguear con Google
        </button>

        <button
          class="lg:rounded-3xl lg:px-3 lg:py-1 2xl:px-4 2xl:py-2 2xl:text-lg rounded-lg bg-orange-600 px-2 py-1 font-bold text-white"
          @click="modalSwitch"
        >
          Seguir Navegando
        </button>
      </div>
    </div>
  </BaseDialog>
</template>
<script setup lang="ts">
  import BaseDialog from "../common/BaseDialog.vue";
  import EventBus from "@/utils/EventBus";
  import { API_URL } from "@/main";
  import { ref } from "vue";

  const emits = defineEmits({
    closeModal: () => true,
  });

  const showNotUserModal = ref(false);

  function modalSwitch() {
    showNotUserModal.value = false;
    EventBus.emit("closeModal");
  }

  function handleSignInClick() {
    window.location.href = `${API_URL}auth/google`;
  }

  EventBus.on("openNotUserModal", () => {
    showNotUserModal.value = true;
  });
</script>
