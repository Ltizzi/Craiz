<template lang="">
  <div class="flex w-full flex-col pt-24">
    <TrendsHeader class="w-2/5" />
    <keep-alive>
      <TrendList class="mt-10" />
    </keep-alive>
  </div>
</template>
<script setup lang="ts">
  import TrendsHeader from "@/components/layout/TrendsHeader.vue";
  import TrendList from "@/components/ui/TrendList.vue";
</script>
