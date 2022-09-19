<template>
  <div class="content">
    <div class="box">
      <nav-member :cid="9" :news="newStatus"></nav-member>
      <div class="project-box">
        <div class="btn-title">我的考试</div>
        <template v-if="loading">
          <skeletonMemberPaper></skeletonMemberPaper>
        </template>
        <template v-else-if="list.length > 0">
          <div
            class="paper-item-comp"
            v-for="(item, index) in list"
            :key="index"
            @click="goDetail(item.paper_id)"
          >
            <div class="title">
              <img class="icon" src="@/assets/img/member/test.png" />
              <div class="name">{{ item.paper.title }}</div>
            </div>
            <div class="info">
              <span style="color: #3CA7FA;">最高分：{{ item.max_score }}</span>
              <span class="item">|</span>
              <span>{{ item.paper.score }}分</span>
            </div>
          </div>
          <div id="page">
            <page-box
              :key="pagination.page"
              :over="over"
              :page="pagination.page"
              @current-change="changepage"
            ></page-box>
          </div>
        </template>
        <none type="white" v-else></none>
      </div>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import NavFooter from "../../components/footer.vue";
import NavMember from "../../components/navmember.vue";
import PageBox from "../../components/new-page.vue";
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
      loading: false,
      newStatus: false,
      list: [],
      pagination: {
        page: 1,
        size: 10,
      },
      over: false,
    };
  },
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  mounted() {
    this.getData();
  },
  methods: {
    ...mapMutations(["showLoginDialog", "changeDialogType"]),
    resetData() {
      this.list = [];
      this.pagination.size = 10;
      this.pagination.page = 1;
    },
    changepage(item) {
      this.pagination.page = item.currentPage;
      this.getData();
    },
    goDetail(id) {
      this.$router.push({
        name: "ExamPapersDetail",
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
      this.$api.Member.UserPaper(this.pagination).then((res) => {
        if (res.data.data.length === 0) {
          this.$message.error("没有更多了");
          this.pagination.page--;
          this.over = true;
        } else {
          this.list = res.data.data;
          if (res.data.data.length < this.pagination.size) {
            this.over = true;
          } else {
            this.over = false;
          }
        }
        this.loading = false;
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
      .btn-title {
        width: auto;
        height: 16px;
        font-size: 16px;
        font-weight: 600;
        color: #333;
        line-height: 16px;
        cursor: pointer;
        margin-bottom: 50px;
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
