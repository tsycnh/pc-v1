<template>
  <div class="cot-box">
    <div class="mask" v-if="status">
      <div class="dialog-login-box">
        <div class="tabs">
          <img
            class="btn-close"
            @click="cancel()"
            src="../assets/img/commen/icon-close.png"
          />
        </div>
        <div class="box">
          <div id="qrcode" class="qrode"></div>
        </div>
        <p>请使用手机扫描</p>
        <p>上方二维码完成实名认证</p>
      </div>
    </div>
  </div>
</template>
<script>
import QRCode from "qrcodejs2";

export default {
  props: ["status"],
  data() {
    return {
      timer: null,
      loading: false,
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
  beforeDestroy() {},
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
          this.verifyLoading = false;
          let link = res.data.url;
          this.ruleId = res.data.rule_id;
          this.bizToken = res.data.biz_token;
          var qrcode = new QRCode("qrcode", {
            text: link, //表示内容，可以是地址或者是文字'55566'或者参数
            width: 250,
            height: 250,
            colorDark: "#000000", //前景色
            colorLight: "#ffffff", //背景色
            correctLevel: QRCode.CorrectLevel.H, //容错级别
          });
        })
        .catch((e) => {
          this.verifyLoading = false;
          this.$emit("cancel");
          this.$message.error(e.message || "无法发起实人认证");
        });
    },
    cancel() {
      this.$emit("cancel");
    },
    checkFaceVerify() {
      this.$api.Member.TecentFaceVerifyQuery({
        biz_token: this.bizToken,
        rule_id: this.ruleId,
      }).then((res) => {
        if (res.data.status === 9) {
          this.$message.success("实人认证成功");

          this.$emit("change");
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
    height: 500px;
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
    }
    .box {
      width: 100%;
      margin-top: 30px;
      display: flex;
      flex-direction: column;
      .qrode {
        width: 250px;
        height: 250px;
        margin: 0 auto;
        margin-bottom: 30px;
      }
    }
    p {
      width: 100%;
      text-align: center;
      font-size: 16px;
      font-weight: 400;
      color: #333333;
      line-height: 30px;
    }
  }
}
</style>
