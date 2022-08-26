<template>
  <div class="mask" v-if="status">
    <div style="height: 270px" class="dialog-login-box">
      <div class="tabs">
        <div class="item-tab active">注销账号</div>
        <img
          class="btn-close"
          @click="cancel()"
          src="@/assets/img/commen/icon-close.png"
        />
      </div>
      <div class="box">
        <div class="input-item">
          确认注销账号？确认之后账号将在7天后自动注销，期间内登录账号将会自动取消账号注销。
        </div>
        <div class="btn-box" style="margin-bottom: 0px !important">
          <button type="submit" class="submit" @click="destroyUserValidate()">
            注销
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  props: ["status"],
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState(["config"]),
  },
  methods: {
    ...mapMutations(["logout"]),
    cancel() {
      this.$emit("cancel", true);
    },
    destroyUserValidate() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Auth.DestroyUser()
        .then((res) => {
          this.loading = false;
          this.$message.success("注销成功");
          this.logout();
          this.$router.replace({
            name: "index",
          });
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
      .box-mobile {
        width: 100%;
        height: 24px;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 50px;
        span {
          height: 18px;
          font-size: 18px;
          font-weight: 600;
          color: #333333;
          line-height: 18px;
          strong {
            height: 24px;
            font-size: 24px;
            line-height: 24px;
          }
        }
      }
      .input-item {
        width: 100%;
        margin-bottom: 30px;
        display: flex;
        flex-direction: row;
        align-items: center;
        .input {
          width: 100%;
          height: 54px;
          background: #f4fafe;
          border-radius: 4px;
          border: 1px solid #e5e5e5;
          padding-left: 20px;
          outline: none;
        }
        .input-short {
          width: 310px;
          height: 54px;
          background: #f4fafe;
          border-radius: 4px;
          border: 1px solid #e5e5e5;
          padding-left: 20px;
          margin-right: 20px;
          outline: none;
        }
        .captcha {
          width: 110px;
          height: 39px;
          cursor: pointer;
          img {
            width: 110px;
            height: 39px;
          }
        }
        .buttons {
          margin-left: 20px;
          .send-sms-button {
            width: 90px;
            height: 18px;
            font-size: 18px;
            font-weight: 400;
            color: #3ca7fa;
            line-height: 18px;
            cursor: pointer;
            &:hover {
              opacity: 0.8;
            }
          }
        }
      }
      .btn-box {
        width: 100%;
        margin-bottom: 30px;
        .submit {
          width: 100%;
          height: 54px;
          background: #3ca7fa;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 400;
          color: #ffffff;
          line-height: 16px;
          outline: none;
          &:hover {
            opacity: 0.8;
          }
        }
        .logout {
          width: 100%;
          height: 54px;
          background: #fff;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 400;
          color: #999999;
          line-height: 14px;
          outline: none;
          &:hover {
            opacity: 0.8;
          }
        }
      }
      .others {
        width: 100%;
        margin-top: 50px;
        &.active {
          margin-top: 0px;
        }
        .tit {
          width: 100%;
          text-align: center;
          height: 14px;
          font-size: 14px;
          font-weight: 400;
          color: #999999;
          line-height: 14px;
          margin-bottom: 30px;
        }
        .tab-icon {
          width: 100%;
          display: flex;
          justify-content: center;
          .btn-others {
            margin-right: 64px;
            width: 48px;
            height: 48px;
            cursor: pointer;
            &:hover {
              opacity: 0.8;
            }
            &:last-child {
              margin-right: 0px;
            }
          }
        }
      }
    }
  }
}
</style>
