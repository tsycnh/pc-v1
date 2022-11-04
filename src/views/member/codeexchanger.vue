<template>
  <div class="content">
    <div class="mask" v-show="dialogStatus">
      <div class="dialog-box" v-if="verifyStatus">
        <div class="dialog-tabs">
          <div class="item-tab">操作验证</div>
          <img
            class="btn-close"
            @click="cancel()"
            src="@/assets/img/commen/icon-close.png"
          />
        </div>
        <div class="info">
          <div class="input-item">
            <input
              type="text"
              placeholder="请输入图形验证码"
              autocomplete="off"
              v-model="form.captcha"
              class="input-short"
              required=""
            />
            <div class="captcha">
              <img
                class="captcha-img"
                :src="captcha.img"
                mode="widthFix"
                @click="getCaptcha"
              />
            </div>
          </div>
        </div>
        <div class="btn-box">
          <div class="btn-submit" v-if="status" @click="confirm()">
            确认
          </div>
          <div class="btn-submit" v-else @click="withdraw()">确认</div>
          <div class="btn-cancel" @click="cancel()">取消</div>
        </div>
      </div>
      <div class="dialog-box" v-if="confirmStatus">
        <div class="dialog-tabs">
          <div class="item-tab">验证成功，可兑换以下内容</div>
          <img
            class="btn-close"
            @click="confirmCancel()"
            src="@/assets/img/commen/icon-close.png"
          />
        </div>
        <div class="info">
          <div
            class="list-item"
            v-for="item in queryList.relate_courses"
            :key="item.id"
          >
            <span v-if="item.sign === 'vod'">录播-{{ item.name }}</span>
            <span v-else-if="item.sign === 'live'">直播-{{ item.name }}</span>
            <span v-else-if="item.sign === 'book'">电子书-{{ item.name }}</span>
            <span v-else-if="item.sign === 'paper'">考试-{{ item.name }}</span>
            <span v-else-if="item.sign === 'mock_paper'"
              >模拟-{{ item.name }}</span
            >
            <span v-else-if="item.sign === 'practice'"
              >练习-{{ item.name }}</span
            >
            <span v-else-if="item.sign === 'vip'">VIP-{{ item.name }}</span>
            <span class="status c-red" v-if="item.is_subscribe">已订阅</span>
            <span class="status" v-else>未订阅</span>
          </div>
        </div>
        <div class="btn-box">
          <div
            class="btn-submit"
            :class="{ disabled: !buttonStatus }"
            @click="exchangeConfirm()"
          >
            确认兑换
          </div>
          <div class="btn-cancel" @click="confirmCancel()">取消</div>
        </div>
      </div>
    </div>
    <div class="box">
      <nav-member :cid="15"></nav-member>
      <div class="right-box">
        <div class="exchange-box">
          <div class="tit">兑换码</div>
          <input
            class="input"
            type="text"
            placeholder="请输入兑换码"
            v-model="exchangeCode"
          />
          <button class="btn-exchange" @click="exchange()">验证</button>
        </div>
        <div class="project-box">
          <div class="btn-title">兑换记录</div>
          <template v-if="list.length > 0">
            <div v-for="item in list" :key="item.activity_id">
              <div
                class="project-item"
                v-for="actItem in JSON.parse(item.activity.relate_data)"
                :key="actItem.id"
              >
                <div class="title">
                  <span v-if="actItem.sign === 'vod'"
                    >录播-{{ actItem.name }}</span
                  >
                  <span v-else-if="actItem.sign === 'live'"
                    >直播-{{ actItem.name }}</span
                  >
                  <span v-else-if="actItem.sign === 'book'"
                    >电子书-{{ actItem.name }}</span
                  >
                  <span v-else-if="actItem.sign === 'paper'"
                    >考试-{{ actItem.name }}</span
                  >
                  <span v-else-if="item.sign === 'mock_paper'"
                    >模拟-{{ item.name }}</span
                  >
                  <span v-else-if="actItem.sign === 'practice'"
                    >练习-{{ actItem.name }}</span
                  >
                  <span v-else-if="actItem.sign === 'vip'"
                    >VIP-{{ actItem.name }}</span
                  >
                </div>
                <div class="info">
                  <span>{{ item.used_at | changeTime }}</span>
                </div>
              </div>
            </div>
          </template>
          <none style="margin-top: 28px;" type="white" v-else></none>
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

