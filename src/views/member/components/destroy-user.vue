<template>
  <div class="mask" v-if="status">
    <div style="height:284px" class="dialog-login-box">
      <div class="dialog-tabs">
        <div class="item-tab">账号注销</div>
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
      </div>
      <div class="btn-box">
        <button type="submit" class="submit" @click="cancel()">
          暂不注销
        </button>
        <button type="cancel" class="cancel" @click="destroyUserValidate()">
          确认注销
        </button>
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
    padding: 30px 0px;
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
        height: 60px;
        font-size: 16px;
        font-weight: 400;
        color: #333333;
        line-height: 30px;
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
        width: 88px;
        height: 44px;
        background: #3ca7fa;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 400;
        color: #ffffff;
        line-height: 14px;
        outline: none;
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
        margin-right: 30px;
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
}
</style>
