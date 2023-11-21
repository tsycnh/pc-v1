<template>
  <div class="content-box">
    <div class="flex justify-center" style="width: 100%">
      <div
        v-if="isContain"
        class="thumb"
        :style="{
          'background-color': '#f5f5f5',
          'border-radius': border + 'px',
          'background-image': 'url(' + value + ')',
          width: width + 'px',
          height: height + 'px',
          'background-position': 'center center',
          'background-size': 'contain',
          'background-repeat': 'no-repeat',
        }"
      ></div>
      <div
        v-else
        class="thumb"
        :style="{
          'border-radius': border + 'px',
          'background-image': 'url(' + value + ')',
          width: width + 'px',
          height: height + 'px',
          'background-position': 'center center',
          'background-size': 'cover',
          'background-repeat': 'no-repeat',
        }"
      ></div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["value", "width", "height", "border", "isContain"],
  methods: {},
};
</script>
<style lang="less" scoped>
.content-box {
  display: block;
  width: 100%;
  height: auto;
}
</style>
