<template>
  <div class="pro-box">
    <div class="item-line">
      <div class="item-left">
        <div class="item-tit">实名认证</div>
        <div class="item-value">
          <input
            class="input"
            type="text"
            placeholder="请填写你的真实姓名"
            v-model="realForm.real_name"
            @input="inputFn"
          />
        </div>
      </div>
    </div>
    <div class="item-line">
      <div class="item-left">
        <div class="item-tit">性别</div>
        <div class="item-radio">
          <div class="boy">
            <input
              type="radio"
              name="radios"
              value="1"
              v-model="realForm.gender"
              @input="inputFn"
            /><label>男</label>
          </div>

          <div class="girl">
            <input
              type="radio"
              name="radios"
              value="2"
              v-model="realForm.gender"
              @input="inputFn"
            /><label>女</label>
          </div>
        </div>
      </div>
    </div>
    <div class="item-line">
      <div class="item-left">
        <div class="item-tit">生日</div>
        <div class="item-value">
          <date-picker
            placeholder="选择生日"
            v-model="realForm.birthday"
            type="date"
            valueType="format"
          ></date-picker>
        </div>
      </div>
    </div>
    <div class="item-line">
      <div class="item-left">
        <div class="item-tit">职业</div>
        <div class="item-value">
          <input
            class="input"
            v-model="realForm.profession"
            placeholder="此处填写你的所处职业"
            @input="inputFn"
          />
        </div>
      </div>
    </div>
    <div class="item-line">
      <div class="item-left">
        <div class="item-tit">住址</div>
        <div class="item-value">
          <input
            class="input"
            v-model="realForm.address"
            placeholder="此处填写你的联系地址"
            @input="inputFn"
          />
        </div>
      </div>
    </div>
    <div class="item-line">
      <div class="item-left">
        <div class="item-tit">毕业证照</div>
        <div class="item-thumb">
          <img class="icon" src="@/assets/img/commen/upload.png" />
          <ProImageUpload
            v-if="init"
            :pic="realForm.diploma"
            :position="1"
            @change="getUrl"
          ></ProImageUpload>
        </div>
      </div>
    </div>
    <div class="item-line">
      <div class="item-left">
        <div class="item-tit">毕业院校</div>
        <div class="item-value">
          <input
            class="input"
            v-model="realForm.graduated_school"
            placeholder="此处填写你的毕业院校"
            @input="inputFn"
          />
        </div>
      </div>
    </div>
    <div class="item-line">
      <div class="item-left">
        <div class="item-tit">身份证号</div>
        <div class="item-value">
          <input
            class="input"
            v-model="realForm.id_number"
            @input="inputFn"
            placeholder="此处填写你的身份证号码"
          />
        </div>
      </div>
    </div>
    <div class="item-line">
      <div class="item-left">
        <div class="item-sptit">身份证正面</div>
        <div class="item-thumb">
          <img class="icon" src="@/assets/img/commen/upload.png" />
          <ProImageUpload
            v-if="init"
            :pic="realForm.id_frontend_thumb"
            :position="2"
            @change="getUrl"
          ></ProImageUpload>
        </div>
        <div class="item-sptit">身份证反面</div>
        <div class="item-thumb">
          <img class="icon" src="@/assets/img/commen/upload.png" />
          <ProImageUpload
            v-if="init"
            :pic="realForm.id_backend_thumb"
            :position="3"
            @change="getUrl"
          ></ProImageUpload>
        </div>
        <div class="item-sptit">手持身份证</div>
        <div class="item-thumb">
          <img class="icon" src="@/assets/img/commen/upload.png" />
          <ProImageUpload
            v-if="init"
            :pic="realForm.id_hand_thumb"
            :position="4"
            @change="getUrl"
          ></ProImageUpload>
        </div>
      </div>
    </div>
    <div class="btn-box">
      <div
        class="button-submit"
        :class="{ active: realFormFocus }"
        @click="sunmitRealForm"
      >
        保存
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/zh-cn";
import ProImageUpload from "@/components/profile-image-upload.vue";

