<template>
  <WrapVirtualList :height="height" :moveDom="$refs.containerEl">
    <Bar
      :barStyle="barStyle"
      :moveDom="$refs.containerEl"
      :barCnt="barCnt"
      :reverse="true"
    />
    <div class="virtual-container" ref="containerEl">
      <div
        class="virtual-bg"
        ref="bgEl"
        :style="{ height: cache[cache.length - 1].bottom + 'px' }"
      ></div>
      <slot name="footer"></slot>
    </div>
    <div class="virtual-content">
      <div
        ref="innerEl"
        class="virtual-inner"
        :style="{
          bottom: `-${scrollTop}px`,
          transform: `translateY(-${cache[start].top}px)`,
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
        <slot name="footer"></slot>
      </div>
    </div>
  </WrapVirtualList>
</template>

<script>
import { throttle, findStartByIndex } from "./utils/utils";
import { resizeCb } from "./utils/resizeObverser";
import Bar from "./com/Bar.vue";
import WrapVirtualList from "./com/WrapVirtualList.vue";
export default {
  components: {
    WrapVirtualList,
    Bar,
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
      start: 0,
      end: 0,
      scrollTop: 0,
      barCnt: 0,
      cache: [],
      barStyle: {},
    };
  },
  mounted() {
    this.$refs.containerEl?.addEventListener(
      "scroll",
      throttle((e) => {
        this.handleScroll(e);
      })
    );
    this.resizeDom = resizeCb(this.resizeCb);
    this.resizeDom.observe(this.$refs.innerEl);
    this.autoSizeVirtualList();
  },
  destroyed() {
    this.$refs.containerEl?.removeEventListener(
      "scroll",
      throttle((e) => {
        this.handleScroll(e);
      })
    );
    if (this.resizeDom && this.$refs.innerEl) {
      this.resizeDom.unobserve(this.$refs.innerEl);
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
    autoSizeVirtualList() {
      if (this.list.length && this.$refs.containerEl) {
        const { scrollTop, clientHeight, offsetHeight } =
          this.$refs.containerEl;
        this.scrollTop = scrollTop;
        this.renderScrollBar({
          allHeight: this.$refs.bgEl.offsetHeight,
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
        if (this.$refs.containerEl && bottom) {
          const { scrollHeight } = this.$refs.containerEl;
          if (
            scrollHeight <= Math.ceil(scrollTop + clientHeight) &&
            scrollHeight >= bottom
          ) {
            this.scrollEnd();
          }
        }
      }
    },
    renderScrollBar({ allHeight, height, top }) {
      const target = (height * height) / allHeight;
      const bottom = (height * top) / allHeight;
      this.barStyle = {
        height: `${target}px`,
        transform: `translateY(${height - target - bottom}px)`,
      };
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
        this.$refs.containerEl.scrollTo(0, 0);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.wrap-virtual {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  .virtual {
    &-bg {
      width: 100%;
    }
    &-container {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      outline: 1px solid seagreen;
      position: relative;
      overflow: auto;
    }
    &-content {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      display: flex;
      flex-direction: column-reverse;
    }
    &-bar {
      position: absolute;
      right: 0;
      width: 10px;
      background-color: #999;
      border-radius: 5px;
      z-index: 999;
      cursor: pointer;
    }
    &-inner {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column-reverse;
    }
  }
  ::-webkit-scrollbar {
    display: none;
  }
}
</style>
