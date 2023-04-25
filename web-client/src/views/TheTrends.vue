<template lang="">
  <div class="w-full overflow-scroll overflow-x-hidden">
    <div class="flex w-full flex-col bg-gray-100 pt-24">
      <TrendsHeader class="2xlw-2/5 w-full" />
      <keep-alive>
        <TrendList class="lg:ml-4 mt-10" />
      </keep-alive>
    </div>
  </div>
</template>
<script setup lang="ts">
  import TrendsHeader from "@/components/layout/TrendsHeader.vue";
  import TrendList from "@/components/ui/TrendList.vue";
</script>
