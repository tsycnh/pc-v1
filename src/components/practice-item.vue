<template>
  <div class="practice-item-comp">
    <template v-if="userCount !== 0">
      <div class="status" v-if="userCount === questionCount">
        已练习
      </div>
      <div class="status" v-else>练习中</div>
    </template>
    <div class="title">
      <img class="icon" src="@/assets/img/member/practice.png" />
      <div class="name">{{ title }}</div>
    </div>
    <div class="button" @click="goDetail">
      <img
        class="icon"
        v-if="!isFree"
        src="@/assets/img/exam/practice-lock.png"
      />
      <span>立即练习</span>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  props: [
    "cid",
    "title",
    "records",
    "questionCount",
    "userCount",
    "isFree",
    "isVipFree",
    "charge",
    "thumb",
    "category",
  ],
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  methods: {
    ...mapMutations(["showLoginDialog", "changeDialogType"]),
    goLogin() {
      this.changeDialogType(1);
      this.showLoginDialog();
    },
    goDetail() {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      this.$router.push({
        name: "ExamPracticeDetail",
        query: {
          id: this.cid,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.practice-item-comp {
  width: 100%;
  height: 116px;
  background: #ffffff;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  padding-left: 30px;
  padding-right: 50px;
  margin-bottom: 10px;
  &:hover {
    box-shadow: 0px 4px 8px 0px rgba(102, 102, 102, 0.1);
  }
  .status {
    width: 62px;
    height: 30px;
    border-radius: 8px 0px 8px 0px;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 400;
    background: rgba(#f4a429, 0.15);
    color: #f4a429;
  }

  .title {
    flex: 1;
    height: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
    .icon {
      width: 30px;
      height: 30px;
      margin-right: 20px;
    }
    .name {
      flex: 1;
      height: 16px;
      font-size: 16px;
      font-weight: 500;
      color: #333333;
      line-height: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .button {
    width: 102px;
    height: 44px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: Center;
    font-size: 14px;
    font-weight: 400;
    color: #f4a429;
    border: 1px solid #f4a429;
    margin-left: 20px;
    &:hover {
      opacity: 0.8;
    }

    .icon {
      width: 16px;
      height: 16px;
      margin-right: 6px;
    }
  }
  .info {
    height: 30px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
    line-height: 30px;

    .item {
      height: 14px;
      margin-left: 15px;
      margin-right: 15px;
    }
  }
}
</style>
