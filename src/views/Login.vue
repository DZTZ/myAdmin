<template>
  <div class="Login">
    <transition name="acc">
      <div class="Login-bg" v-if="is_show"></div>
    </transition>
    <div class="content">
      <div class="input-box">
        <h3 class="title">LOGIN</h3>
        <div class="account">
          <input type="text" placeholder="ACCOUNT" v-model="username" />
        </div>
        <div class="password">
          <input type="password" placeholder="PASSWORD" v-model="password" />
        </div>
      </div>
      <a-alert
        type="error"
        :message="errorMessage"
        banner
        v-show="errorMessage !== ''"
      />
      <a-alert
        type="success"
        :message="successMessage"
        show-icon
        v-show="successMessage !== ''"
      />
      <div class="btn-box bold">
        <a-button type="primary" :loading="loading" block @click="onSignIn">
          SIGN IN
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from "@/request/api";
export default {
  name: "Login",
  components: {},
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
      successMessage: "",
      is_show: false,
      loading: false
    };
  },
  created() {
    setTimeout(() => {
      this.is_show = true;
    }, 2000);
  },
  methods: {
    onSignIn() {
      this.loading = true;
      let data = {
        username: this.username,
        password: this.password
      };
      login(data).then(res => {
        if (res.data.err_code === 0) {
          this.successMessage = res.data.err_msg;
          this.errorMessage = "";
          localStorage.setItem("token", JSON.stringify(res.data));
          setTimeout(() => {
            this.$router.push({ name: "PictureManage" });
          }, 1500);
        } else {
          this.loading = false;
          this.errorMessage = res.data.err_msg;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.Login {
  height: 100%;
  background-image: linear-gradient(to right, black, #313e4f);
  .Login-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("~@/assets/images/bg.jpg") no-repeat center;
    background-size: cover;
    //z-index: -1;
  }
  .content {
    overflow: hidden;
    background: #ffffff;
    width: 400px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: "微软雅黑", "黑体", "宋体";
    .input-box {
      padding: 25px 30px 20px 30px;
    }
    .title {
      color: #3b495d;
      font-size: 24px;
    }
    .account input,
    .password input {
      border-bottom: 1px solid #e7e7e7;
      width: 100%;
      padding: 10px 0;
      font-size: 12px;
      margin-bottom: 10px;
    }
  }
  .btn-box {
    border-top: 1px solid #e7e7e7;
    //padding: 14px;
    text-align: center;
    font-size: 12px;
    background: #313b51;
    color: #ffffff;
    letter-spacing: 2px;
    cursor: pointer;
    &:hover {
      background: #495e77;
    }
    button {
      border-radius: 0;
      height: 47px;
      letter-spacing: 2px;
      background: #313b51;
      border-color: #313b51;
      &:hover {
        border-color: #2f3947;
        background: #2f3947;
      }
    }
  }
}
.acc-enter-active,
.acc-leave-active {
  transition: opacity 4s;
}
.acc-enter, .acc-leave-to /* .fade-leave-active, 2.1.8 版本以下 */ {
  opacity: 0;
}
</style>
