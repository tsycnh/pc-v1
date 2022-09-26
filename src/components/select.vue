<template>
  <div class="choice-item">
    <div v-if="previewImage" class="preview-image borderbox">
      <img
        class="back-detail"
        @click="backDetail()"
        src="../assets/img/icon-back-n.png"
      />
      <div class="pic-item">
        <div
          class="pic"
          :style="{ 'background-image': 'url(' + thumb + ')' }"
        ></div>
      </div>
    </div>
    <div class="info">
      <span class="tit"
        >{{ num }}.{{ question.type_text }}（{{ question.score }}分）</span
      >
    </div>
    <div class="question-content">
      <div
        @click="PreviewImage($event)"
        class="content-render"
        v-html="question.content"
      ></div>
    </div>
    <div class="choice-box">
      <template v-for="item in 10">
        <div
          class="choice-tap-item"
          :key="item"
          :class="{ active: active.indexOf('option' + item) !== -1 }"
          @click="change(item)"
          v-if="question['option' + item]"
        >
          <template v-if="isOver">
            <div
              v-if="question.answer.indexOf('option' + item) !== -1"
              class="answer-index"
            >
              <img class="icon" src="../assets/img/exam/icon-right.png" />
            </div>
            <div
              v-else-if="active.indexOf('option' + item) !== -1"
              class="answer-index"
            >
              <img class="icon" src="../assets/img/exam/icon-Wrong.png" />
            </div>
            <div class="index" v-else>
              {{ optionTypeTextMap["option" + item] }}
            </div>
            <div class="content">
              <div
                class="content-render"
                @click="PreviewImage($event)"
                v-html="question['option' + item]"
              ></div>
            </div>
          </template>
          <template v-else>
            <div class="index">{{ optionTypeTextMap["option" + item] }}</div>
            <div class="content">
              <div
                class="content-render"
                @click="PreviewImage($event)"
                v-html="question['option' + item]"
              ></div>
            </div>
          </template>
        </div>
      </template>
    </div>
    <template v-if="isOver">
      <div class="analysis-box">
        <div class="answer-box">
          <div class="content">
            <div class="answer">
              <i></i>答案：<span
                class="mr-10"
                v-for="item in answers"
                :key="item"
                >{{ optionTypeTextMap[item] }}</span
              >
            </div>
            <div class="my-answer" v-if="!wrongBook && isCorrect !== 1">
              <i></i>我的答案：<span
                class="mr-10"
                v-for="item in active"
                :key="item"
                >{{ optionTypeTextMap[item] }}</span
              >
            </div>
            <div class="score"><i></i>得分：{{ score }}</div>
          </div>
          <div class="button" @click="remarkStatus = !remarkStatus">
            <span>折叠解析</span>
            <img
              class="icon"
              v-if="remarkStatus"
              src="../assets/img/exam/fold.png"
            />
            <img class="icon" v-else src="../assets/img/exam/unfold.png" />
          </div>
        </div>
        <div class="remark-box" v-if="question.remark && remarkStatus">
          <div class="left-remark">
            <div class="tit"><i></i>解析：</div>
          </div>
          <div class="remark" v-html="question.remark"></div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: [
    "question",
    "reply",
    "isCorrect",
    "isOver",
    "score",
    "wrongBook",
    "num",
  ],
  data() {
    return {
      active: [],
      optionTypeTextMap: {
        option1: "A",
        option2: "B",
        option3: "C",
        option4: "D",
        option5: "E",
        option6: "F",
        option7: "G",
        option8: "H",
        option9: "I",
        option10: "J",
      },
      previewImage: false,
      thumb: null,
      remarkStatus: false,
    };
  },
  mounted() {
    if (this.reply) {
      this.active = this.reply.split(",");
    }
  },
  watch: {
    reply() {
      this.active = this.reply.split(",");
    },
  },
  computed: {
    answers() {
      if (!this.question.answer) {
        return [];
      }
      return this.question.answer.split(",");
    },
  },
  methods: {
    change(index) {
      if (this.isOver) {
        return;
      }
      let indexItem = "option" + index;
      let pos = this.active.indexOf(indexItem);
      if (pos === -1) {
        this.active.push(indexItem);
      } else {
        this.active.splice(pos, 1);
      }
      this.$emit("update", this.question.id, this.active.join(","));
    },
    backDetail() {
      this.previewImage = false;
    },
    PreviewImage($event) {
      if ($event.target.src) {
        $event.stopPropagation();
        this.thumb = $event.target.src;
        this.previewImage = true;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.choice-item {
  background-color: #f1f2f6;
  width: 100%;
  .preview-image {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 400;
    padding: 15px;
    background-color: #000000;
    display: flex;
    align-items: center;
    .back-detail {
      position: absolute;
      top: 15px;
      left: 15px;
      width: 19px;
      height: 19px;
      cursor: pointer;
    }
    .pic-item {
      width: 100%;
      height: 100%;
      .pic {
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center center;
      }
    }
  }
  .info {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30px 30px 0px 30px;
    background-color: #fff;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    /* Firefox */
    -webkit-box-sizing: border-box;
    /* Safari */

    .tit {
      height: 18px;
      font-size: 18px;
      font-weight: 500;
      color: #333333;
      line-height: 18px;
    }
  }
  .question-content {
    width: 100%;
    height: auto;
    font-size: 15px;
    font-weight: 400;
    color: #333333;
    line-height: 24px;
    padding: 30px 30px 0px 30px;
    background-color: #fff;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    /* Firefox */
    -webkit-box-sizing: border-box;
    /* Safari */
  }
  .choice-box {
    width: 100%;
    height: auto;
    float: left;
    box-sizing: border-box;
    padding: 30px;
    background-color: #fff;

    .choice-tap-item {
      width: 100%;
      height: auto;
      float: left;
      box-sizing: border-box;
      display: flex;
      margin-bottom: 30px;
      border: none;
      cursor: pointer;
      align-items: center;
      &:last-child {
        margin-bottom: 0px;
      }
      &.active .index {
        background: #3ca7fa;
        border: 1px solid #3ca7fa;
        color: #fff;
      }

      .answer-index {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 500;
        color: #333333;
        .icon {
          width: 20px;
          height: 20px;
        }
      }

      .index {
        width: 20px;
        height: 20px;
        border: 1px solid #cccccc;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 500;
        color: #333333;
      }

      .content {
        flex: 1;
        color: #333333;
        padding-left: 10px;
        line-height: 20px;
        font-size: 16px;
        font-weight: 400;
        background-color: #fff;
      }
    }
  }
}
</style>
