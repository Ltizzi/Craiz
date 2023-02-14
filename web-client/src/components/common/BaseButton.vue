<template>
  <button
    :class="props.classes"
    :disabled="props.disabled"
    @click="handleClick"
    v-if="!props.link"
  >
    <slot></slot>
  </button>
  <router-link v-else :to="props.to" :class="props.classes"
    ><slot></slot
  ></router-link>
</template>

<script setup lang="ts">
  // import { defineEmits } from "vue";

  interface Props {
    disabled?: boolean;
    link?: Boolean;
    to?: string;
    classes?: string;
  }

  const props: Props = {
    disabled: false,
    link: false,
    classes: "",
  };

  const emits = defineEmits(["click"]);

  function handleClick() {
    emits("click");
  }
</script>
<style lang=""></style>
