<script>
// @ts-nocheck
import Virtual from "./Virtual.vue";
import AutoSizeVirtualList from "./AutoSizeVirtualList.vue";
export default {
  components: {
    Virtual,
    AutoSizeVirtualList,
  },
  data() {
    return {};
  },
};
</script>

<template>
  <div>
    <Virtual />
    <div class="ge"></div>
    <AutoSizeVirtualList />
  </div>
</template>

<style scoped>
.ge {
  height: 20px;
}
</style>