export default {
  components: {
    NavFooter,
    NavMember,
    PageBox,
    None,
  },
  data() {
    return {
      dialogStatus: false,
      exchangeCode: null,
      list: [],
      total: null,
      pagination: {
        page: 1,
        size: 10,
      },
      loading: false,
      form: {
        captcha: null,
      },
      captcha: {
        key: null,
        img: null,
      },
      verifyStatus: false,
      confirmStatus: false,
      queryList: null,
      status: false,
      buttonStatus: false,
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
    cancel() {
      this.dialogStatus = false;
      this.verifyStatus = false;
    },
    confirmCancel() {
      this.dialogStatus = false;
      this.confirmStatus = false;
    },
    getCaptcha() {
      this.$api.Other.Captcha().then((res) => {
        this.captcha = res.data;
      });
    },
    resetData() {
      this.list = [];
      this.total = null;
      this.pagination.size = 10;
      this.pagination.page = 1;
    },
    changepage(item) {
      this.pagination.size = item.pageSize;
      this.pagination.page = item.currentPage;
      this.getData();
    },
    getData() {
      this.$api.CodeExchanger.Records(this.pagination).then((res) => {
        this.list = res.data.data;
        this.total = res.data.total;
      });
    },
    withdraw() {
      if (this.loading) {
        return;
      }
      if (!this.form.captcha) {
        this.$message.error("请输入图形验证码");
        return;
      }
      this.loading = true;
      this.$api.CodeExchanger.Query({
        code: this.exchangeCode,
        image_captcha: this.form.captcha,
        image_key: this.captcha.key,
      })
        .then((res) => {
          this.loading = false;
          this.verifyStatus = false;
          this.queryList = res.data.activity;
          this.confirmStatus = true;
        })
        .catch((e) => {
          this.loading = false;
          this.form.captcha = null;
          this.getCaptcha();
          this.$message.error(e.message);
        });
    },
    confirm() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.CodeExchanger.Exchange({
        code: this.exchangeCode,
        image_captcha: this.form.captcha,
        image_key: this.captcha.key,
      })
        .then((res) => {
          this.loading = false;
          this.$message.success("兑换成功");
          this.exchangeCode = null;
          this.dialogStatus = false;
          this.verifyStatus = false;
          this.resetData();
          this.getData();
        })
        .catch((e) => {
          this.loading = false;
          this.form.captcha = null;
          this.getCaptcha();
          this.$message.error(e.message);
        });
    },
    exchange() {
      this.form.captcha = null;
      this.getCaptcha();
      if (!this.exchangeCode) {
        this.$message.error("请输入兑换码");
        return;
      }
      this.dialogStatus = true;
      this.verifyStatus = true;
      this.status = false;
    },
    exchangeConfirm() {
      let data = this.queryList.relate_courses;
      this.buttonStatus = false;
      for (let i = 0; i < data.length; i++) {
        if (data[i].is_subscribe === false) {
          this.buttonStatus = true;
        }
      }
      if (this.buttonStatus) {
        this.form.captcha = null;
        this.getCaptcha();
        this.dialogStatus = true;
        this.verifyStatus = true;
        this.confirmStatus = false;
        this.status = true;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  width: 100%;
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
    .dialog-box {
      width: 500px;
      height: auto;
      background: #ffffff;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      animation: scaleBig 0.3s;
      .dialog-tabs {
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: row;
        position: relative;
        box-sizing: border-box;
        padding: 30px;
        .btn-close {
          width: 16.25px;
          height: 16.25px;
          position: absolute;
          right: 22px;
          top: 32px;
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
      .info {
        width: 100%;
        height: auto;
        float: left;
        box-sizing: border-box;
        padding: 20px 30px;
        .tit {
          width: 100%;
          height: 14px;
          font-size: 14px;
          font-weight: 500;
          color: #333333;
          line-height: 14px;
          margin-bottom: 10px;
        }
        .list-item {
          width: 100%;
          margin-bottom: 20px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          &:last-child {
            margin-bottom: 30px;
          }
          span {
            height: 18px;
            font-size: 14px;
            font-weight: 400;
            color: #333333;
            line-height: 18px;
          }
          .status {
            color: #666666;
          }
          .c-red {
            color: #ff4d4f;
          }
        }
        .input-item {
          width: 100%;
          margin-bottom: 30px;
          display: flex;
          flex-direction: row;
          align-items: center;
          .input {
            width: 100%;
            height: 54px;
            background: #f4fafe;
            border-radius: 4px;
            border: 1px solid #e5e5e5;
            padding-left: 20px;
            outline: none;
          }
          .input-short {
            width: 310px;
            height: 54px;
            background: #f4fafe;
            border-radius: 4px;
            border: 1px solid #e5e5e5;
            padding-left: 20px;
            margin-right: 20px;
            outline: none;
          }
          .captcha {
            width: 110px;
            height: 39px;
            cursor: pointer;
            img {
              width: 110px;
              height: 39px;
            }
          }
        }
      }
      .btn-box {
        width: 100%;
        height: 74px;
        background: #ffffff;
        box-shadow: 0px -2px 4px 0px rgba(102, 102, 102, 0.05);
        border-radius: 0px 0px 8px 8px;
        display: flex;
        flex-direction: row-reverse;
        box-sizing: border-box;
        padding: 15px 30px;
        .btn-cancel {
          width: 88px;
          height: 44px;
          border-radius: 4px;
          border: 1px solid #cccccc;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 14px;
          font-weight: 400;
          color: #333333;
          margin-right: 30px;
          &:hover {
            opacity: 0.8;
          }
        }
        .btn-submit {
          width: 116px;
          height: 44px;
          border-radius: 4px;
          background-color: #3ca7fa;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 14px;
          font-weight: 400;
          color: #fff;
          &.disabled {
            background-color: #999999;
          }
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }
  .box {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    margin-top: 30px;
    .right-box {
      margin-left: 30px;
      width: 999px;
      height: auto;
      box-sizing: border-box;
      .exchange-box {
        width: 999px;
        height: 100px;
        background: #ffffff;
        border-radius: 8px;
        box-sizing: border-box;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        flex-direction: row;
        padding: 30px;
        .tit {
          height: 14px;
          font-size: 14px;
          font-weight: 500;
          color: #333333;
          line-height: 14px;
          margin-right: 30px;
        }
        .input {
          width: 300px;
          height: 40px;
          background: #ffffff;
          border-radius: 4px;
          border: 1px solid #dcdfe6;
          outline: none;
          padding-left: 15px;
          margin-right: 30px;
        }
        .btn-exchange {
          width: 104px;
          height: 40px;
          background: #3ca7fa;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 400;
          color: #ffffff;
          line-height: 16px;
          outline: none;
          &:hover {
            opacity: 0.8;
          }
        }
      }

      .project-box {
        display: flex;
        flex-direction: column;
        width: 999px;
        height: auto;
        background: #ffffff;
        border-radius: 8px;
        box-sizing: border-box;
        padding: 30px;
        .btn-title {
          width: 80px;
          height: 16px;
          font-size: 16px;
          font-weight: 500;
          color: #333333;
          line-height: 16px;
          margin-bottom: 6px;
        }
        .project-item {
          width: 100%;
          height: 14px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          margin-top: 28px;

          .title {
            height: 14px;
            font-size: 14px;
            font-weight: 500;
            color: #333333;
            line-height: 14px;
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
        }
        #page {
          width: 100%;
          display: flex;
          justify-content: center;
        }
      }
    }
  }
}
</style>
