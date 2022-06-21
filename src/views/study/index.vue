<template>
  <div class="content">
    <div class="contanier">
      <div class="top-box">
        <div class="top-title">
          <img class="icon" src="../../assets/img/study/icon-mystudy.png" />
          我的学习
        </div>
      </div>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import NavFooter from "../../components/footer.vue";
export default {
  components: {
    NavFooter,
  },
  data() {
    return {
      loading: false,
      list: [],
    };
  },
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  mounted() {},
  methods: {
    ...mapMutations(["showLoginDialog", "changeDialogType"]),
    goLogin() {
      this.changeDialogType(1);
      this.showLoginDialog();
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  width: 100%;
  float: left;
  height: 100%;
  background: #f4fafe;
  background-image: url("../../assets/img/study/banner.png");
  background-attachment: fixed;
  background-repeat: no-repeat;
  .contanier {
    width: 1200px;
    min-height: 500px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding-top: 42px;
    .top-box {
      width: 100%;
      height: 207px;
      background: #ffffff;
      border-radius: 8px;
      box-sizing: border-box;
      padding: 30px;
      .top-title {
        width: 100%;
        height: 36px;
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 24px;
        font-weight: 600;
        color: #333333;
        line-height: 36px;
        .icon {
          width: 36px;
          height: 36px;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
