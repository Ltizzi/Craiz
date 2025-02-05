<template lang="">
  <div class="ml-12 flex w-fit flex-col">
    <ul
      class="flex flex-wrap border-b border-gray-200 text-center text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400"
    >
      <li class="mr-2" @click="loadBasic">
        <a
          aria-current="page"
          :class="[
            'active inline-block rounded-t-lg  p-4 ',
            state.activeTab == 'basic'
              ? 'bg-slate-200 font-semibold text-violet-600'
              : 'text-gray-300  hover:bg-gray-50 hover:text-violet-500',
          ]"
          >Tags básicas</a
        >
      </li>

      <li class="mr-2" @click="loadCustom">
        <a
          :class="[
            'inline-block rounded-t-lg p-4 hover:bg-gray-50 hover:text-violet-500',
            state.activeTab == 'custom'
              ? 'bg-slate-200 font-semibold text-violet-600'
              : 'text-gray-300  hover:bg-gray-50 hover:text-violet-500',
          ]"
          >Tags personalizadas</a
        >
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
  import EventBus from "@/utils/EventBus";
  import { reactive } from "vue";

  const state = reactive({
    activeTab: "basic",
  });

  function loadBasic() {
    state.activeTab = "basic";
    EventBus.emit("basicTags");
  }

  function loadCustom() {
    state.activeTab = "custom";
    EventBus.emit("customTags");
  }
</script>
