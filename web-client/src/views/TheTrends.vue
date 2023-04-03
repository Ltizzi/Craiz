<template lang="">
  <div class="flex h-full w-full flex-col bg-gray-100 pt-24">
    <TrendsHeader class="w-full lg:w-2/5" />
    <keep-alive>
      <TrendList class="mt-10" />
    </keep-alive>
  </div>
</template>
<script setup lang="ts">
  import TrendsHeader from "@/components/layout/TrendsHeader.vue";
  import TrendList from "@/components/ui/TrendList.vue";
</script>
