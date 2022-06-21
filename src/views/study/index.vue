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
        <template v-if="list.length > 0">
          <div class="item" v-for="item in list" :key="item.id">
            <div class="left-item">
              <thumb-bar
                v-if="current === 'book'"
                :value="item.thumb"
                :border="4"
                :width="90"
                :height="120"
              ></thumb-bar>
              <thumb-bar
                v-else
                :value="item.thumb"
                :border="4"
                :width="160"
                :height="120"
              ></thumb-bar>
              <div class="icon" v-if="!item.isBuy">已订阅</div>
            </div>
            <div class="right-item">
              <div class="item-title">{{ item.title }}</div>
              <div class="item-info">
                <template v-if="current === 'topic'">
                  <div class="item-text" v-if="!item.isBuy">
                    订阅时间：{{ item.created_at | changeTime }}
                  </div>
                </template>
                <template v-else-if="current === 'book'">
                  <div class="item-text">
                    上一次浏览时间：{{ item.created_at | changeTime }}
                  </div>
                  <div class="item-text" v-if="!item.isBuy">
                    订阅时间：{{ item.created_at | changeTime }}
                  </div>
                </template>
                <template v-else>
                  <div class="item-text">已学课时：3课时/共10课时</div>
                  <template v-if="current === 'vod'">
                    <div class="item-progress">
                      学习进度：100%
                    </div>
                  </template>
                  <template v-else>
                    <div class="item-progress">
                      已结课
                    </div>
                  </template>
                  <div class="item-text" v-if="!item.isBuy">
                    订阅时间：{{ item.created_at | changeTime }}
                  </div>
                </template>
              </div>
            </div>
            <template v-if="current === 'topic'">
              <div class="button continue" @click="goDetail(item)">
                立即查看
              </div>
            </template>
            <template v-else>
              <div class="button completed" v-if="item.progress === 100">
                学习完成
              </div>
              <div class="button continue" v-else @click="goDetail(item)">
                继续学习
              </div>
            </template>
          </div>
        </template>
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
    goDetail(item) {
      if (this.current === "vod") {
        this.$router.push({
          name: "coursesDetail",
          query: {
            id: item.id,
          },
        });
      } else if (this.current === "live") {
        this.$router.push({
          name: "liveDetail",
          query: {
            id: item.id,
          },
        });
      } else if (this.current === "topic") {
        this.$router.push({
          name: "topicDetail",
          query: {
            id: item.id,
          },
        });
      } else if (this.current === "book") {
        this.$router.push({
          name: "bookDetail",
          query: {
            id: item.id,
          },
        });
      }
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
        float: left;
        height: auto;
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-top: 20px;
      }
      .item {
        width: 100%;
        height: 120px;
        display: flex;
        flex-direction: row;
        margin-bottom: 30px;
        .left-item {
          width: 160px;
          height: 120px;
          border-radius: 4px;
          overflow: hidden;
          position: relative;
          margin-right: 30px;
          background: #f0f0f8;
          .icon {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 66px;
            height: 30px;
            background: #ff4d4f;
            border-radius: 4px 0px 4px 0px;
            font-size: 14px;
            font-weight: 400;
            color: #ffffff;
            line-height: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        .right-item {
          flex: 1;
          height: 120px;
          margin-right: 30px;
          .item-title {
            width: 816px;
            height: auto;
            font-size: 16px;
            font-weight: 600;
            color: #333333;
            line-height: 16px;
            margin-top: 30px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .item-info {
            width: 816px;
            height: auto;
            display: flex;
            flex-direction: row;
            margin-top: 35px;
            .item-text {
              font-size: 14px;
              font-weight: 400;
              color: #666666;
              line-height: 14px;
              margin-right: 30px;
            }
            .item-progress {
              font-size: 14px;
              font-weight: 400;
              color: #ff4d4f;
              line-height: 14px;
              margin-right: 30px;
            }
          }
        }
        .button {
          width: 104px;
          height: 46px;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 400;
          color: #3ca7fa;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 37px;
          &.completed {
            background: #f4fafe;
          }
          &.continue {
            border: 1px solid #3ca7fa;
            cursor: pointer;
            &:hover {
              opacity: 0.8;
            }
          }
        }
      }
    }
  }
}
</style>
