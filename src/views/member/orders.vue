<template>
  <div class="content">
    <div class="box">
      <nav-member :cid="6" :news="newStatus"></nav-member>
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
        <div class="project-content">
          <template v-if="loading">
            <skeletonMemberOrder></skeletonMemberOrder>
          </template>
          <template v-else-if="list.length > 0">
            <template v-if="currentTab === 1">
              <div
                class="project-item"
                v-for="item in list"
                :key="item.id"
                @click="goDetail(item)"
              >
                <div
                  class="item-thumb"
                  v-if="item.goods[0] && item.goods[0].goods_thumb"
                >
                  <img
                    v-if="
                      item.goods[0].goods_type === '模拟试卷' ||
                        item.goods[0].goods_type === '试卷' ||
                        item.goods[0].goods_type === '练习'
                    "
                    src="../../assets/img/commen/default-paper.png"
                  />
                  <thumb-bar
                    v-else-if="item.goods[0].goods_type === 'BOOK'"
                    :value="item.goods[0].goods_thumb"
                    :border="8"
                    :width="75"
                    :height="100"
                  ></thumb-bar>
                  <thumb-bar
                    v-else
                    :value="item.goods[0].goods_thumb"
                    :width="133"
                    :height="100"
                  ></thumb-bar>
                </div>
                <div
                  class="item-thumb"
                  v-else-if="item.goods[0].goods_type === 'ROLE'"
                >
                  <img src="../../assets/img/commen/default-vip.png" />
                </div>
                <div
                  class="item-thumb"
                  v-else-if="item.goods[0].goods_type === '文章'"
                >
                  <img src="../../assets/img/commen/default-article.png" />
                </div>
                <div
                  class="item-thumb"
                  v-else-if="item.goods[0].goods_type === 'COURSE'"
                >
                  <img src="../../assets/img/commen/default-lesson.png" />
                </div>
                <div
                  class="item-thumb"
                  v-else-if="
                    item.goods[0].goods_type === '模拟试卷' ||
                      item.goods[0].goods_type === '试卷' ||
                      item.goods[0].goods_type === '练习'
                  "
                >
                  <img src="../../assets/img/commen/default-paper.png" />
                </div>
                <div
                  class="item-thumb"
                  v-else-if="item.goods[0].goods_type === 'VIDEO'"
                >
                  <img src="../../assets/img/commen/default-video.png" />
                </div>
                <div
                  class="item-thumb"
                  v-else-if="item.goods[0].goods_type === '学习路径'"
                >
                  <img src="../../assets/img/commen/default-steps.png" />
                </div>
                <div
                  class="item-thumb"
                  v-else-if="item.goods[0].goods_type === '直播课程'"
                >
                  <img src="../../assets/img/commen/default-live.png" />
                </div>
                <div
                  class="item-thumb"
                  v-else-if="item.goods[0].goods_type === 'BOOK'"
                >
                  <img src="../../assets/img/commen/default-ebook.png" />
                </div>
                <div class="item-info">
                  <div class="item-top">
                    <div class="item-name" v-if="item.goods[0]">
                      {{ item.goods[0].goods_name }}
                    </div>
                    <div class="order-num">订单编号：{{ item.order_id }}</div>
                    <div class="item-time">
                      {{ item.created_at | changeTime }}
                    </div>
                  </div>
                  <div class="item-bottom">
                    <div
                      class="item-price"
                      v-if="
                        item.status_text === '未支付' ||
                          item.status_text === '支付中'
                      "
                    >
                      实付款：￥{{ item.charge }}
                    </div>
                    <div
                      class="item-status"
                      :class="{
                        act:
                          item.status_text === '未支付' ||
                          item.status_text === '支付中',
                      }"
                    >
                      {{ item.status_text }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else-if="currentTab === 2" v-for="item in list">
              <div
                class="project-item"
                :key="item.id"
                v-if="item.goods && item.goods.goods_type"
                @click="goTgDetail(item)"
              >
                <div
                  class="item-thumb"
                  v-if="item.goods && item.goods.goods_thumb"
                >
                  <thumb-bar
                    v-if="item.goods.goods_type === 'book'"
                    :value="item.goods.goods_thumb"
                    :border="8"
                    :width="75"
                    :height="100"
                  ></thumb-bar>
                  <thumb-bar
                    v-else
                    :value="item.goods.goods_thumb"
                    :width="133"
                    :height="100"
                  ></thumb-bar>
                </div>
                <div class="item-info">
                  <div class="item-top">
                    <div class="item-name">
                      {{ item.goods.goods_title }}
                    </div>
                    <div class="order-num">
                      类型：{{ item.goods.goods_type_text }}
                    </div>
                    <div class="item-time">
                      {{ item.updated_at | changeTime }}
                    </div>
                  </div>
                  <div class="item-bottom">
                    <div class="item-price">实付款：￥{{ item.charge }}</div>
                    <div
                      class="item-status act"
                      @click.stop="goTgOrder(item)"
                      v-if="item.status === 0"
                    >
                      未支付，点击立即支付
                    </div>
                    <div class="item-status" v-else-if="item.status === 1">
                      已支付
                    </div>
                    <div class="item-status" v-else-if="item.status === 3">
                      已取消
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else-if="currentTab === 3" v-for="item in list">
              <div
                class="project-item"
                :key="item.id"
                v-if="item.goods && item.goods.goods_type"
                @click="goMsDetail(item)"
              >
                <div
                  class="item-thumb"
                  v-if="item.goods && item.goods.goods_thumb"
                >
                  <thumb-bar
                    v-if="item.goods.goods_type === 'book'"
                    :value="item.goods.goods_thumb"
                    :border="8"
                    :width="75"
                    :height="100"
                  ></thumb-bar>
                  <thumb-bar
                    v-else
                    :value="item.goods.goods_thumb"
                    :width="133"
                    :height="100"
                  ></thumb-bar>
                </div>

                <div class="item-info">
                  <div class="item-top">
                    <div class="item-name">
                      {{ item.goods.goods_title }}
                    </div>
                    <div class="order-num">
                      类型：{{ item.goods.goods_type_text }}
                    </div>
                    <div class="item-time">
                      {{ item.created_at | changeTime }}
                    </div>
                  </div>
                  <div class="item-bottom">
                    <div class="item-price">实付款：￥{{ item.charge }}</div>
                    <div
                      class="item-status act"
                      @click.stop="goMsOrder(item)"
                      v-if="item.status === 0"
                    >
                      未支付，点击立即支付
                    </div>
                    <div class="item-status" v-else-if="item.status === 1">
                      已支付
                    </div>
                    <div class="item-status" v-else-if="item.status === 3">
                      已取消
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </template>
          <none type="white" v-else></none>
        </div>
        <div id="page" v-show="currentTab === 1 && list.length > 0">
          <page-box
            :key="pagination.page"
            :page="pagination.page"
            :totals="total"
            @current-change="changepage"
            :pageSize="pagination.page_size"
            :tab="false"
          ></page-box>
        </div>
        <div
          id="page"
          v-show="(currentTab === 2 || currentTab === 3) && list.length > 0"
        >
          <page-box
            :key="other_pagination.page"
            :page="other_pagination.page"
            :totals="total"
            @current-change="changepage"
            :pageSize="other_pagination.size"
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
import SkeletonMemberOrder from "../../components/skeleton/skeletonMemberOrder.vue";

export default {
  components: {
    NavFooter,
    NavMember,
    PageBox,
    None,
    SkeletonMemberOrder,
  },
  data() {
    return {
      newStatus: false,
      list: [],
      total: null,
      pagination: {
        page: 1,
        page_size: 10,
      },
      other_pagination: {
        page: 1,
        size: 10,
      },
      loading: false,
      currentTab: 1,
    };
  },
  computed: {
    ...mapState(["isLogin", "user", "configFunc"]),
    tabs() {
      let data = [
        {
          name: "所有订单",
          id: 1,
        },
      ];
      if (this.configFunc["tuangou"]) {
        data.push({
          name: "团购订单",
          id: 2,
        });
      }
      if (this.configFunc["miaosha"]) {
        data.push({
          name: "秒杀订单",
          id: 3,
        });
      }
      return data;
    },
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
      this.pagination.page_size = 10;
      this.pagination.page = 1;
      this.other_pagination.size = 10;
      this.other_pagination.page = 1;
    },
    tabChange(key) {
      this.currentTab = key;
      this.resetData();
      if (this.currentTab === 1) {
        this.getData();
      }
      if (this.currentTab === 2) {
        this.getTgData();
      }
      if (this.currentTab === 3) {
        this.getMsData();
      }
    },
    changepage(item) {
      this.pagination.page_size = item.pageSize;
      this.pagination.page = item.currentPage;
      this.other_pagination.size = item.pageSize;
      this.other_pagination.page = item.currentPage;
      if (this.currentTab === 1) {
        this.getData();
      }
      if (this.currentTab === 2) {
        this.getTgData();
      }
      if (this.currentTab === 3) {
        this.getMsData();
      }
    },
    getTgData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Member.Tuangou(this.other_pagination).then((res) => {
        this.loading = false;
        this.list = res.data.data;
        this.total = res.data.total;
      });
    },
    getMsData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Member.Miaosha(this.other_pagination).then((res) => {
        this.loading = false;
        this.list = res.data.data;
        this.total = res.data.total;
      });
    },
    getData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Member.Orders(this.pagination).then((res) => {
        this.loading = false;
        this.list = res.data.data;
        this.total = res.data.total;
      });
    },
    goMsDetail(item) {
      if (item.goods.goods_type === "book") {
        this.$router.push({
          name: "bookDetail",
          query: {
            id: item.goods.goods_id,
          },
        });
      } else if (item.goods.goods_type === "course") {
        this.$router.push({
          name: "coursesDetail",
          query: {
            id: item.goods.goods_id,
          },
        });
      } else if (item.goods.goods_type === "live") {
        this.$router.push({
          name: "liveDetail",
          query: {
            id: item.goods.goods_id,
          },
        });
      } else if (item.goods.goods_type === "learnPath") {
        this.$router.push({
          name: "learnPathDetail",
          query: {
            id: item.goods.goods_id,
          },
        });
      }
    },
    goMsOrder(item) {
      this.$router.push({
        name: "order",
        query: {
          course_id: item.goods.goods_id,
          course_type: item.goods.goods_type,
          goods_type: "ms",
          goods_charge: item.charge,
          goods_label: "秒杀",
          goods_name: item.goods.goods_title,
          goods_id: item.id,
          goods_thumb: item.goods.goods_thumb,
        },
      });
    },
    goTgOrder(item) {
      this.$router.push({
        name: "order",
        query: {
          course_id: item.goods.other_id,
          course_type: item.goods.goods_type,
          tg_gid: item.item_id,
          goods_type: "tg",
          goods_charge: item.charge,
          goods_label: "团购",
          goods_name: item.goods.goods_title,
          goods_id: item.id,
          goods_thumb: item.goods.goods_thumb,
        },
      });
    },
    goTgDetail(item) {
      if (item.goods.goods_type === "book") {
        this.$router.push({
          name: "bookDetail",
          query: {
            id: item.goods.other_id,
          },
        });
      } else if (item.goods.goods_type === "course") {
        this.$router.push({
          name: "coursesDetail",
          query: {
            id: item.goods.other_id,
          },
        });
      } else if (item.goods.goods_type === "live") {
        this.$router.push({
          name: "liveDetail",
          query: {
            id: item.goods.other_id,
          },
        });
      } else if (item.goods.goods_type === "learnPath") {
        this.$router.push({
          name: "learnPathDetail",
          query: {
            id: item.goods.other_id,
          },
        });
      }
    },
    goDetail(item) {
      if (item.goods[0].goods_type === "ROLE") {
        this.$router.push({
          name: "vip",
        });
      } else if (item.goods[0].goods_type === "BOOK") {
        this.$router.push({
          name: "bookDetail",
          query: {
            id: item.goods[0].goods_id,
          },
        });
      } else if (item.goods[0].goods_type === "COURSE") {
        this.$router.push({
          name: "coursesDetail",
          query: {
            id: item.goods[0].goods_id,
          },
        });
      } else if (item.goods[0].goods_type === "直播课程") {
        this.$router.push({
          name: "liveDetail",
          query: {
            id: item.goods[0].goods_id,
          },
        });
      } else if (item.goods[0].goods_type === "文章") {
        this.$router.push({
          name: "topicDetail",
          query: {
            id: item.goods[0].goods_id,
          },
        });
      } else if (item.goods[0].goods_type === "VIDEO") {
        this.$router.push({
          name: "coursesVideo",
          query: {
            id: item.goods[0].goods_id,
          },
        });
      } else if (item.goods[0].goods_type === "学习路径") {
        this.$router.push({
          name: "learnPathDetail",
          query: {
            id: item.goods[0].goods_id,
          },
        });
      } else if (item.goods[0].goods_type === "试卷") {
        this.$router.push({
          name: "ExamPapersDetail",
          query: {
            id: item.goods[0].goods_id,
          },
        });
      } else if (item.goods[0].goods_type === "练习") {
        this.$router.push({
          name: "ExamPracticeDetail",
          query: {
            id: item.goods[0].goods_id,
          },
        });
      } else if (item.goods[0].goods_type === "模拟试卷") {
        this.$router.push({
          name: "ExamMockpaperDetail",
          query: {
            id: item.goods[0].goods_id,
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
        margin-bottom: 30px;
      }
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
      .project-content {
        width: 100%;
        display: flex;
        flex-direction: column;
        .project-item {
          width: 100%;
          height: 100px;
          background: #ffffff;
          margin-bottom: 20px;
          display: flex;
          flex-direction: row;
          cursor: pointer;
          &:hover {
            opacity: 0.9;
          }

          .item-thumb {
            width: 133px;
            height: 100px;
            background: #f0f0f8;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            overflow: hidden;
            margin-right: 30px;
            position: relative;
            .spback {
              position: absolute;
              left: 20px;
              top: 10px;
              width: 93px;
              height: 80px;
              background: #d2e1ef;
              border-radius: 8px;
            }
            img {
              z-index: 10;
              height: 100px;
            }
          }
          .item-info {
            width: 776px;
            height: 100px;
            display: flex;
            flex-direction: column;
            position: relative;
            .item-top {
              width: 100%;
              height: 22px;
              display: flex;
              flex-direction: row;
              align-items: center;
              margin-top: 16px;
              .item-type {
                padding: 5px 10px;
                background: #04c877;
                border-radius: 2px;
                font-size: 12px;
                font-weight: 400;
                color: #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 10px;
              }
              .item-name {
                height: 14px;
                font-size: 14px;
                font-weight: 600;
                color: #333333;
                line-height: 14px;
              }
              .order-num {
                height: 12px;
                font-size: 12px;
                font-weight: 400;
                color: #666666;
                line-height: 12px;
                margin-right: 30px;
                margin-left: auto;
              }
              .item-time {
                height: 12px;
                font-size: 12px;
                font-weight: 400;
                color: #666666;
                line-height: 12px;
              }
            }
            .item-bottom {
              width: 100%;
              height: 14px;
              display: flex;
              flex-direction: row;
              align-items: center;
              margin-top: 30px;
              .item-price {
                height: 14px;
                font-size: 14px;
                font-weight: 400;
                color: #666666;
                line-height: 14px;
              }
              .item-status {
                height: 14px;
                font-size: 14px;
                font-weight: 400;
                color: #666666;
                line-height: 14px;
                margin-left: auto;
                &.act {
                  color: #ff5068;
                }
              }
            }
          }
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
