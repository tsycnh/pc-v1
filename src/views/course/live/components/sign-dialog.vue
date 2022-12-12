<template>
  <transition name="fade">
    <div class="mask">
      <div class="dialog-box">
        <div class="dialog-header">
          <span>大家快来签到啦！</span>
        </div>
        <div class="dialog-body">
          <div class="count">{{ count }}</div>
          <button class="button" @click="confirm">点击签到</button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import GoMeeduRequest from "@/js/go-meedu/request.js";
import config from "@/js/config.js";
export default {
  props: ["cid", "records"],
  data() {
    return {
      vid: this.$route.query.id,
      loading: false,
      count: "",
      timer: null,
      num: 0,
    };
  },
  watch: {},
  mounted() {
    this.GoMeeduRequest = new GoMeeduRequest(config.goMeeduUri);
    this.getCount();
  },
  beforeDestroy() {
    this.count = "";
    clearInterval(this.timer);
    this.timer = null;
  },
  methods: {
    getCount() {
      let end_at = this.records.end_at;
      const value = (Date.parse(end_at) - new Date()) / 1000;
      if (parseInt(value) > 0) {
        this.countDown(parseInt(value));
      }
    },
    countDown(duration) {
      const TIME_COUNT = duration;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.count = "";
            clearInterval(this.timer);
            this.timer = null;
            this.$emit("close");
          }
        }, 1000);
      }
    },
    confirm() {
      this.sign();
    },
    sign() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.GoMeeduRequest.Sign(this.cid, this.vid, this.records.id)
        .then(() => {
          this.loading = false;
          this.count = "";
          clearInterval(this.timer);
          this.timer = null;
          this.$message.success("签到成功");
          this.$emit("close");
        })
        .catch((e) => {
          this.loading = false;
          this.$message.error(e.message);
        });
    },
  },
};
</script>
<style lang="less" scoped>
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 801;
  background-color: rgba(0, 0, 0, 0.5);
}
.dialog-box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 500px;
  height: 400px;
  background-color: white;
  border-radius: 8px;
  animation: scaleBig 0.3s;
  margin-left: -250px;
  margin-top: -200px;
  .dialog-header {
    width: 100%;
    height: auto;
    float: left;
    box-sizing: border-box;
    padding: 30px;
    line-height: 18px;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    span {
      flex: 1;
      font-size: 18px;
      font-weight: 500;
      color: #333333;
      line-height: 20px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .icon-close {
      width: 16.25px;
      height: 16.25px;
      margin-right: 2px;
      margin-top: 2px;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
    }
  }
  .dialog-body {
    width: 100%;
    height: 310px;
    float: left;
    box-sizing: border-box;
    padding: 0px 30px 30px 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .num {
      width: 100%;
      height: 16px;
      font-size: 16px;
      font-weight: 400;
      color: #333333;
      line-height: 16px;
      margin-bottom: 30px;
      text-align: center;
      i {
        font-style: normal;
        color: #ff4d4f;
      }
    }
    .count {
      width: 150px;
      height: 150px;
      background: rgba(#ff4d4f, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 41px;
      font-weight: 600;
      color: #ff4d4f;
      line-height: 41px;
      margin-bottom: 40px;
    }
    .button {
      display: inline-block;
      width: auto;
      height: auto;
      font-size: 14px;
      font-weight: 400;
      color: #fff;
      line-height: 18px;
      cursor: pointer;
      background: #ef4444;
      padding: 12px 20px;
      border-radius: 4px;
      outline: none;
      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>
