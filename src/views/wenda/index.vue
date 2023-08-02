<template>
  <div class="content page-main-body-box">
    <filter-box
      v-show="!navLoading"
      :categories1="scenes"
      :categories2="categories"
      :cid1="pagination.scene"
      :cid2="pagination.cid"
      @change="filterChange"
    ></filter-box>
    <CreateQuestion
      v-if="createQestion"
      @cancel="closeQuestion"
      @success="createSuccess"
      :status="true"
      :enable="enableCredit1"
    ></CreateQuestion>

    <template v-if="navLoading">
      <skeletonNav></skeletonNav>
      <skeletonNav2></skeletonNav2>
    </template>
    <div class="contanier">
      <div class="qa-box">
        <template v-if="loading">
          <div style="margin-top: 10px">
            <skeletonWendaList></skeletonWendaList>
          </div>
        </template>
        <template v-else-if="list.length > 0">
          <div class="qa-item" v-for="item in list" :key="item.id">
            <qa-item
              :cid="item.id"
              :title="item.title"
              :answer-count="item.answer_count"
              :view-times="item.view_times"
              :vote-count="item.vote_count"
              :status-text="item.status_text"
              :status="item.status"
              :credit1="item.credit1"
            ></qa-item>
          </div>
        </template>
        <none v-else></none>
        <div id="page" v-show="list.length > 0 && total > pagination.size">
          <page-box
            :key="pagination.page"
            :page="pagination.page"
            :totals="total"
            @current-change="changepage"
            :pageSize="pagination.size"
            :tab="false"
          ></page-box>
        </div>
      </div>

      <div class="right-contanier">
        <div class="contanier">
          <div class="create-button" @click="goCreatePage">我要提问</div>
          <div
            v-if="pc_diy_content && pc_diy_content !== ''"
            class="wenda-tips"
            v-html="pc_diy_content"
          ></div>
        </div>
      </div>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import None from "../../components/none.vue";
import FilterBox from "../../components/filter-box.vue";
import QaItem from "../../components/qa-item.vue";
import NavFooter from "../../components/footer.vue";
import PageBox from "../../components/page.vue";
import CreateQuestion from "../../components/create-question.vue";
import SkeletonWendaList from "../../components/skeleton/skeletonWendaList.vue";
import SkeletonNav from "../../components/skeleton/skeletonNav.vue";
import SkeletonNav2 from "../../components/skeleton/skeletonNav2.vue";
export default {
  components: {
    FilterBox,
    NavFooter,
    None,
    PageBox,
    QaItem,
    CreateQuestion,
    SkeletonWendaList,
    SkeletonNav,
    SkeletonNav2,
  },
  data() {
    return {
      pageName: "wenda-list",
      list: [],
      total: null,
      createQestion: false,
      pagination: {
        page: 1,
        size: 10,
        scene: "default",
        cid: 0,
      },
      scenes: [
        {
          id: "default",
          name: "综合",
        },
        {
          id: "solved",
          name: "已解决",
        },
        {
          id: "unsolved",
          name: "未解决",
        },
        {
          id: "last_answer",
          name: "最新回答",
        },
      ],
      categories: [],
      filterShowStatus: false,
      loading: false,
      navLoading: false,
      pc_diy_content: null,
      enableCredit1: false,
    };
  },
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  mounted() {
    this.navLoading = true;
    this.getData();
    this.getConfig();
  },
  activated() {
    this.changefilter();
    this.$utils.scrollTopSet(this.pageName);
  },
  beforeRouteLeave(to, from, next) {
    this.$utils.scrollTopRecord(this.pageName);
    next();
  },
  methods: {
    ...mapMutations([
      "showLoginDialog",
      "changeDialogType",
      "changeUserCredit",
    ]),
    changefilter() {
      let cid = this.pagination.cid;
      let scene = this.pagination.scene;
      if (cid === 0) {
        this.$router.push({
          path: this.$route.path,
          query: {
            scene: scene,
          },
        });
      } else {
        this.$router.push({
          path: this.$route.path,
          query: {
            scene: scene,
            category_id: cid,
          },
        });
      }
    },
    goLogin() {
      this.changeDialogType(1);
      this.showLoginDialog();
    },
    filterChange(scene, cid) {
      this.pagination.scene = scene;
      if (cid === 0) {
        this.$router.push({
          path: this.$route.path,
          query: {
            scene: scene,
          },
        });
      } else {
        this.$router.push({
          path: this.$route.path,
          query: {
            scene: scene,
            category_id: cid,
          },
        });
      }
      this.resetData();
      this.getData();
    },
    resetData() {
      this.list = [];
      this.pagination.page = 1;
    },
    changepage(item) {
      this.pagination.size = item.pageSize;
      this.pagination.page = item.currentPage;
      this.getData();
      window.scrollTo(0, 0);
    },
    createSuccess(id, credit1) {
      this.createQestion = false;
      let credit = parseInt(this.user.credit1) - parseInt(credit1);
      this.changeUserCredit(credit);
      setTimeout(() => {
        this.$router.push({
          name: "wendaDetail",
          query: {
            id: id,
          },
        });
      }, 600);
    },
    getData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.pagination.scene = this.$route.query.scene || "default";
      this.pagination.cid = this.$route.query.category_id || 0;
      this.$api.Wenda.List(this.pagination).then((res) => {
        this.loading = false;
        this.navLoading = false;
        if (this.categories.length === 0) {
          this.categories = res.data.categories;
        }
        this.list = res.data.data.data;
        this.total = res.data.data.total;
      });
    },
    getConfig() {
      this.$api.Wenda.Config().then((res) => {
        this.pc_diy_content = res.data.pc_diy_content;
        if (res.data.enable_credit1 === 1) {
          this.enableCredit1 = true;
        } else {
          this.enableCredit1 = false;
        }
      });
    },
    goCreatePage() {
      if (!this.isLogin) {
        this.goLogin();
      } else {
        this.createQestion = true;
      }
    },
    closeQuestion() {
      this.createQestion = false;
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  width: 100%;
  .contanier {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;
    display: block;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    .qa-box {
      width: 769px;
      display: flex;
      flex-direction: column;
      margin-right: 30px;
      #page {
        width: 769px;
        margin: 0 auto;
        margin-top: 50px;
        display: flex;
        flex-direction: row;
        justify-content: center;
      }
    }
    .right-contanier {
      width: 400px;
      height: auto;
      float: left;
      box-sizing: border-box;
      .contanier {
        width: 400px;
        height: auto;
        background: #ffffff;
        border-radius: 8px;
        padding: 30px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        .create-button {
          width: 100%;
          height: 56px;
          background: #3ca7fa;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 400;
          color: #ffffff;
          &:hover {
            opacity: 0.8;
          }
        }
        .wenda-tips {
          margin-top: 30px;
        }
      }
    }
  }
}
</style>
