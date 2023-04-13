<template lang="">
  <div class="w-full overflow-scroll overflow-x-hidden">
    <div class="flex w-full flex-col bg-gray-100 pt-24">
      <TrendsHeader class="w-full lg:w-2/5" />
      <keep-alive>
        <TrendList class="mt-10 md:ml-4" />
      </keep-alive>
    </div>
  </div>
</template>
<script setup lang="ts">
  import TrendsHeader from "@/components/layout/TrendsHeader.vue";
  import TrendList from "@/components/ui/TrendList.vue";
</script>
