<template lang="">
  <BaseDialog
    @closeModal="modalSwitch"
    class="absolute z-10 flex max-h-52 flex-col justify-center rounded-3xl px-2 py-8 pr-2 text-lg"
  >
    <SelectFriendsTabNav class="mx-auto" />
    <div v-if="state.activeTab == 'follows'">
      <ul>
        <li
          class="flex h-16 flex-row items-center justify-start gap-2"
          v-for="follows in props.friends.follows"
          :key="props.friends.follows.userId"
        >
          <router-link :to="'/' + follows.username" class="flex flex-row gap-2">
            <img :src="follows.avatar" class="h-10 w-10 rounded-full" alt="" />
            <div class="flex flex-col gap-0.5">
              <p>{{ follows.nickname }}</p>
              <p class="text-sm italic">@{{ follows.username }}</p>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
    <div v-if="state.activeTab == 'followers'">
      <ul>
        <li
          class="flex h-16 flex-row items-center justify-start gap-2"
          v-for="followers in props.friends.followers"
          :key="props.friends.followers.userId"
        >
          <router-link
            :to="'/' + followers.username"
            class="flex flex-row gap-2"
          >
            <img
              :src="followers.avatar"
              class="h-10 w-10 rounded-full"
              alt=""
            />
            <div class="flex flex-col gap-0.5">
              <p>{{ followers.nickname }}</p>
              <p class="text-sm italic">@{{ followers.username }}</p>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
  </BaseDialog>
</template>
<script setup lang="ts">
  import EventBus from "@/utils/EventBus";
  import BaseDialog from "../common/BaseDialog.vue";
  import SelectFriendsTabNav from "./SelectFriendsTabNav.vue";
  import { reactive } from "vue";

  //MODAL HANDLER
  const emits = defineEmits({
    closeModal: () => true,
  });

  function modalSwitch() {
    EventBus.emit("closeModal");
  }

  //TAB NAVIGATION

  const state = reactive({
    activeTab: "follows",
  });

  EventBus.on("loadFollows", () => {
    state.activeTab = "follows";
  });

  EventBus.on("loadFollowers", () => {
    state.activeTab = "followers";
  });

  //friends lists

  const props = defineProps({
    friends: {
      type: Array,
      required: true,
    },
  });
</script>
