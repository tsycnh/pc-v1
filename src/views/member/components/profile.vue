<template>
  <div class="pro-box">
    <div class="result">
      <img
        class="thumb"
        v-if="user.is_face_verify"
        src="../../../assets/img/commen/faceSuccess.png"
      />
      <img
        class="thumb"
        v-else
        src="../../../assets/img/commen/no-facecheck.png"
      />
    </div>
    <div v-if="user.is_face_verify" class="profile">
      <div class="profile-item">
        <span class="label">姓名</span>
        <span>{{ user.profile_real_name }}</span>
      </div>
      <div class="profile-item">
        <span class="label">身份证号</span>
        <span>{{ user.profile_id_number }}</span>
      </div>
    </div>
    <div v-else class="btn-box">
      <div class="button-submit active" @click="showFaceCheck">
        开始认证
      </div>
    </div>
    <tencent-face-check
      :status="faceCheckVisible"
      @cancel="cancelFaceCheckDialog"
      @change="faceChecksuccess"
    >
    </tencent-face-check>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import TencentFaceCheck from "../../../components/tencent-face-check.vue";
export default {
  components: {
    TencentFaceCheck,
  },
  props: [],
  data() {
    return {
      loading: false,
      init: false,
      faceCheckVisible: false,
    };
  },

  computed: {
    ...mapState(["isLogin", "user", "config"]),
  },
  mounted() {},
  methods: {
    ...mapMutations(["loginHandle"]),
    getData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.init = false;
      this.$api.User.Detail().then((res) => {
        this.loginHandle(res.data);
        this.loading = false;
        this.init = true;
      });
    },
    showFaceCheck() {
      this.faceCheckVisible = true;
    },
    faceChecksuccess() {
      this.faceCheckVisible = false;
      this.getData();
    },
    cancelFaceCheckDialog() {
      this.faceCheckVisible = false;
    },
  },
};
</script>
<style lang="less" scoped>
.pro-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  .profile {
    width: 100%;
    display: flex;
    flex-direction: column;
    .profile-item {
      width: 100%;
      height: 14px;
      display: flex;
      align-items: center;
      flex-direction: row;
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      line-height: 14px;
      margin-bottom: 30px;
      .label {
        width: 70px;
        margin-right: 10px;
      }
    }
  }
  .btn-box {
    width: 100%;
    height: 44px;
    display: flex;
    align-items: center;
    flex-direction: row;
    .button-submit {
      width: 96px;
      height: 44px;
      margin-left: 52px;
      background: #cccccc;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 400;
      color: #ffffff;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
      &.active {
        background: #3ca7fa;
      }
    }
  }
  .result {
    width: 100%;
    display: flex;
    flex-direction: column;
    .thumb {
      width: 200px;
      height: 200px;
      margin-bottom: 30px;
    }
  }
}
</style>
