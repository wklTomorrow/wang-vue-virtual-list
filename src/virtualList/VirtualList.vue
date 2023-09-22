<template>
  <div class="virtual" :style="{ height: `${height}px` }">
    <div
      class="virtual-container"
      ref="containerEl"
      :style="{ height: `${height}px` }"
    >
      <div ref="bgEl">
        <div ref="header"><slot name="header"></slot></div>
        <div class="virtual-bar" :style="{ height: `${bgHeight}px` }"></div>
        <slot name="footer"></slot>
      </div>
      <div
        class="virtual-inner"
        ref="innerEl"
        :style="{
          transform: `translateY(${start * itemHeight + headerHeight}px)`,
        }"
      >
        <div v-for="item in showList" :key="item[itemKey]">
          <slot :item="item" name="item"></slot>
        </div>
      </div>
    </div>
    <Bar :barStyle="barStyle" :moveDom="$refs.containerEl" :barCnt="barCnt" />
  </div>
</template>

<script>
import { throttle } from "./utils/utils";
import Bar from "./com/Bar.vue";
export default {
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
  components: {
    Bar,
  },
  data() {
    return {
      start: 0,
      end: 0,
      barStyle: {},
      barCnt: 0,
      headerHeight: 0,
    };
  },
  mounted() {
    this.$refs.containerEl.addEventListener(
      "scroll",
      throttle((e) => {
        this.handleScroll(e);
      })
    );
    this.dealVirtualList(this.list);
    this.headerHeight = this.$refs.header.clientHeight;
  },
  destroyed() {
    this.$refs.containerEl.removeEventListener(
      "scroll",
      throttle((e) => {
        this.handleScroll(e);
      })
    );
  },
  computed: {
    viewCnt() {
      return Math.min(Math.floor(this.height / this.minSize), this.list.length);
    },
    bgHeight() {
      if (this.list.length) {
        return Math.max(this.height, this.list.length * this.itemHeight);
      }
      return this.height;
    },
    showList() {
      if (this.list.length) {
        return this.list.slice(this.start, this.end);
      }
      return [];
    },
  },
  methods: {
    handleScroll(e) {
      this.barCnt = this.barCnt + 1;
      this.$emit("handleScroll", e);
      this.dealVirtualList(this.list);
    },
    renderBar({ allHeight, height, top }) {
      const target = (height * height) / allHeight;
      const scrollTop = (height * top) / allHeight;
      this.barStyle = {
        height: `${target}px`,
        top: `${scrollTop}px`,
      };
    },

    scrollEnd() {
      this.$emit("scrollToBottom");
    },

    dealVirtualList(itemList, end = true) {
      if (this.$refs.containerEl && itemList.length) {
        const { scrollTop, offsetHeight, clientHeight } =
          this.$refs.containerEl;
        this.renderBar({
          allHeight: this.$refs.bgEl.offsetHeight,
          height: offsetHeight,
          top: scrollTop,
        });
        const start = Math.floor(scrollTop / this.itemHeight);
        this.start = Math.max(0, start - this.offset);
        this.end = Math.min(this.start + this.viewCnt, itemList.length);
        if (this.$refs.bgEl.clientHeight <= scrollTop + clientHeight && end) {
          this.scrollEnd();
        }
      }
    },
  },
  watch: {
    scrollToTop(newValue) {
      if (newValue) {
        this.$refs.containerEl.scrollTo(0, 0);
      }
    },
    list: {
      immediate: true,
      deep: true,
      handler(newValue) {
        if (newValue.length) {
          this.dealVirtualList(this.list, false);
        }
      },
    },
  },
};
</script>

<style lang="less" scoped>
.virtual {
  position: relative;
  .virtual-container {
    overflow: auto;
    height: 100%;
    position: relative;
    &::-webkit-scrollbar {
      display: none;
    }
    .virtual-inner {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }
  }
}
</style>
