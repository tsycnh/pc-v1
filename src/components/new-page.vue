<template>
  <div class="page-wrapper clearfix">
    <div class="page-tab fl clearfix">
      <span class="fl h50">第{{ currentPage }}页</span>
      <button class="fl h50 cursor" v-if="currentPage !== 1" @click="prePage">
        <span>上一页</span>
      </button>
      <button class="fl h50 cursor" :class="{ canNot: over }" @click="nextPage">
        <span>下一页</span>
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: "VueNewPagination",
  props: ["page", "over"],
  data() {
    return {
      currentPage: this.page,
    };
  },
  created() {},
  methods: {
    nextPage() {
      // 下一页
      if (this.over) {
        // this.$message.error("没有更多了");
      } else {
        this.currentPage++;
      }
    },
    prePage() {
      // 上一页
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    firstPage() {
      // 首页
      this.currentPage = 1;
    },
  },
  watch: {
    page() {
      this.currentPage = this.page;
    },
    currentPage() {
      // 当前页数变化后 传递出当前页码 重新请求数据
      this.$emit("current-change", {
        currentPage: this.currentPage,
      });
    },
  },
};
</script>
<style lang="less" scoped>
ul,
li {
  list-style: none;
}

.clearfix:after {
  content: ".";
  height: 0;
  display: block;
  visibility: hidden;
  clear: both;
  overflow: hidden;
}

.cursor {
  cursor: pointer;
}
.cursor:hover {
  opacity: 0.8;
}

.clearfix {
  zoom: 1;
}

.page-wrapper .fl {
  float: left;
}
.page-wrapper {
  font-size: 14px;
  color: #333;
}
.h50 {
  display: inline-block;
  height: 30px;
  line-height: 30px;
  padding: 0 12px;
}

.page-wrapper .page-tab li {
  float: left;
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  box-sizing: border-box;
}

.page-wrapper .page-info {
  margin-right: 6px;
}

.page-wrapper .page-info .h50 {
  border: none;
  padding: 0;
}

.items-choose .h50 {
  padding: 0;
  border: none 0;
  border-top: 1px solid #eaedf1;
  border-bottom: 1px solid #eaedf1;
  box-sizing: border-box;
  padding: 0 6px;
}

.items-choose .items-show {
  height: 30px;
  width: 74px;
  position: relative;
  box-sizing: border-box;
  border: 1px solid #eaedf1;
  position: relative;
}
.items-choose .items-show input {
  height: 100%;
  width: 100%;
  text-align: center;
}
.items-choose .items-show:after {
  content: "";
  position: absolute;
  height: 0;
  border: 4px solid transparent;
  border-top: 6px solid #c4ccc5;
  top: 50%;
  right: 10px;
  transform: translate3d(-50, -50, 0);
  cursor: pointer;
}

.items-choose .items-num {
  width: 100%;
  position: absolute;
  bottom: 42px;
  border: 1px solid #eaedf1;
  z-index: 100;
  background: #f5f7fa;
  z-index: 999;
}

.items-choose .items-num li {
  padding: 10px 0 10px 6px;
  font-size: 14px;
}

.page-wrapper .activePage {
  color: #3ca7fa;
}

.canNot {
  cursor: not-allowed;
  color: #ccc !important;
}
.btn-icon {
  width: 16px;
  height: 16px;
}
.page-wrapper button {
  font-size: 14px;
  color: #666;
  border: none;
}
.page-wrapper button:focus {
  outline: 0;
}
.chooseNum {
  cursor: pointer;
  font-size: 14px;
  color: #333;
}
</style>
