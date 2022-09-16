<template>
  <transition name="fade">
    <div class="mask" v-show="status">
      <div class="dialog-login-box">
        <div class="dialog-tabs">
          <div class="item-tab">订阅课时</div>
          <img
            class="btn-close"
            @click="cancel()"
            src="@/assets/img/commen/icon-close.png"
          />
        </div>
        <div class="box">
          <div class="input-item">
            {{ configText }}
          </div>
        </div>
        <div class="btn-box">
          <button
            type="submit"
            class="submit"
            v-if="courseCharge > 0"
            @click="payCourse()"
          >
            立即订阅
          </button>
          <button
            type="submit"
            class="submit"
            v-if="vipFree === 1"
            @click="payVip()"
          >
            会员免费看
          </button>
          <button type="cancel" class="cancel" @click="cancel()">
            取消
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: [
    "courseCharge",
    "videoCharge",
    "vipFree",
    "configText",
    "status",
    "is_ban_sell",
  ],
  data() {
    return {};
  },
  methods: {
    payCourse() {
      this.$emit("payOrder", 1);
    },
    payVip() {
      this.$emit("payOrder", 2);
    },
    payVideo() {
      this.$emit("payOrder", 3);
    },
    cancel() {
      this.$emit("hideDialog");
    },
  },
};
</script>
<style lang="less" scoped>
.mask {
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  .dialog-login-box {
    width: 500px;
    max-height: 620px;
    background: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 30px 0px 0px 0px;
    animation: scaleBig 0.3s;

    .dialog-tabs {
      width: 100%;
      height: 20px;
      display: flex;
      flex-direction: row;
      position: relative;
      box-sizing: border-box;
      padding: 0px 30px;

      .btn-close {
        width: 16.25px;
        height: 16.25px;
        position: absolute;
        right: 22px;
        top: 2px;
        cursor: pointer;

        &:hover {
          opacity: 0.8;
          animation: rotate360 1s;
        }
      }
      .item-tab {
        width: auto;
        height: 20px;
        font-size: 18px;
        font-weight: 500;
        color: #333333;
        line-height: 20px;
      }
    }
    .box {
      width: 100%;
      margin-top: 50px;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding: 0px 30px;
      margin-bottom: 50px;
      .input-item {
        width: 100%;
        height: 30px;
        font-size: 16px;
        font-weight: 400;
        color: #333333;
        line-height: 30px;
        text-align: center;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
      }
    }
    .btn-box {
      width: 100%;
      height: 74px;
      background: #ffffff;
      box-shadow: 0px -2px 4px 0px rgba(102, 102, 102, 0.05);
      box-sizing: border-box;
      padding: 15px 30px;
      display: flex;
      flex-direction: row-reverse;
      .submit {
        width: 116px;
        height: 44px;
        background: #ff4d4f;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 400;
        color: #ffffff;
        line-height: 14px;
        outline: none;
        margin-left: 30px;
        &:hover {
          opacity: 0.8;
        }
      }
      .cancel {
        width: 88px;
        height: 44px;
        border: 1px solid #cccccc;
        background: #fff;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 14px;
        outline: none;

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
}
</style>
