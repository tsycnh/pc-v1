<template>
  <div class="paper-item-comp">
    <div
      class="status"
      :class="{
        paper: type === 'paper',
        mock: type === 'mock',
      }"
      v-if="records[cid]"
    >
      已参考
    </div>
    <div class="title">
      <img
        class="icon"
        v-if="type === 'paper'"
        src="@/assets/img/member/test.png"
      />
      <img
        class="icon"
        v-if="type === 'mock'"
        src="@/assets/img/member/mock.png"
      />
      <div class="name">{{ title }}</div>
    </div>
    <div
      class="button"
      :class="{
        paper: type === 'paper',
        mock: type === 'mock',
      }"
      @click="goDetail"
    >
      <img
        class="icon"
        v-if="type === 'paper' && !isFree"
        src="@/assets/img/exam/paper-lock.png"
      />
      <img
        class="icon"
        v-if="type === 'mock' && !isFree"
        src="@/assets/img/exam/mock-lock.png"
      />
      <span>立即考试</span>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  props: [
    "type",
    "cid",
    "records",
    "questionsCount",
    "title",
    "thumb",
    "score",
    "expiredMinutes",
    "tryTimes",
    "isVipFree",
    "charge",
    "isFree",
    "requiredCourses",
    "enabledInvite",
    "passScore",
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
      if (this.type === "paper") {
        this.$router.push({
          name: "ExamPapersDetail",
          query: {
            id: this.cid,
          },
        });
      }
      if (this.type === "mock") {
        this.$router.push({
          name: "ExamMockpaperDetail",
          query: {
            id: this.cid,
          },
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.paper-item-comp {
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
    &.paper {
      background: rgba(#3ca7fa, 0.15);
      color: #3ca7fa;
    }
    &.mock {
      background: rgba(#00bba7, 0.15);
      color: #00bba7;
    }
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
    &:hover {
      opacity: 0.8;
    }
    &.paper {
      color: #3ca7fa;
      border: 1px solid #3ca7fa;
    }
    &.mock {
      color: #00bba7;
      border: 1px solid #00bba7;
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
