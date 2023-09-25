<template>
  <div class="auto-virtual">
    <div class="auto-virtual-list" ref="listEl">
      <div ref="containerEl">
        <div ref="header"><slot name="header"></slot></div>
        <div
          ref="bgEl"
          :style="{ height: cache[cache.length - 1].bottom + 'px' }"
        ></div>
        <slot name="footer"></slot>
      </div>
      <div
        class="auto-virtual-list_container"
        ref="innerEl"
        :style="{
          transform: `translateY(${cache[start].top + headerHeight}px)`,
        }"
      >
        <div
          class="list-item"
          v-for="(item, index) in showList"
          :key="item[itemKey]"
          :data-index="cache[index + start].index"
        >
          <slot :item="item" name="item"></slot>
        </div>
      </div>
    </div>
    <Bar :barStyle="barStyle" :moveDom="$refs.listEl" :barCnt="barCnt" />
  </div>
</template>

<script>
import { throttle, findStartByIndex } from "./utils/utils";
import { resizeCb } from "./utils/resizeObverser";
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
      cache: [],
      start: 0,
      end: 0,
      barCnt: 0,
      barStyle: {},
      headerHeight: 0,
    };
  },
  mounted() {
    this.$refs.listEl?.addEventListener(
      "scroll",
      throttle((e) => {
        this.handleScroll(e);
      })
    );
    this.headerHeight = this.$refs.header.clientHeight;
    this.resizeDom = resizeCb(this.resizeCb);
    this.resizeDom.observe(this.$refs.containerEl);
    this.autoSizeVirtualList();
  },
  destroyed() {
    this.$refs.listEl?.removeEventListener(
      "scroll",
      throttle((e) => {
        this.handleScroll(e);
      })
    );
    if (this.resizeDom && this.$refs.containerEl) {
      this.resizeDom.unobserve(this.$refs.containerEl);
    }
  },
  computed: {
    viewCnt() {
      return Math.min(Math.floor(this.height / this.minSize), this.list.length);
    },
    showList() {
      if (this.list.length) {
        return this.list.slice(this.start, this.end);
      }
      return [];
    },
  },
  methods: {
    resizeCb() {
      this.updateCells();
    },
    handleScroll(e) {
      this.barCnt = this.barCnt + 1;
      this.$emit("handleScroll", e);
      this.autoSizeVirtualList();
    },
    updateCells() {
      if (this.$refs.innerEl && this.cache.length) {
        const listItems = this.$refs.innerEl.querySelectorAll(".list-item");
        if (listItems.length === 0) {
          return;
        }
        const lastIndex =
          +listItems[listItems.length - 1].getAttribute("data-index");
        [...listItems].forEach((listItem) => {
          const rectBox = listItem.getBoundingClientRect();
          const index = +listItem.getAttribute("data-index");
          const prevItem = this.cache[index - 1];
          const top = prevItem ? prevItem.bottom : 0;
          Object.assign(this.cache[index], {
            height: rectBox.height,
            top,
            bottom: top + rectBox.height,
            isUpdate: true,
          });
        });
        for (let i = lastIndex + 1; i < this.cache.length; i++) {
          const prevItem = this.cache[i - 1];
          const top = prevItem ? prevItem.bottom : 0;
          Object.assign(this.cache[i], {
            top,
            bottom: top + this.cache[i].height,
          });
        }
      }
    },
    renderScrollBar({ allHeight, height, top }) {
      const target = (height * height) / allHeight;
      const scrollTop = (height * top) / allHeight;
      this.barStyle = {
        height: `${target}px`,
        top: `${scrollTop}px`,
      };
    },
    autoSizeVirtualList() {
      if (this.list.length && this.$refs.listEl) {
        const { scrollTop, clientHeight, offsetHeight } = this.$refs.listEl;
        this.renderScrollBar({
          allHeight: this.$refs.containerEl.offsetHeight,
          height: offsetHeight,
          top: scrollTop,
        });
        const start = findStartByIndex(this.cache, scrollTop);
        this.start = Math.max(0, start - this.offset);
        this.end = Math.min(
          this.list.length,
          this.start + this.viewCnt + this.offset
        );

        this.updateCells();

        const bottom = this.cache[this.cache.length - 1]?.bottom;
        if (bottom) {
          const { clientHeight: curHeight } = this.$refs.containerEl;
          if (curHeight <= scrollTop + clientHeight && curHeight >= bottom) {
            this.scrollEnd();
          }
        }
      }
    },
    scrollEnd() {
      this.$emit("scrollToBottom");
    },
  },
  watch: {
    list: {
      deep: true,
      immediate: true,
      handler(newValue) {
        if (newValue.length) {
          for (let i = 0; i < newValue.length; i++) {
            if (this.cache[i]) {
              continue;
            }
            const pre = this.cache[i - 1] ? this.cache[i - 1].bottom : 0;
            this.cache.push({
              index: i,
              height: this.itemHeight,
              top: pre,
              bottom: pre + this.itemHeight,
            });
          }
        }
        this.autoSizeVirtualList();
      },
    },
    scrollToTop(newValue) {
      if (newValue) {
        this.$refs.listEl.scrollTo(0, 0);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.auto-virtual {
  height: 100%;
  overflow: hidden;
  position: relative;
  .auto-virtual-list {
    height: 100%;
    position: relative;
    width: 100%;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    &_container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }
  }
  .auto-virtual-bar {
    position: absolute;
    right: 0px;
    top: 0px;
    width: 10px;
    border-radius: 5px;
    background-color: #999;
    z-index: 100;
    cursor: pointer;
  }
}
</style>
