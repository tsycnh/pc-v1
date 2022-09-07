<template>
  <div class="content">
    <div class="box">
      <nav-member :cid="20" :news="newStatus"></nav-member>
      <div class="project-box">
        <div class="btn-title">所有证书</div>
        <div class="project-content">
          <template v-if="loading">
            <skeletonMemberOrder></skeletonMemberOrder>
          </template>
          <template v-else-if="list.length > 0">
            <div class="project-item" v-for="item in list" :key="item.id">
              <div class="item-thumb" v-if="item.cert">
                <img :src="item.cert.template_image" />
              </div>
              <div class="item-info">
                <div class="item-top">
                  <div class="item-name" v-if="item.cert">
                    {{ item.cert.name }}
                  </div>
                  <div class="item-time">
                    {{ item.created_at | changeTime }}
                  </div>
                </div>
                <div class="item-bottom">
                  <div class="item-price" @click="download(item)">下载证书</div>
                </div>
              </div>
            </div>
          </template>
          <none type="white" v-else></none>
        </div>
        <div id="page" v-show="list.length > 0">
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
import config from "@/js/config";
import NavFooter from "@/components/footer.vue";
import NavMember from "@/components/navmember.vue";
import PageBox from "@/components/page.vue";
import None from "@/components/none.vue";
import SkeletonMemberOrder from "@/components/skeleton/skeletonMemberOrder.vue";
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
        size: 10,
      },
      loading: false,
    };
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
      this.$api.Member.CertList(this.pagination).then((res) => {
        this.loading = false;
        this.list = res.data.data;
        this.total = res.data.total;
      });
    },
    download(item) {
      let token = this.$utils.getToken();
      window.open(
        `${config.url}/addons/Cert/api/v1/member/cert/${item.cert.id}/download?token=${token}`
      );
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

          .item-thumb {
            width: 133px;
            height: 100px;
            background: #f4fafe;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            overflow: hidden;
            margin-right: 30px;
            position: relative;
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
              margin-top: 15px;
              .item-name {
                height: 14px;
                font-size: 14px;
                font-weight: 600;
                color: #333333;
                line-height: 14px;
              }

              .item-time {
                height: 12px;
                font-size: 12px;
                font-weight: 400;
                color: #666666;
                line-height: 12px;
                margin-left: auto;
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
                color: #3ca7fa;
                line-height: 14px;
                cursor: pointer;
                &:hover {
                  opacity: 0.8;
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
