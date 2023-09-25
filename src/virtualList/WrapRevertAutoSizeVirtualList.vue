<template>
  <RevertAutoSizeVirtualList
    v-if="virtual"
    :list="list"
    :itemHeight="itemHeight"
    :offset="offset"
    :minSize="minSize"
    :height="height"
    :scrollToTop="scrollToTop"
    @handleScroll="handleScroll"
    @scrollToBottom="scrollToBottom"
  >
    <template v-slot:footer>
      <slot name="footer"></slot>
    </template>
    <template v-slot:item="{ item }">
      <slot :item="item" name="item"></slot>
    </template>
  </RevertAutoSizeVirtualList>
  <div
    v-else
    class="normal-list"
    ref="wrapEl"
    :style="{ height: `${height}px` }"
  >
    <div ref="normalEl">
      <div v-for="item in list" :key="item[itemKey]">
        <slot :item="item" name="item"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import RevertAutoSizeVirtualList from "./RevertAutoSizeVirtualList.vue";
import { resizeCb } from "./utils/resizeObverser";
export default {
  components: {
    RevertAutoSizeVirtualList,
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    itemKey: {
      type: String,
      default: "",
    },
    offset: {
      type: Number,
      default: 6,
    },
    minSize: {
      type: Number,
      default: 20,
    },
    itemHeight: {
      type: Number,
      default: 40,
    },
    height: {
      type: Number,
      default: 400,
    },
    scrollToTop: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      virtual: false,
    };
  },
  computed: {
    viewCnt() {
      return Math.min(Math.floor(this.height / this.minSize), this.list.length);
    },
  },
  mounted() {
    this.resizeDom = resizeCb(this.resizeCb);

    if (this.list.length > this.viewCnt) {
      this.virtual = true;
    } else {
      this.$nextTick(() => {
        if (this.$refs.normalEl) {
          this.resizeDom.observe(this.$refs.normalEl);
        }
      });
    }
  },
  destroyed() {
    if (this.$refs.normalEl) {
      this.resizeDom.unobserve(this.$refs.normalEl);
    }
  },
  methods: {
    handleScroll(e) {
      this.$emit("handleScroll", e);
    },
    scrollToBottom() {
      this.$emit("scrollToBottom");
    },
    resizeCb() {
      const { scrollHeight, clientHeight } = this.$refs.wrapEl;
      if (scrollHeight > clientHeight) {
        this.virtual = true;
        this.resizeDom.unobserve(this.$refs.normalEl);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.normal-list {
  height: 100%;
  width: 100%;
  overflow: auto;
}
</style>
