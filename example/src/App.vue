<script>
// @ts-nocheck
import Virtual from "./Virtual.vue";
import AutoSizeVirtualList from "./AutoSizeVirtualList.vue";
import RevertAutoSizeVirtualList from "./RevertAutoSizeVirtualList.vue";
export default {
  components: {
    Virtual,
    AutoSizeVirtualList,
    RevertAutoSizeVirtualList,
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
    <div class="ge"></div>
    <RevertAutoSizeVirtualList />
  </div>
</template>

<style scoped>
.ge {
  height: 20px;
}
</style>
