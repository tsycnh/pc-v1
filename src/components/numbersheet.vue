<template>
  <div class="box">
    <div class="number-box" v-if="qidArr.length < 1000">
      <div
        class="num"
        :class="{
          active: index + 1 === activeNum,
          completed:
            configkey[index] ||
            (hasPracticeIds && hasPracticeIds.indexOf(item) !== -1),
          practice: type === 'practice',
          wrongbook: type === 'wrongbook',
          collection: type === 'collection',
        }"
        v-for="(item, index) in qidArr"
        :key="index"
        @click="goDetail(index + 1)"
      >
        {{ index + 1 }}
      </div>
    </div>
    <div class="number-box2" v-else>
      <div
        class="num"
        :class="{
          active: index + 1 === activeNum,
          completed:
            configkey[index] ||
            (hasPracticeIds && hasPracticeIds.indexOf(item) !== -1),
          practice: type === 'practice',
          wrongbook: type === 'wrongbook',
          collection: type === 'collection',
        }"
        v-for="(item, index) in qidArr"
        :key="index"
        @click="goDetail(index + 1)"
      >
        {{ index + 1 }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["activeNum", "qidArr", "type", "configkey", "hasPracticeIds"],
  data() {
    return {};
  },
  methods: {
    goDetail(qid) {
      this.$emit("change", qid);
    },
  },
};
</script>
<style lang="less" scoped>
.box {
  width: 100%;
  .number-box {
    width: 100%;
    padding: 30px;
    box-sizing: border-box;
    display: grid;
    grid-row-gap: 23px;
    grid-column-gap: 30px;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    .practice {
      border: 1px solid #c1c4cb;
      color: #999999;
      &.completed {
        border: 1px solid #e1a500;
        background-color: #e1a500;
        color: #ffffff;
      }
      &.active {
        border: 1px solid #e1a500;
        background-color: rgba(#e1a500, 0.1);
        color: #e1a500;
      }
    }
    .collection {
      border: 1px solid #c1c4cb;
      color: #999999;
      &.completed {
        border: 1px solid #3ca7fa;
        background-color: #3ca7fa;
        color: #ffffff;
      }
      &.active {
        border: 1px solid #3ca7fa;
        background-color: rgba(#3ca7fa, 0.1);
        color: #3ca7fa;
      }
    }
    .wrongbook {
      border: 1px solid #c1c4cb;
      color: #999999;
      &.completed {
        border: 1px solid #3ca7fa;
        background-color: #3ca7fa;
        color: #ffffff;
      }
      &.active {
        border: 1px solid #3ca7fa;
        background-color: rgba(#3ca7fa, 0.1);
        color: #3ca7fa;
      }
    }
    .num {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        opacity: 0.8;
      }
    }
  }
  .number-box2 {
    width: 100%;
    padding: 30px;
    box-sizing: border-box;
    display: grid;
    gap: 23px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    .practice {
      border: 1px solid #c1c4cb;
      color: #999999;
      &.completed {
        border: 1px solid #e1a500;
        background-color: #e1a500;
        color: #ffffff;
      }
      &.active {
        border: 1px solid #e1a500;
        background-color: rgba(#e1a500, 0.1);
        color: #e1a500;
      }
    }
    .collection {
      border: 1px solid #c1c4cb;
      color: #999999;

      &.completed {
        border: 1px solid #9355de;
        background-color: #9355de;
        color: #ffffff;
      }
      &.active {
        border: 1px solid #9355de;
        background-color: rgba(#9355de, 0.1);
        color: #9355de;
      }
    }
    .wrongbook {
      border: 1px solid #c1c4cb;
      color: #999999;
      &.completed {
        border: 1px solid #ff4d4f;
        background-color: #ff4d4f;
        color: #ffffff;
      }
      &.active {
        border: 1px solid #ff4d4f;
        background-color: rgba(#ff4d4f, 0.1);
        color: #ff4d4f;
      }
    }
    .num {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>
