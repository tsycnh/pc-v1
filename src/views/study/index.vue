<template>
  <div class="content">
    <div class="contanier">
      <div class="top-box">
        <div class="top-title">
          <img class="icon" src="../../assets/img/study/icon-mystudy.png" />
          我的学习
        </div>
        <div class="top-tabs">
          <div
            class="tab-item"
            :class="{ active: current === tab.value }"
            v-for="(tab, index) in tabs"
            :key="index"
            @click="setCurrent(tab)"
          >
            {{ tab.name }}
          </div>
        </div>
        <div class="top-status">
          <div class="item-radio" v-for="(radio, index) in status" :key="index">
            <input
              type="radio"
              name="radios"
              :value="radio.value"
              v-model="currenStatus"
            />
            <label>{{ radio.name }}</label>
          </div>
        </div>
      </div>
      <div class="list-box">
        <template v-if="list.length > 0"> </template>
        <none type="white" v-else></none>
        <div id="page">
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
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import NavFooter from "../../components/footer.vue";
import PageBox from "../../components/page.vue";
import None from "../../components/none.vue";
export default {
  components: {
    NavFooter,
    PageBox,
    None,
  },
  data() {
    return {
      loading: false,
      list: [],
      total: null,
      pagination: {
        page: 1,
        size: 10,
      },
      current: "vod",
      currenStatus: 1,
      tabs: [
        {
          name: "录播课",
          value: "vod",
        },
        {
          name: "直播课",
          value: "live",
        },
        {
          name: "图文",
          value: "topic",
        },
        {
          name: "电子书",
          value: "book",
        },
      ],
      status: [
        {
          name: "在学",
          value: 1,
        },
        {
          name: "付费",
          value: 2,
        },
        {
          name: "收藏",
          value: 3,
        },
      ],
    };
  },
  watch: {
    currenStatus() {
      this.getData();
    },
  },
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  mounted() {
    this.getData();
  },
  methods: {
    ...mapMutations(["showLoginDialog", "changeDialogType"]),
    goLogin() {
      this.changeDialogType(1);
      this.showLoginDialog();
    },
    resetData() {
      this.list = [];
      this.pagination.size = 10;
      this.pagination.page = 1;
    },
    changepage(item) {
      this.pagination.size = item.pageSize;
      this.pagination.page = item.currentPage;
      this.getData();
    },
    getData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      let params = {};
      let filter = {
        type: this.current,
        status: this.currenStatus,
      };
      Object.assign(params, filter);
      Object.assign(params, this.pagination);
      this.$api.Course.List(params).then((res) => {
        this.loading = false;
        this.list = res.data.data;
        this.total = res.data.total;
      });
    },
    setCurrent(tab) {
      this.current = tab.value;
      this.currenStatus = 1;
      this.getData();
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
      .top-tabs {
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 24px;
        .tab-item {
          width: auto;
          height: auto;
          font-size: 18px;
          font-weight: 400;
          color: #333333;
          box-sizing: border-box;
          padding-bottom: 13px;
          border-bottom: 4px solid #fff;
          margin-right: 60px;
          cursor: pointer;
          &:hover {
            font-weight: 600;
            color: #3ca7fa;
            opacity: 0.8;
          }
          &.active {
            font-weight: 600;
            color: #3ca7fa;
            border-bottom: 4px solid #3ca7fa;
          }
        }
      }
      .top-status {
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 30px;
        .item-radio {
          display: flex;
          height: 14px;
          flex-direction: row;
          align-items: center;
          margin-right: 40px;
          input {
            width: 14px;
            height: 14px;
            margin-right: 10px;
          }
          label {
            font-size: 14px;
            font-weight: 400;
            color: #666666;
            line-height: 14px;
            margin-right: 30px;
          }
        }
      }
    }
    .list-box {
      width: 100%;
      height: auto;
      background: #ffffff;
      border-radius: 8px;
      box-sizing: border-box;
      padding: 30px;
      margin-top: 30px;
      #page {
        width: 100%;
        margin: 0 auto;
        margin-top: 20px;
        display: flex;
        flex-direction: row;
        justify-content: center;
      }
    }
  }
}
</style>
