<template>
  <transition name="fade">
    <div class="mask">
      <div class="dialog-login-box">
        <div class="dialog-tabs">
          <div class="item-tab">学习详情</div>
          <img
            class="btn-close"
            @click="cancel()"
            src="@/assets/img/commen/icon-close.png"
          />
        </div>
        <div class="box">
          <div
            class="item"
            @click="goPlay(item)"
            v-for="item in list"
            :key="item.id"
          >
            <div class="title">
              {{ item.title }}
            </div>
            <div class="item-time">
              <duration
                v-if="
                  item.watch_record && item.watch_record.watch_seconds !== 0
                "
                :seconds="item.watch_record.watch_seconds"
              ></duration>
              <span v-else>0:00</span>
              / <duration :seconds="item.duration"></duration>
            </div>
            <div
              class="item-text"
              v-if="
                item.watch_record &&
                  item.watch_record.watch_seconds >= item.duration
              "
            >
              已学完
            </div>
            <div class="item-progress" v-else>未学完</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import Duration from "../../../components/duration.vue";
export default {
  components: {
    Duration,
  },
  props: ["id"],
  data() {
    return {
      loading: false,
      list: [],
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    goPlay(item) {
      this.$router.push({
        name: "coursesVideo",
        query: {
          id: item.id,
        },
      });
    },
    getData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Member.Learned.CoursesDetail(this.id)
        .then((res) => {
          this.loading = false;
          this.list = res.data;
        })
        .catch((e) => {
          this.loading = false;
          this.$message.error(e.message);
        });
    },
    cancel() {
      this.$emit("hideDialog");
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
  .dialog-login-box {
    width: 620px;
    height: 500px;
    background: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 30px 0px 0px 0px;
    animation: scaleBig 0.3s;

    .dialog-tabs {
      width: 100%;
      height: 20px;
      display: flex;
      flex-direction: row;
      position: relative;
      box-sizing: border-box;
      padding: 0px 30px;

      .btn-close {
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
      .item-tab {
        width: auto;
        height: 20px;
        font-size: 18px;
        font-weight: 500;
        color: #333333;
        line-height: 20px;
      }
    }
    .box {
      width: 100%;
      margin-top: 30px;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding: 0px 20px;
      margin-bottom: 30px;
      overflow-y: auto;
      overflow-x: hidden;
      .item {
        width: 100%;
        height: 30px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        background: #f4fafe;
        border-radius: 4px;
        box-sizing: border-box;
        padding: 0px 10px;
        cursor: pointer;
        &:last-child {
          margin-bottom: 0px;
        }
        &:hover {
          .title {
            color: #3ca7fa;
          }
        }
        .title {
          width: 300px;
          height: 30px;
          font-size: 14px;
          font-weight: 400;
          color: #333333;
          line-height: 30px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
        }
        .item-time {
          width: 180px;
          height: 30px;
          font-size: 14px;
          font-weight: 400;
          color: #666666;
          line-height: 30px;
        }
        .item-text {
          width: auto;
          height: 30px;
          font-size: 14px;
          font-weight: 400;
          color: #04c877;
          line-height: 30px;
        }
        .item-progress {
          width: auto;
          height: 30px;
          font-size: 14px;
          font-weight: 400;
          color: #666666;
          line-height: 30px;
        }
      }
    }
  }
}
</style>
