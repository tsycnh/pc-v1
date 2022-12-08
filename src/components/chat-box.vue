<template>
  <div class="chat-box">
    <div class="tip-box" v-if="messageDisabled || userDisabled">
      <div class="tip" v-if="messageDisabled">
        全员已禁言
      </div>
      <div class="tip" v-if="!messageDisabled && userDisabled">
        您已被禁言
      </div>
    </div>
    <div
      class="chat-box"
      ref="chatBox"
      :class="{
        end: status === 2,
      }"
    >
      <template v-if="chatRecords.length > 0">
        <div class="bullet-chat active" v-if="!over && total !== 0">
          <div class="addmore" @click="getMoreChatRecords()">加载更多</div>
        </div>
      </template>
      <div
        class="bullet-chat"
        v-for="(item, index) in chatRecords"
        :key="index"
        :id="item.id"
      >
        <template v-if="item.local">
          <div class="alert-message">
            <span class="text-block">{{ item.content }}</span>
          </div>
        </template>

        <template v-else>
          <div
            class="nickname"
            :class="{
              teacher:
                item.msg_body.role === 'teacher' ||
                item.msg_body.role === 'assistant',
            }"
          >
            {{ item.msg_body.nick_name }}
          </div>
          <div class="message-content">
            <div class="chat-content">{{ item.msg_body.content }}</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import GoMeeduRequest from "@/js/go-meedu/request.js";
import config from "@/js/config.js";

