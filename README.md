## vue-auto-list

use for vue2

> this is for [react-auto-list](https://www.npmjs.com/package/wang-rc-virtual-list)

![demo](./assets/demo.gif)

## fixed height

![fixed height](./assets/normalList.png)

```javascript
import {VirtualList} from '.'
<VirtualList
  :list="list1"
  :itemHeight="40"
  :height="400"
  :itemKey="'id'"
  @scrollToBottom="handleBottom"
  @scroll="scroll"
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
```

## auto size height

![fixed height](./assets/autoList.png)

```javascript
import {AutoSizeVirtualList} from '.'
<AutoSizeVirtualList
  :list="list1"
  @scrollToBottom="handleBottom"
  @scroll="scroll"
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
```

## auto reverse size height

![fixed height](./assets/reverseAutoList.png)

just use footer

```javascript
<RevertAutoSizeVirtualList
  :list="list1"
  @scrollToBottom="handleBottom"
  @scroll="scroll"
  :scrollToTop="scrollToTop2"
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
  <template v-slot:footer>loading。。。 </template>
</RevertAutoSizeVirtualList>
```

you can see example demo
