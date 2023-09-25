<template>
  <div :style="{ visibility: showBar ? 'visible' : 'hidden' }">
    <div
      class="virtual-bar"
      :style="barStyle"
      ref="barEl"
      @mousedown="handleMouseDown"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    barStyle: {
      type: Object,
      default: () => ({}),
    },
    moveDom: {
      type: HTMLDivElement,
      default: null,
    },
    reverse: {
      type: Boolean,
      default: false,
    },
    barCnt: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      curY: 0,
      isDown: false,
      showBar: false,
      timer: null,
    };
  },
  destroyed() {
    if (this.timer) {
      this.clearShowBar();
    }
  },
  methods: {
    clearShowBar() {
      this.timer = setTimeout(() => {
        this.showBar = false;
        clearTimeout(this.timer);
        this.timer = null;
      }, 2000);
    },
    handleShowBar() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.showBar = true;
      this.clearShowBar();
    },
    handleMouseDown(e) {
      this.curY = e.pageY;
      this.isDown = true;
      this.addEvent();
    },
    dealMouseMove(e) {
      if (this.isDown) {
        this.handleShowBar();
        const len = e.pageY - this.curY;
        this.curY = e.pageY;
        if (this.moveDom) {
          const { scrollHeight, clientHeight, scrollTop } = this.moveDom;
          const target = (scrollHeight * len) / clientHeight;
          if (this.reverse) {
            this.moveDom.scrollTo(0, scrollTop - target);
          } else {
            this.moveDom.scrollTo(0, scrollTop + target);
          }
        }
        e.preventDefault();
      }
    },
    dealMouseUp() {
      if (this.isDown) {
        this.curY = 0;
        this.isDown = false;
        this.removeEvent();
      }
    },
    removeEvent() {
      document.removeEventListener("mouseup", this.dealMouseUp);
      this.$refs.barEl?.removeEventListener("mouseup", this.dealMouseUp);

      document.removeEventListener("mousemove", this.dealMouseMove);
    },
    addEvent() {
      document.addEventListener("mouseup", this.dealMouseUp);
      this.$refs.barEl?.addEventListener("mouseup", this.dealMouseUp);

      document.addEventListener("mousemove", this.dealMouseMove);
    },
  },
  destroyed() {
    this.removeEvent();
  },
  watch: {
    barCnt(newValue) {
      if (newValue > 0) {
        this.handleShowBar();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.virtual-bar {
  position: absolute;
  right: 0px;
  top: 0px;
  width: 10px;
  border-radius: 5px;
  height: 10px;
  background-color: #999;
  z-index: 100;
  cursor: pointer;
}
</style>
