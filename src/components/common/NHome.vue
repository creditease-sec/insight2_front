<template>
  <div class="center-content">
    <div class="header">
      <!-- 折叠按钮 -->
      <div class="collapse-btn insight2_logo">
        <img
          style="height:15px;width:15px;margin-right:5px;margin-top:13px;"
          src="static/img/logo.png"
        />
      </div>
      <div class="logo">
        <img src="static/img/insight_2_logo.png" style="height:13px;margin-top:5px;" />
      </div>
      <div style="  float: left; height:50px;">
        <el-menu
          :default-active="activeIndex"
          style="height:40px;margin-top:-10px"
          background-color="#ffffff20"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="n_dashboard">面板</el-menu-item>
          <el-submenu index="2">
            <template slot="title">我的</template>
            <el-menu-item index="n_my_vulns">待处理漏洞 ({{todo_vul_count?todo_vul_count:"0"}})</el-menu-item>
            <el-menu-item index="n_my_done_vulns">已完成漏洞 ({{done_vul_count?done_vul_count:"0"}})</el-menu-item>
          </el-submenu>
          <el-menu-item index="n_open_vulns">公开漏洞</el-menu-item>
          <el-menu-item index="n_paper">知识</el-menu-item>
          <el-menu-item index="n_pointrecord">积分</el-menu-item>
        </el-menu>
      </div>
      <div class="header-right">
        <div class="header-user-con">
          <div class style="margin-top:8px;margin-right:5px;cursor:pointer;font-size:18px;">
            <el-tooltip effect="dark" :content="!isDesensitive?'前端脱敏':'取消前端脱敏'" placement="bottom">
              <span @click="setDesensitive()" style="margin-right: 1em;margin-top:5px;">
                <span v-show="!isDesensitive">
                  <svg
                    t="1577780413607"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="2170"
                    width="15"
                    height="15"
                  >
                    <path
                      d="M391.529412 262.144c30.117647-12.047059 60.235294-18.070588 90.352941-18.070588 120.470588 0 216.847059 96.376471 216.847059 216.847059 0 30.117647-6.023529 60.235294-18.070588 90.352941l126.494117 126.494117c66.258824-54.211765 120.470588-126.494118 156.611765-210.823529-78.305882-192.752941-259.011765-325.270588-481.882353-325.270588-66.258824 0-126.494118 12.047059-180.705882 36.141176l90.352941 84.329412z"
                      p-id="2171"
                    />
                    <path
                      d="M481.882353 334.426353h-18.070588l150.588235 150.588235v-18.070588c-6.023529-78.305882-60.235294-132.517647-132.517647-132.517647zM825.223529 804.261647L84.329412 63.367529l-60.235294 60.235295 126.494117 126.494117c-60.235294 54.211765-120.470588 132.517647-150.588235 210.82353 78.305882 192.752941 259.011765 325.270588 481.882353 325.270588 66.258824 0 126.494118-12.047059 180.705882-36.141177l108.42353 108.42353 54.211764-54.211765z m-343.341176-120.470588c-120.470588 0-216.847059-96.376471-216.847059-216.847059 0-30.117647 6.023529-60.235294 18.070588-90.352941l72.282353 72.282353v18.070588c0 72.282353 60.235294 132.517647 132.517647 132.517647h18.070589l60.235294 66.258824c-24.094118 12.047059-54.211765 18.070588-84.329412 18.070588z"
                      fill="#3e9b87f3"
                      p-id="2172"
                    />
                  </svg>
                </span>
                <span v-show="isDesensitive">
                  <svg
                    t="1577780696858"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="2283"
                    width="15"
                    height="15"
                  >
                    <path
                      d="M512 160c-230.4 0-428.8 147.2-512 345.6 83.2 204.8 275.2 345.6 512 345.6s428.8-147.2 512-345.6c-83.2-198.4-281.6-345.6-512-345.6z m0 582.4C384 742.4 281.6 640 281.6 512S384 275.2 512 275.2s230.4 102.4 230.4 230.4S640 742.4 512 742.4z m0-371.2c-76.8 0-140.8 64-140.8 140.8s64 140.8 140.8 140.8 140.8-64 140.8-140.8-64-140.8-140.8-140.8z"
                      fill="#3e9b87f3"
                      p-id="2284"
                    />
                  </svg>
                </span>
              </span>
            </el-tooltip>
          </div>

          <!-- 全屏显示 -->
          <div class="btn-fullscreen" @click="handleFullScreen">
            <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
              <i class="el-icon-rank"></i>
            </el-tooltip>
          </div>
          <!-- 消息中心 -->
          <div class="btn-bell">
            <el-tooltip
              effect="dark"
              :content="message?`有${message}条未读消息`:`消息中心`"
              placement="bottom"
            >
              <router-link to="/n_notification">
                <i
                  class="el-icon-message-solid"
                  style="margin-top: 8px;height: 31px;font-size:18px;"
                ></i>
              </router-link>
            </el-tooltip>
            <span class="btn-bell-badge" v-if="message"></span>
          </div>

          <el-popover placement="bottom-end" width="250" trigger="hover">
            <el-card class="box-card">
              <div slot="header" class="clearfix">{{nickname?nickname:username?username:"-"}}</div>
              <div style="margin-bottom:20px;padding-bottom:30px;">
                <div class="user-avator-big" style="float: left;">
                  <img :src="avatar_url?avatar_url:'static/img/logo.png'" />
                </div>
                <div style="float: right; padding: 3px 0">
                  <div>总积分: {{total_points!=null?total_points:"未知"}}</div>
                  <div
                    style="float: right; padding: 3px 0"
                  >可用积分: {{available_points!=null?available_points:"未知"}}</div>
                </div>
              </div>
            </el-card>
            <!-- 用户头像 -->
            <div class="user-avator" slot="reference">
              <img :src="avatar_url?avatar_url:'static/img/logo.png'" />
            </div>
          </el-popover>

          <!-- 用户名下拉菜单 -->
          <el-dropdown class="user-name" trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              {{nickname?nickname:username?username:"-"}}
              <i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="n_personal_setting">个人设置</el-dropdown-item>
              <el-dropdown-item command="n_changepw">修改密码</el-dropdown-item>
              <el-dropdown-item divided command="logout">{{$t("label.exit")}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <div class="content">
      <transition name="move" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>

import bus from "./bus";
import { console_log } from "../../utils/common";

export default {
  data() {
    return {
      
      activeIndex: "1",
      fullscreen: false,
      username: null,
      nickname: null,
      avatar_url: null,
      todo_vul_count: null,
      done_vul_count: null,
      collapse: false, 
      message: 0,
      total_points: null,
      available_points: null,
      user_info_url: "api/user/info"
    };
  },
 
  computed: {
 
    isDesensitive() {
      return JSON.parse(localStorage.getItem("__IS_DESENSITIVE__"));
    }
  },
  methods: {
    setDesensitive() {
      let isDesensitive = JSON.parse(
        localStorage.getItem("__IS_DESENSITIVE__")
      );
      console.log(isDesensitive, typeof isDesensitive);
      if (isDesensitive) {
        localStorage.setItem("__IS_DESENSITIVE__", false);
      } else {
        localStorage.setItem("__IS_DESENSITIVE__", true);
      }

      this.$router.go(0);
    },
    getUserInfo() {
      let that = this;
      this.$axios.get(this.user_info_url, {}).then(res => {
    
        if (res.data.status_code == 403) {
          that.$message.error("未登录");
          sessionStorage.removeItem("__UID__");
          that.$cookies.remove("__UID__");
          that.$router.push("/login");
        }
        this.avatar_url = res.data.avatar;
        this.username = res.data.username;
        this.nickname = res.data.nickname;
        this.message = res.data.message_count;
        this.total_points = res.data.total_points;
        this.available_points = res.data.available_points;
        this.done_vul_count = res.data.done_vul_count;
        this.todo_vul_count = res.data.todo_vul_count;
        sessionStorage.setItem("userinfo", JSON.stringify(res.data));
        if (res.data.iwmo == 1) {
          that.$watermark.pointMark(this.username);
        }
        console_log(res.data, "NHome");
      });
    },
    handleCommand(command) {
      if (command == "logout") {
        let that = this;
        this.$axios.get("/api/logout").then(res => {
          if (res.data.status == 1) {
            console_log("退出登录")
            sessionStorage.removeItem("__UID__");
            that.$cookies.remove("__UID__");
            this.$router.push("/login");
          } else if (res.data.status == 2) {
            sessionStorage.removeItem("__UID__");
            that.$cookies.remove("__UID__");
            window.location.href = res.data.logout_url;
          } else if (res.data.status_code == 403) {
            sessionStorage.removeItem("__UID__");
            that.$cookies.remove("__UID__");
            this.$router.push("/login");
          } else {
            this.$message.error("退出失败, 错误码:" + res.data.status);
          }
        });
      } else if (command == "n_personal_setting") {
        this.$router.push("/n_personal_setting");
      } else if (command == "n_changepw") {
        this.$router.push("/n_changepw");
      } else if (command == "n_pointrecord") {
        this.$router.push("/n_pointrecord");
      }
    },
    handleSelect(key, keyPath) {
      console_log(key, keyPath);
      this.getUserInfo();
      this.$router.push("/" + key);
    },
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    }
  },

  created() {
    this.getUserInfo();

    bus.$on("updateUserInfo", msg => {
      this.getUserInfo();
    });

    const DEFAULT_LANG = "zh";
    const LOCALE_KEY = "locale_lang";
    const CURRENT_LANG = navigator.language || navigator.userLanguage;

    if (this.lang === undefined) {
      let lang = window.localStorage.getItem(LOCALE_KEY);

      if (lang === undefined) {
        this.lang = DEFAULT_LANG;
      } else {
        this.lang = lang;
        this.$i18n.locale = lang;
      }
    }

    if (this.lang != CURRENT_LANG.split("-")[0]) {
      this.$confirm(
        "检测到您当前的浏览器语言为 [" + CURRENT_LANG + "], 确定切换语言吗?",
        "提示",
        {
          confirmButtonText: "确认(confirm)",
          cancelButtonText: "取消(cancel)",
          type: "warning"
        }
      )
        .then(() => {
          let C_LANG = CURRENT_LANG.split("-")[0];
          if (C_LANG === "zh" || C_LANG === "en") {
            this.lang = C_LANG;
            this.$i18n.locale = C_LANG;
            window.localStorage.setItem(LOCALE_KEY, C_LANG);
          } else {
            this.$i18n.locale = "en";
            window.localStorage.setItem(LOCALE_KEY, "en");
          }
          history.go(0);
        })
        .catch(_ => {
 
        });
    }

    bus.$on("collapse", msg => {
      this.collapse = msg;
    });
 
  }
};
</script>

<style scoped>
.center-content {
  width: 80%;
  padding: 0;
  margin: 0 auto;
}

.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 45px;
  font-size: 15px;
  color: #fff;
  box-shadow: 5px 2px 5px #888888;
}

.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 40px;
}
.header .logo {
  float: left;
  width: 90px;
  line-height: 40px;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 40px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
 
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  margin-left: 12px;
}
.user-avator {
  margin-top: 5px;
  margin-left: 12px;
}
.user-avator-big img:hover {
  transform: scale(5);
 
  border: #303133;
  border: 1px dotted #d0eceb !important;
  animation: 2s opacity2 0s infinite;
  -webkit-animation: 2s opacity2 0s infinite;
  -moz-animation: 2s opacity2 0s infinite;
}
@keyframes opacity2 {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0;
  }
}
@-webkit-keyframes opacity2 {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0;
  }
}
@-moz-keyframes opacity2 {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0;
  }
}
.user-avator img {
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
}

.user-avator-big img {
  display: block;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
 

.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: 2px solid #3e9b87f3 !important;
  color: #303133;
}
 
</style>