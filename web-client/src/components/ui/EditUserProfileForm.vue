<template lang="">
  <form>
    <div>
      <label for="nickname">Pick a nickname:</label>
      <input type="text" id="nickname" v-model="nickname" />
    </div>
    <div>
      <label for="username">Pick the username (@example123):</label>
      <input type="text" id="username" v-model="username" />
    </div>
    <div>
      <label for="birthday">Pick your birthday:</label>
      <input type="date" id="birthday" v-model="birthday" />
    </div>
    <BaseButton @submit.prevent="handleSubmit"></BaseButton>
  </form>
</template>
<script setup lang="ts">
  import BaseButton from "../common/BaseButton.vue";
</script>
<style lang=""></style>
