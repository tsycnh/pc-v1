<template>
  <div class="cot-box">
    <div class="mask" v-if="status">
      <div class="dialog-login-box">
        <div class="tabs">
          <div class="tit">微信扫描行下方二维码实名认证</div>
        </div>
        <div class="tabs">
          <div class="time">
            <count-down
              v-if="wxCountDownStatus"
              type="face"
              :timestamp="600"
            ></count-down>
          </div>
        </div>
        <div class="box">
          <div id="qrcode" class="qrode"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CountDown from "./count-down.vue";
import QRCode from "qrcodejs2";

export default {
  props: ["status"],
  components: {
    CountDown,
  },
  data() {
    return {
      timer: null,
      loading: false,
      wxCountDownStatus: false,
      verifyLoading: false,
      ruleId: null,
      bizToken: null,
    };
  },
  watch: {
    status(val) {
      if (val) {
        this.goFaceVerify();
      }
    },
  },
  mounted() {},
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    goFaceVerify() {
      if (this.verifyLoading) {
        return;
      }
      this.verifyLoading = true;
      this.verifySelf();
    },
    verifySelf() {
      this.$api.Member.TecentFaceVerify({
        s_url: "PC",
      })
        .then((res) => {
          this.wxCountDownStatus = false;
          this.verifyLoading = false;
          let link = res.data.url;
          this.ruleId = res.data.rule_id;
          this.bizToken = res.data.biz_token;
          var qrcode = new QRCode("qrcode", {
            text: link, //表示内容，可以是地址或者是文字'55566'或者参数
            width: 300,
            height: 300,
            colorDark: "#000000", //前景色
            colorLight: "#ffffff", //背景色
            correctLevel: QRCode.CorrectLevel.H, //容错级别
          });
          this.wxCountDownStatus = true;
          this.timer = setInterval(this.checkFaceVerify, 2500);
        })
        .catch((e) => {
          this.verifyLoading = false;
          this.$message.error(e.message || "无法发起实人认证");
        });
    },
    checkFaceVerify() {
      this.$api.Member.TecentFaceVerifyQuery({
        biz_token: this.bizToken,
        rule_id: this.ruleId,
      }).then((res) => {
        if (res.data.status === 9) {
          this.$message.success("实人认证成功");
          clearInterval(this.timer);
          this.$emit("cancel");
          this.$router.replace({
            name: "index",
          });
        }
      });
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
  z-index: 1001;
  .dialog-login-box {
    width: 500px;
    max-height: 620px;
    background: #ffffff;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 30px;
    animation: scaleBig 0.3s;
    .tabs {
      width: 100%;
      height: 44px;
      display: flex;
      flex-direction: row;
      position: relative;

      .linkTab {
        position: absolute;
        top: 5px;
        right: 54px;
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: #3ca7fa;
        line-height: 14px;
        cursor: pointer;
        &:hover {
          opacity: 0.8;
        }
      }
      .linkTab2 {
        position: absolute;
        top: 5px;
        right: 0px;
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: #3ca7fa;
        line-height: 14px;
        cursor: pointer;
        &:hover {
          opacity: 0.8;
        }
      }

      .btn-close {
        width: 24px;
        height: 24px;
        position: absolute;
        right: 6px;
        top: 2px;
        cursor: pointer;

        &:hover {
          opacity: 0.8;
          animation: rotate360 1s;
        }
      }
      .tit {
        width: 100%;
        height: 20px;
        font-size: 20px;
        font-weight: 500;
        color: #333333;
        line-height: 20px;
        position: relative;
        text-align: center;
      }
      .time {
        width: 100%;
        height: 20px;
        font-size: 20px;
        font-weight: bold;
        color: #333333;
        line-height: 20px;
        position: relative;
        text-align: center;
      }
      .item-tab {
        width: auto;
        height: 20px;
        font-size: 20px;
        font-weight: 500;
        color: #666666;
        line-height: 20px;
        margin-right: 50px;
        cursor: pointer;
        position: relative;
        &.active {
          color: #333333;
        }
        .actline {
          width: 80px;
          height: 4px;
          background: #3ca7fa;
          position: absolute;
          left: 0px;
          top: 40px;
        }
      }
    }
    .box {
      width: 100%;
      margin-top: 30px;
      display: flex;
      flex-direction: column;
      .qrode {
        width: 300px;
        height: 300px;
        margin: 0 auto;
        margin-bottom: 30px;
      }
    }
  }
}
</style>
