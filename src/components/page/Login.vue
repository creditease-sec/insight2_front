<template>
  <div class="login-wrap" style="color:black">
    <div class="ms-title">
      洞察
      <span class="red_font">贰</span>
    </div>

    <div class="ms-login">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="0px"
        class="demo-ruleForm"
      >
        <el-form-item prop="username">
          <el-input
            v-model="ruleForm.username"
            placeholder="用户名"
            @keyup.enter.native="submitForm('ruleForm')"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="密码"
            v-model="ruleForm.password"
            @keyup.enter.native="submitForm('ruleForm')"
          ></el-input>
        </el-form-item>

        <el-form-item prop="type">
          <el-select
            v-model="currentIndex"
            placeholder="请选择"
            style="width:40%;"
            @change="loginMethodChange"
          >
            <el-option
              v-for="(item,index) in options"
              :key="item.id"
              :label="item.name"
              :value="index"
            ></el-option>
          </el-select>
          <div class="captcha_div">
            <el-input
              style="top:-10px;width:70px;height: 32px;"
              placeholder="验证码"
              v-model="ruleForm.code"
              maxlength="4"
              @keyup.enter.native="submitForm('ruleForm')"
            ></el-input>
            <img :src="captcha_img_data" @click="getCaptcha" style="width:90px;height: 32px;" />
          </div>
        </el-form-item>

        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import Qs from "qs";

export default {
  created() {
    let that = this
    this.$axios.get("api/authmode/all").then(res => {
      that.options.push({ name: "默认本地", id: "LOCAL" });
      res.data.result.forEach(function(element,index) {
        that.options.push(element);
        if (element.default) {
          that.currentIndex = index+1
        }
      });
      this.getCaptcha();
    });
  },
  data: function() {
    return {
      captcha_img_data: "",
      options: [],
      currentIndex: 0,
      ruleForm: {
        username: "",
        password: "",
        type: 0
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    loginMethodChange(index) {
      if (
        this.options[index].href !== undefined &&
        this.options[index].href != ""
      ) {
        window.location.href = this.options[index].href;
      }
    },

    getCaptcha() {
      this.$axios.get("/api/gencode?t="+new Date().getTime()).then(res => {
        this.captcha_img_data = res.data.image;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.options[this.currentIndex].id);
          this.ruleForm.type = this.options[this.currentIndex].id;
          this.$axios
            .post("/api/login", Qs.stringify(this.ruleForm))
            .then(res => {
              if (res.data.status == 1) {
                this.$message.success(res.data.msg);

                this.$cookies.set("__ROLELIST__", res.data.role.accesses);

                if (res.data.role.accesses == "") {
                  if (this.$route.query.redirect) {
                    this.$router.push(this.$route.query.redirect);
                  } else {
                    this.$router.push("/n_my_vulns");
                  }
                } else {
                  if (this.$route.query.redirect) {
                    this.$router.push(this.$route.query.redirect);
                  } else {
                    this.$router.push("/");
                  }
                }
              } else {
                if (res.data.refresh) {
                  this.getCaptcha();
                }
                this.$message.error(res.data.msg);
              }
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
@font-face {
  font-family: "webfont";
  font-display: swap;
  src: url("/static/fonts/login/webfont_azyq7wkvtap.eot"); /* IE9*/
  src: url("/static/fonts/login/webfont_azyq7wkvtap.eot?#iefix")
      format("embedded-opentype"),
    /* IE6-IE8 */ url("/static/fonts/login/webfont_azyq7wkvtap.woff2")
      format("woff2"),
    url("/static/fonts/login/webfont_azyq7wkvtap.woff") format("woff"),
    /* chrome、firefox */ url("/static/fonts/login/webfont_azyq7wkvtap.ttf")
      format("truetype"),
    /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
      url("/static/fonts/login/webfont_azyq7wkvtap.svg#杨任东竹石体-Bold")
      format("svg"); /* iOS 4.1- */
}

.logo_img {
  width: 18pt;
  height: 18pt;
  margin-right: 4pt;
  margin-bottom: -2px;
}

.logo_img_solo {
  width: 15pt;
  height: 15pt;
}
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  font-family: "webfont";
}
.ms-title {
  position: absolute;
  top: 45%;
  width: 100%;
  margin-top: -230px;
  text-align: center;
  font-size: 30px;
  color: #378f63;
  font-family: "webfont";
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 300px;
  margin: -150px 0 0 -190px;
  padding: 40px;
  border-radius: 5px;
  -webkit-box-shadow: 2px 2px 20px 1px #c7c6c6;
  box-shadow: 2px 2px 20px 1px #c7c6c6;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  font-family: "webfont";
}
.el-button--primary {
  background-color: #fdfffe !important;
  border-color: #dadada !important;
  color: #3e9b87f3;
  font-size: 15px;
}

.el-button--primary:hover {
  background-color: #fdfffe !important;
  border-color: #7d7e81 !important;
  color: #9fd8cbf3;
  font-size: 15px;
}

.box1Video video {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  min-height: 100%;
  min-width: 100%;
}

.red_font {
  font-size: 16px;
  color: #d43030;
}

.captcha_div {
  left: 10px;
  top: 10px;
  height: 32px;
  display: inline-block;
  position: relative;
}
</style>