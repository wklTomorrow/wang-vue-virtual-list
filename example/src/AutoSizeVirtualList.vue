<script lang="ts">
// import { VirtualList } from "../../dist/index.js";
import { AutoSizeVirtualList } from "../../src/index";
const randomIncludes = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
export default {
  components: {
    AutoSizeVirtualList,
  },
  data() {
    return {
      list: Array.from({ length: 100 }).map((item, i) => ({
        name: `item ${i}`,
        id: Math.random(),
        height: randomIncludes(40, 120),
      })),
      list1: Array.from({ length: 100 }).map((item, i) => ({
        name: `item ${i}`,
        id: Math.random(),
        height: randomIncludes(40, 120),
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
          ...Array.from({ length: 100 }).map((item, i) => ({
            name: `item ${this.list1.length + i}`,
            id: Math.random(),
            height: randomIncludes(40, 120),
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
        <AutoSizeVirtualList
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
                height: `${item.height}px`,
                'outline-offset': '-2px',
                'background-color': '#fff',
              }"
            >
              {{ item.name }}
            </div>
          </template>
        </AutoSizeVirtualList>
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
        <AutoSizeVirtualList
          :list="list1"
          @scrollToBottom="handleBottom"
          :scrollToTop="scrollToTop2"
          :itemKey="'id'"
          :itemHeight="40"
          :height="400"
        >
          <template v-slot:header>this is header </template>
          <template v-slot:item="{ item }">
            <div
              class="inner-item"
              :style="{
                outline: '1px solid red',
                height: `${item.height}px`,
                'outline-offset': '-2px',
                'background-color': '#fff',
              }"
            >
              {{ item.name }}
            </div>
          </template>
          <template v-slot:footer>loading。。。 </template>
        </AutoSizeVirtualList>
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
