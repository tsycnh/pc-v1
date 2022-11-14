<template>
  <transition name="fade">
    <div class="mask">
      <div class="live-attach-box">
        <div class="live-attach-header">
          <span>直播附件</span>
          <img
            class="icon-close"
            @click="close()"
            src="@/assets/img/commen/icon-close.png"
          />
        </div>
        <div class="live-attach-body">
          <div class="float-left list-box" v-if="list.length > 0">
            <template v-for="(item, index) in list">
              <div class="item-comp" :key="index">
                <div class="title">
                  {{ item.name }}
                </div>
                <div class="num">
                  <span>{{ item.size }}kb</span>
                </div>
                <div class="link">
                  <a @click="download(item.course_id, item.video_id, item.id)"
                    >下载</a
                  >
                </div>
              </div>
            </template>
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
          <none type="white" v-else></none>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import config from "@/js/config";
import PageBox from "@/components/page.vue";
import None from "@/components/none.vue";
export default {
  components: {
    PageBox,
    None,
  },
  props: ["cid"],
  data() {
    return {
      vid: this.$route.query.id,
      loading: false,
      list: [],
      pagination: {
        page: 1,
        size: 10,
      },
      total: 0,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
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
      this.$api.Live.AttachList(
        this.cid,
        this.$route.query.id,
        this.pagination
      ).then((res) => {
        this.loading = false;
        this.list = res.data.data;
        this.total = res.data.total;
      });
    },
    close() {
      this.$emit("close");
    },
    download(cid, vid, id) {
      let url =
        config.url +
        `/addons/zhibo/api/v1/course/${cid}/video/${vid}/attach/${id}/download?token=` +
        this.$utils.getToken();
      window.open(url);
    },
  },
};
</script>
<style lang="less" scoped>
.mask {
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  .live-attach-box {
    width: 800px;
    max-height: 620px;
    min-height: 400px;
    background: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 30px 0px 0px 0px;
    animation: scaleBig 0.3s;

    .live-attach-header {
      width: 100%;
      height: 20px;
      display: flex;
      flex-direction: row;
      position: relative;
      box-sizing: border-box;
      padding: 0px 30px;

      .icon-close {
        width: 16.25px;
        height: 16.25px;
        position: absolute;
        right: 22px;
        top: 2px;
        cursor: pointer;

        &:hover {
          opacity: 0.8;
          animation: rotate360 1s;
        }
      }
      .span {
        width: auto;
        height: 20px;
        font-size: 18px;
        font-weight: 500;
        color: #333333;
        line-height: 20px;
      }
    }
    .live-attach-body {
      width: 100%;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding: 0px 30px;
      .list-box {
        width: 100%;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding: 15px 0px 30px 0px;
        .item-comp {
          width: 100%;
          height: 30px;
          display: flex;
          align-items: center;
          flex-direction: row;
          justify-content: space-between;
          margin-top: 15px;
          .title {
            flex: 1;
            height: 30px;
            font-size: 16px;
            font-weight: 400;
            color: #333333;
            line-height: 30px;
            text-align: left;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
          }
          .num {
            width: 150px;
            height: 30px;
            font-size: 16px;
            font-weight: 400;
            color: #333333;
            line-height: 30px;
            text-align: center;
          }
          .link {
            width: auto;
            font-size: 16px;
            font-weight: 400;
            color: #3ca7fa;
            text-decoration: underline;
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
