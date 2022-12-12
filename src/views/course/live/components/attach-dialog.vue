<template>
  <div class="live-attach-box">
    <div class="float-left reload">
      <a @click="resetData()">点击刷新课件列表</a>
    </div>
    <div class="float-left list-box" v-if="list.length > 0">
      <template v-for="(item, index) in list">
        <div class="item-comp" :key="index">
          <div class="title">
            {{ item.name }}
          </div>
          <div class="link">
            <a @click="download(item.course_id, item.video_id, item.id)"
              >下载</a
            >
          </div>
        </div>
      </template>
    </div>
    <none type="white" v-else></none>
  </div>
</template>
<script>
import config from "@/js/config";
import None from "@/components/none.vue";
export default {
  components: {
    None,
  },
  props: ["cid", "status"],
  data() {
    return {
      vid: this.$route.query.id,
      loading: false,
      list: [],
      pagination: {
        page: 1,
        size: 100000,
      },
      total: 0,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    resetData() {
      this.$emit("reset");
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
.live-attach-box {
  width: 100%;
  height: 565px;
  float: left;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  .reload {
    width: 189px;
    height: 26px;
    background: #e1f1fd;
    border-radius: 15px;
    margin: 0 auto;
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    span {
      font-size: 12px;
      font-weight: 400;
      color: #999999;
      line-height: 12px;
    }
    a {
      font-size: 12px;
      font-weight: 400;
      color: #3ca7fa;
      line-height: 12px;
      margin-left: 15px;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
    }
  }
  .list-box {
    width: 100%;
    float: left;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 0px 15px 30px 15px;
    overflow-x: hidden;
    overflow-y: auto;
    .item-comp {
      width: 100%;
      height: auto;
      display: flex;
      align-items: center;
      flex-direction: row;
      justify-content: space-between;
      margin-top: 30px;
      .title {
        flex: 1;
        height: auto;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 16px;
        text-align: left;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        margin-right: 10px;
      }
      .link {
        width: auto;
        font-size: 14px;
        font-weight: 400;
        line-height: 16px;
        color: #3ca7fa;
        text-decoration: none;
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
}
</style>
