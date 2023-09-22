<script lang="ts">
// import { VirtualList } from "../../dist/index.js";
import { VirtualList } from "../../src/index";
export default {
  components: {
    VirtualList,
  },
  data() {
    return {
      list: Array.from({ length: 100 }, (_, i: number) => ({
        id: Math.random(),
        index: i,
      })),
      list1: Array.from({ length: 100 }, (_, i: number) => ({
        id: Math.random(),
        index: i,
      })),
      scrollToTop1: 0,
      scrollToTop2: 0,
    };
  },
  mounted() {},
  methods: {
    handleBottom() {
      setTimeout(() => {
        this.list1 = [
          ...this.list1,
          ...Array.from({ length: 100 }, (_, i: number) => ({
            id: Math.random(),
            index: this.list1.length + i,
          })),
        ];
      }, 1000);
    },
  },
};
</script>

<template>
  <div
    :style="{
      display: 'flex',
      width: '100%',
    }"
  >
    <div class="wrap">
      <div class="use">
        use <button @click="scrollToTop1 = scrollToTop1 + 1">top</button>
      </div>
      <div
        :style="{
          height: '400px',
          outline: '1px solid seagreen',
          'margin-right': '20px',
        }"
      >
        <VirtualList
          :list="list"
          :scrollToTop="scrollToTop1"
          :itemKey="'id'"
          :itemHeight="40"
          :height="400"
        >
          <template v-slot:item="{ item }">
            <div
              class="inner-item"
              :style="{
                outline: '1px solid red',
                height: `40px`,
                'outline-offset': '-2px',
                'background-color': '#fff',
              }"
            >
              {{ item.index }}
            </div>
          </template>
        </VirtualList>
      </div>
    </div>
    <div class="wrap">
      <div class="use">
        set header、bottom, and load more
        <button @click="scrollToTop2 = scrollToTop2 + 1">top</button>
      </div>
      <div
        :style="{
          height: '400px',
          outline: '1px solid seagreen',
        }"
      >
        <VirtualList
          :list="list1"
          :itemHeight="40"
          :height="400"
          :itemKey="'id'"
          @scrollToBottom="handleBottom"
          :scrollToTop="scrollToTop2"
        >
          <template v-slot:header>this is header </template>
          <template v-slot:item="{ item }">
            <div
              class="inner-item"
              :style="{
                outline: '1px solid red',
                height: `40px`,
                'outline-offset': '-2px',
                'background-color': '#fff',
              }"
            >
              {{ item.index }}
            </div>
          </template>
          <template v-slot:footer>loading。。。 </template>
        </VirtualList>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  flex: 1;
  margin-right: 20px;
}
.use {
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