export default {
  components: {
    ProImageUpload,
    DatePicker,
  },
  props: [],
  data() {
    return {
      realForm: {
        real_name: null,
        gender: null,
        birthday: null,
        address: null,
        profession: null,
        graduated_school: null,
        diploma: null,
        id_number: null,
        id_frontend_thumb: null,
        id_backend_thumb: null,
        id_hand_thumb: null,
      },
      loading: false,
      oldBirthday: null,
      realFormFocus: false,
      editNickStatus: false,
      formLoading: false,
      form: {
        nick_name: null,
      },
      init: false,
    };
  },
  watch: {
    "realForm.birthday": {
      handler: function() {
        if (this.realForm.birthday === this.oldBirthday) {
          return;
        }
        this.realFormFocus = true;
      },
    },
  },
  computed: {
    ...mapState(["isLogin", "user", "config"]),
  },
  mounted() {
    this.form.nick_name = this.user.nick_name;
    this.getData();
  },
  methods: {
    inputFn() {
      this.realFormFocus = true;
    },
    getData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.init = false;
      this.$api.Member.Profile().then((res) => {
        this.loading = false;
        if (res.data) {
          this.realForm.real_name = res.data.real_name;
          this.realForm.gender = res.data.gender;
          this.realForm.birthday = res.data.birthday;
          this.realForm.address = res.data.address;
          this.realForm.profession = res.data.profession;
          this.realForm.graduated_school = res.data.graduated_school;
          this.realForm.diploma = res.data.diploma;
          this.realForm.id_number = res.data.id_number;
          this.realForm.id_frontend_thumb = res.data.id_frontend_thumb;
          this.realForm.id_backend_thumb = res.data.id_backend_thumb;
          this.realForm.id_hand_thumb = res.data.id_hand_thumb;
          this.oldBirthday = res.data.birthday;
        } else {
          this.oldBirthday = null;
        }
        this.init = true;
      });
    },
    getUrl(key, url) {
      this.realFormFocus = true;
      if (key === 1) {
        this.realForm.diploma = url;
      }
      if (key === 2) {
        this.realForm.id_frontend_thumb = url;
      }
      if (key === 3) {
        this.realForm.id_backend_thumb = url;
      }
      if (key === 4) {
        this.realForm.id_hand_thumb = url;
      }
    },
    sunmitRealForm() {
      if (this.formLoading) {
        return;
      }
      if (!this.realFormFocus) {
        return;
      }
      this.formLoading = true;
      this.$api.Member.ProfileSave(this.realForm)
        .then((res) => {
          this.formLoading = false;
          this.$message.success("保存成功");
          this.getData();
        })
        .catch((e) => {
          this.formLoading = false;
          this.$message.error(e.message);
        });
    },
  },
};
</script>
<style lang="less" scoped>
.pro-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  .btn-box {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    flex-direction: row;
    .button-submit {
      width: 104px;
      height: 40px;
      margin-left: 90px;
      background: #cccccc;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 400;
      color: #ffffff;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
      &.active {
        background: #3ca7fa;
      }
    }
  }
  .item-line {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    &:not(:last-of-type) {
      margin-bottom: 50px;
    }
    .item-left {
      display: flex;
      flex-direction: row;
      align-items: center;
      .item-name {
        width: 110px;
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        line-height: 14px;
        margin-right: 101px;
        display: flex;
        flex-direction: row;
        align-items: center;
        img {
          width: 20px;
          height: 20px;
          margin-right: 10px;
        }
      }
      .item-tit {
        width: 56px;
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        line-height: 14px;
        margin-right: 34px;
      }
      .item-sptit {
        width: 70px;
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        line-height: 14px;
        margin-right: 20px;
      }
      .item-radio {
        display: flex;
        height: 20px;
        flex-direction: row;
        align-items: center;
        .boy {
          display: flex;
          height: 20px;
          flex-direction: row;
          align-items: center;
          input {
            width: 14px;
            height: 14px;
            margin-right: 10px;
          }
          label {
            font-size: 14px;
            font-weight: 400;
            color: #333333;
            line-height: 14px;
            margin-right: 30px;
          }
        }
        .girl {
          display: flex;
          height: 20px;
          flex-direction: row;
          align-items: center;
          input {
            width: 14px;
            height: 14px;
            margin-right: 10px;
          }
          label {
            font-size: 14px;
            font-weight: 400;
            color: #333333;
            line-height: 14px;
          }
        }
      }
      .item-btn {
        width: 56px;
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: #3ca7fa;
        line-height: 14px;
        cursor: pointer;
      }
      .item-avatar {
        width: 48px;
        height: 48px;
        border-radius: 24px;
        overflow: hidden;
        position: relative;
        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 24px;
        }
        .input-avatar {
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
          width: 48px;
          height: 48px;
          border-radius: 24px;
        }
      }
      .item-thumb {
        width: 160px;
        height: 90px;
        background: #f4fafe;
        cursor: pointer;
        margin-right: 50px;
        position: relative;
        .icon {
          position: absolute;
          width: 30px;
          height: 30px;
          top: 30px;
          left: 65px;
        }
        img {
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
      }
      .item-btn {
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
      .item-value {
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 14px;
        .input {
          width: 224px;
          height: 36px;
          background: #ffffff;
          border-radius: 4px;
          border: 1px solid #dcdfe6;
          padding-left: 15px;
        }
      }
    }
    .item-right {
      display: flex;
      flex-direction: row;
      align-items: center;
      .btn {
        cursor: pointer;
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: #999999;
        line-height: 14px;
        &.act {
          color: #3ca7fa;
        }
      }
      .tip {
        margin-left: 10px;
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: #999999;
        line-height: 14px;
      }
    }
  }
}
</style>
