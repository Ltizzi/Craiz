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
          class="rounded-lg bg-green-600 px-2 py-1 font-bold text-white md:rounded-3xl md:px-3 md:py-1 lg:rounded-3xl lg:px-4 lg:py-2 lg:text-lg"
          @click="handleSignInClick"
        >
          Loguear con Google
        </button>

        <button
          class="rounded-lg bg-orange-600 px-2 py-1 font-bold text-white md:rounded-3xl md:px-3 md:py-1 lg:px-4 lg:py-2 lg:text-lg"
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
