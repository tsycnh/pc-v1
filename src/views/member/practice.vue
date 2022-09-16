<template>
  <div class="content">
    <div class="box">
      <nav-member :cid="10"></nav-member>
      <div class="project-box">
        <div class="tabs">
          <div
            class="item-tab"
            v-for="(item, index) in tabs"
            :key="index"
            :class="{ active: currentTab === item.id }"
            @click="tabChange(item.id)"
            :is-scroll="false"
          >
            {{ item.name }}
            <div class="actline" v-if="currentTab === item.id"></div>
          </div>
        </div>
        <template v-if="loading">
          <skeletonMemberPaper></skeletonMemberPaper>
        </template>
        <template v-if="!loading && currentTab === 1">
          <template v-if="list.length > 0">
            <div
              class="paper-item-comp"
              v-for="(item, index) in list"
              :key="index"
              @click="goDetail(item.pid)"
            >
              <div class="title">
                <img class="icon" src="@/assets/img/member/practice.png" />
                <div class="name">{{ item.practice.name }}</div>
              </div>
              <div class="info">
                <span style="color: #F4A429;"
                  >已练习 {{ item.submit_count }}/{{
                    item.practice_question_count
                  }}</span
                >
              </div>
            </div>
          </template>
          <none type="white" v-else></none>
        </template>
        <template v-if="!loading && currentTab === 2">
          <template v-if="collects.length > 0">
            <div
              class="paper-item-comp"
              v-for="(item, index) in collects"
              :key="index"
              @click="goCollect(item.question.id)"
            >
              <div class="title">
                <img
                  class="icon"
                  src="@/assets/img/member/practice-collects.png"
                />
                <div class="name">{{ item.question.content }}</div>
              </div>
              <div class="info">
                <span @click.stop="cancelCollect(item.question.id)"
                  >取消收藏</span
                >
              </div>
            </div>
          </template>
          <none type="white" v-else></none>
        </template>
        <div id="page" v-show="currentTab === 1 && list.length > 0">
          <page-box
            :key="pagination.page"
            :page="pagination.page"
            :totals="total1"
            @current-change="changepage"
            :pageSize="pagination.size"
            :tab="false"
          ></page-box>
        </div>
        <div id="page" v-show="currentTab === 2 && collects.length > 0">
          <page-box
            :key="pagination.page"
            :page="pagination.page"
            :totals="total2"
            @current-change="changepage"
            :pageSize="pagination.size"
            :tab="false"
          ></page-box>
        </div>
      </div>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import NavFooter from "../../components/footer.vue";
import NavMember from "../../components/navmember.vue";
import PageBox from "../../components/page.vue";
import None from "../../components/none.vue";
import SkeletonMemberPaper from "../../components/skeleton/skeletonMemberPaper.vue";

export default {
  components: {
    NavFooter,
    NavMember,
    PageBox,
    None,
    SkeletonMemberPaper,
  },
  data() {
    return {
      list: [],
      collects: [],
      total1: null,
      total2: null,
      pagination: {
        page: 1,
        size: 10,
      },
      currentTab: 1,
      loading: false,
      tabs: [
        {
          name: "我的练习",
          id: 1,
        },
        {
          name: "收藏习题",
          id: 2,
        },
      ],
    };
  },
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  mounted() {
    this.getData();
    this.getCollects();
  },
  methods: {
    ...mapMutations(["showLoginDialog", "changeDialogType"]),
    resetData() {
      this.list = [];
      this.total = null;
      this.pagination.size = 10;
      this.pagination.page = 1;
    },
    tabChange(key) {
      this.currentTab = key;
      if (this.currentTab === 1) {
        this.getData();
      }
      if (this.currentTab === 2) {
        this.getCollects();
      }
    },
    changepage(item) {
      this.pagination.size = item.pageSize;
      this.pagination.page = item.currentPage;
      if (this.currentTab === 1) {
        this.getData();
      }
      if (this.currentTab === 2) {
        this.getCollects();
      }
    },
    goDetail(id) {
      this.$router.push({
        name: "ExamPracticeDetail",
        query: {
          id: id,
        },
      });
    },
    goCollect(id) {
      this.$router.push({
        name: "ExamCollectionPlay",
        query: {
          id: id,
        },
      });
    },
    getData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Member.UserPractice(this.pagination).then((res) => {
        this.loading = false;
        this.list = res.data.data;
        this.total1 = res.data.total;
      });
    },
    getCollects() {
      //新接口
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Exam.Collection.Detail(this.pagination).then((res) => {
        this.loading = false;
        this.collects = res.data.data;
        this.total2 = res.data.total;
      });
    },
    cancelCollect(id) {
      this.$api.Exam.Practice.Collect({ question_id: id }).then(() => {
        this.$message.success("已取消收藏");
        this.getCollects();
      });
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  width: 100%;
  .box {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    margin-top: 30px;
    .project-box {
      margin-left: 30px;
      width: 999px;
      height: auto;
      background: #ffffff;
      border-radius: 8px;
      box-sizing: border-box;
      padding: 30px;
      .tabs {
        width: 100%;
        height: 34px;
        position: relative;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        padding: 0px;
        margin-bottom: 30px;
        .item-tab {
          width: 56px;
          height: 14px;
          font-size: 14px;
          font-weight: 400;
          color: #666666;
          line-height: 14px;
          margin-right: 50px;
          cursor: pointer;
          position: relative;
          text-align: center;
          &.active {
            font-weight: 600;
            color: #3ca7fa;
          }
          .actline {
            width: 56px;
            height: 4px;
            background: #3ca7fa;
            position: absolute;
            left: 0px;
            top: 29px;
          }
        }
      }
      .paper-item-comp {
        width: 100%;
        height: 30px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;

        .title {
          width: 700px;
          height: 30px;
          display: flex;
          flex-direction: row;
          align-items: center;
          overflow: hidden;
          .icon {
            width: 30px;
            height: 30px;
            margin-right: 30px;
          }
          .name {
            width: 640px;
            height: 14px;
            font-size: 14px;
            font-weight: 500;
            color: #333333;
            line-height: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .info {
          height: 14px;
          font-size: 14px;
          font-weight: 400;
          color: #666666;
          line-height: 14px;
          .item {
            height: 14px;
            margin-left: 10px;
            margin-right: 10px;
          }
        }
        &:hover {
          opacity: 0.8;
        }
        &:not(:last-of-type) {
          margin-bottom: 40px;
        }
      }
      #page {
        width: 100%;
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