export default {
  props: [
    "chat",
    "enabledChat",
    "enabledMessage",
    "status",
    "cid",
    "vid",
    "disabled",
  ],
  data() {
    return {
      chatChannel: null,
      chatUser: null,
      connect_url: null,
      chatRecords: [],
      pagination: {
        page: 1,
        size: 100,
      },
      pageLoading: false,
      over: false,
      total: 0,
      enabledScrollBottom: false,
      newId: null,
      messageDisabled: false,
      userDisabled: false,
      ws: null,
      GoMeeduRequest: null,
    };
  },
  watch: {
    chatRecords() {
      if (this.enabledScrollBottom) {
        this.chatBoxScrollBottom();
      }
    },
    enabledMessage(val) {
      if (val) {
        this.messageDisabled = true;
      } else {
        this.messageDisabled = false;
      }
    },
    disabled(val) {
      if (val) {
        this.userDisabled = true;
      } else {
        this.userDisabled = false;
      }
    },
    chat(data) {
      // 初始化聊天服务
      if (typeof data !== "undefined") {
        this.chatChannel = data.channel;
        this.chatUser = data.user;
        this.connect_url = data.connect_url;
        if (this.enabledChat) {
          this.init();
        }
      }
      this.enabledScrollBottom = true;
      this.getChatRecords();
    },
  },
  computed: {
    ...mapState(["user"]),
  },
  beforeDestroy() {
    // 断开聊天室
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  },
  mounted() {
    this.GoMeeduRequest = new GoMeeduRequest(config.goMeeduUri);
  },
  methods: {
    getMoreChatRecords() {
      this.enabledScrollBottom = false;
      this.pagination.page++;
      this.getChatRecords();
    },
    getChatRecords() {
      if (this.pageLoading || this.over) {
        return;
      }
      this.pageLoading = true;
      this.GoMeeduRequest.chatMsgPaginate(this.cid, this.vid, this.pagination)
        .then((res) => {
          this.total = res.data.total;
          if (res.data.data[0]) {
            this.newId = res.data.data[0].id;
          }
          let chatData = res.data.data.reverse();
          this.chatRecords.unshift(...chatData);
          if (this.pagination.size !== res.data.data.length) {
            this.over = true;
          }
          this.pageLoading = false;
          if (this.pagination.page > 1) {
            this.moveScroll();
          }
        })
        .catch((e) => {
          this.pageLoading = false;
          this.$message.error(e.message);
        });
    },
    moveScroll() {
      setTimeout(() => {
        this.$refs["chatBox"].scrollTop = document.getElementById(
          this.newId
        ).offsetTop;
      }, 150);
    },
    chatBoxScrollBottom() {
      setTimeout(() => {
        this.$refs["chatBox"].scrollTop = this.$refs["chatBox"].scrollHeight;
      }, 150);
    },
    init() {
      let that = this;
      let connectUrl = this.connect_url;
      connectUrl = connectUrl.replace(":courseId", this.cid);
      connectUrl = connectUrl.replace(":videoId", this.vid);
      connectUrl = connectUrl.replace(":token", this.$utils.getToken());
      if ("WebSocket" in window) {
        this.ws = new WebSocket(connectUrl);
        this.ws.onopen = function() {
          that.chanEvt("connect-success");
        };
        this.ws.onclose = function(evt) {
          that.chanEvt("losed");
        };
        this.ws.onmessage = function(evt) {
          that.enabledScrollBottom = true;
          let message = JSON.parse(evt.data);
          if (message.t === "message") {
            let msgV = JSON.parse(message.v);
            that.chatRecords.push({
              msg_body: msgV,
            });
          } else if (message.t === "connect") {
            that.chatRecords.push({
              local: 1,
              msg_body: {
                chat_id: 0,
              },
              content: message.u.nickname + "已加入",
            });
          } else if (message.t === "sign-in-created") {
            that.$emit("sign", message.params);
          } else if (message.t === "sign-in-closed") {
            that.$emit("endSign");
          } else if (message.t === "room-ban") {
            that.messageDisabled = true;
            that.$emit("change", that.userDisabled, that.messageDisabled);
          } else if (
            message.t === "room-user-ban" &&
            message.params[0] === that.user.id
          ) {
            that.userDisabled = true;
            that.$emit("change", that.userDisabled, that.messageDisabled);
          } else if (message.t === "room-un-ban") {
            that.messageDisabled = false;
            that.$emit("change", that.userDisabled, that.messageDisabled);
          } else if (
            message.t === "room-user-un-ban" ||
            (message.t === "room-user-ban" &&
              message.params[0] !== that.user.id)
          ) {
            that.userDisabled = false;
            that.$emit("change", that.userDisabled, that.messageDisabled);
          } else if (message.t === "room-over") {
            that.$message.success("当前直播已结束");
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          } else if (message.t === "message-deleted") {
            let delID = message.params.ids[0];
            let index = that.chatRecords.findIndex((ele) => {
              return ele.msg_body.chat_id === delID;
            });
            if (index) {
              that.chatRecords.splice(index, 1);
            }
          }
        };
        this.ws.onerror = function(evt) {
          that.chanEvt("enter_fail");
        };
      } else {
        this.$message.error("您的浏览器不支持 WebSocket!");
      }
    },
    chanEvt(e, data) {
      this.enabledScrollBottom = true;
      const mesMap = {
        "connect-success": "已加入聊天室",
        enter_fail: "无法加入聊天室",
        offline: "已断开连接",
        losed: "已断开连接",
        reconnect: "已重新连接",
        connectold: "异地登录",
        "connect-repeat": "异地登录",
        "connect-lose": "已断开链接",
      };

      this.chatRecords.push({
        local: 1,
        msg_body: {
          chat_id: 0,
        },
        content: mesMap[e],
      });
    },
  },
};
</script>
<style lang="less" scoped>
.chat-box {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  .tip-box {
    width: 100%;
    height: 30px;
    float: left;
    display: flex;
    align-items: center;
    justify-content: center;
    .tip {
      width: 80px;
      height: 20px;
      font-size: 12px;
      font-weight: 400;
      color: #ffffff;
      line-height: 12px;
      background: #faad14;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .tit {
    width: 100%;
    height: auto;
    font-size: 16px;
    line-height: 16px;
    font-weight: 600;
    color: #333333;
    margin-bottom: 15px;
    box-sizing: border-box;
    padding: 15px 15px 0px 15px;
  }
  .chat-box {
    width: 100%;
    height: 628px;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 15px 15px 0px 15px;
    &.end {
      height: 549px;
    }

    .bullet-chat {
      width: 100%;
      height: auto;
      float: left;
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 15px;
      }
      &.active {
        display: flex;
        justify-content: center;
      }
      .addmore {
        display: inline-block;
        width: auto;
        height: auto;
        font-size: 13px;
        font-weight: 400;
        color: #666666;
        line-height: 18px;
        cursor: pointer;
        &:hover {
          opacity: 0.8;
        }
      }

      .alert-message {
        width: 100%;
        height: auto;
        float: left;
        text-align: center;

        .text-block {
          width: auto;
          height: 26px;
          padding: 7px 12px;
          background: #cccccc;
          border-radius: 15px;
          display: inline-block;
          font-size: 12px;
          line-height: 12px;
          font-weight: 400;
          color: #ffffff;
        }
      }

      .nickname {
        width: 100%;
        height: auto;
        float: left;
        font-size: 13px;
        font-weight: 400;
        color: #666666;
        line-height: 18px;
        margin-bottom: 5px;
        &.teacher {
          width: auto;
          font-size: 12px;
          font-weight: 400;
          color: #ffffff;
          line-height: 12px;
          padding: 5px 10px;
          background: #3ca7fa;
          border-radius: 2px;
        }
      }

      .message-content {
        width: 100%;
        height: auto;
        float: left;
        display: flex;
        justify-content: space-between;
        .chat-content {
          width: auto;
          height: auto;
          float: left;
          background: #e1f1fd;
          box-sizing: border-box;
          padding: 8px 10px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 400;
          color: #333333;
          line-height: 18px;
          word-break: break-all;
        }
      }
    }
  }
}
</style>
