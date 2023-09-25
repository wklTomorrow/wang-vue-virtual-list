<template>
  <div class="wrap-virtual" :style="{ height: `${height}px` }" ref="dom">
    <slot></slot>
  </div>
</template>

<script>
import { isMobileDevice } from "../utils/utils";
export default {
  props: {
    height: {
      type: Number,
      default: 400,
    },
    moveDom: {
      type: HTMLDivElement,
      default: null,
    },
  },
  data() {
    return {
      curY: 0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (this.moveDom && this.$refs.dom) {
        if (isMobileDevice()) {
          this.$refs.dom.addEventListener("touchstart", this.handleTouchStart, {
            passive: false,
          });
        } else {
          this.$refs.dom.addEventListener("wheel", this.handleWheel);
        }
      }
    });
  },
  destroyed() {
    this.$nextTick(() => {
      if (this.moveDom && this.$refs.dom) {
        if (isMobileDevice()) {
          this.$refs.dom.removeEventListener(
            "touchstart",
            this.handleTouchStart,
            {
              passive: false,
            }
          );
        } else {
          this.$refs.dom.removeEventListener("wheel", this.handleWheel);
        }
      }
    });
  },
  methods: {
    handleTouchStart(e) {
      const { pageY } = e.touches[0];
      this.curY = pageY;
      this.addEvent();
    },
    handleWheel(e) {
      if (this.moveDom) {
        const { scrollTop } = this.moveDom;
        this.moveDom.scrollTo(0, Math.max(0, scrollTop - e.deltaY));
        e.preventDefault();
        return false;
      }
    },
    handleTouchEnd() {
      this.removeEvent();
      this.curY = 0;
    },
    handleTouchMove(e) {
      const { pageY } = e.touches[0];
      const len = pageY - this.curY;
      if (this.moveDom) {
        const { scrollHeight, clientHeight, scrollTop } = this.moveDom;
        const target = (scrollHeight * len) / clientHeight;
        this.moveDom.scrollTo(0, scrollTop + target);
      }
      this.curY = pageY;

      e.preventDefault();
      return false;
    },
    addEvent() {
      this.$refs.dom.addEventListener("touchend", this.handleTouchEnd);
      this.$refs.dom.addEventListener("touchmove", this.handleTouchMove, {
        passive: false,
      });
    },
    removeEvent() {
      this.$refs.dom.removeEventListener("touchend", this.handleTouchEnd);
      this.$refs.dom.removeEventListener("touchmove", this.handleTouchMove);
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
}
</style>
