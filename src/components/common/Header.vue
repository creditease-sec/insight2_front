<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn insight2_logo" @click="collapseChage">
            <img    style="height:20px;width:20px;margin-right:5px;margin-top:10px;" src="static/img/logo.png">
        </div>
        <div class="logo"><img src="static/img/insight_2_logo.png" style="height:13px;margin-top:5px;"></div>
        <div class="header-right">
            <div class="header-user-con">
                             <div class=""  style="margin-top:8px;margin-right:5px;cursor:pointer;font-size:18px;">
                            <el-tooltip effect="dark" :content="!isDesensitive?'前端脱敏':'取消前端脱敏'" placement="bottom">
                <span @click="setDesensitive()" style="margin-right: 1em;margin-top:5px;"> <span v-show="!isDesensitive"><svg t="1577780413607" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2170" width="15" height="15"><path d="M391.529412 262.144c30.117647-12.047059 60.235294-18.070588 90.352941-18.070588 120.470588 0 216.847059 96.376471 216.847059 216.847059 0 30.117647-6.023529 60.235294-18.070588 90.352941l126.494117 126.494117c66.258824-54.211765 120.470588-126.494118 156.611765-210.823529-78.305882-192.752941-259.011765-325.270588-481.882353-325.270588-66.258824 0-126.494118 12.047059-180.705882 36.141176l90.352941 84.329412z"  p-id="2171"></path><path d="M481.882353 334.426353h-18.070588l150.588235 150.588235v-18.070588c-6.023529-78.305882-60.235294-132.517647-132.517647-132.517647zM825.223529 804.261647L84.329412 63.367529l-60.235294 60.235295 126.494117 126.494117c-60.235294 54.211765-120.470588 132.517647-150.588235 210.82353 78.305882 192.752941 259.011765 325.270588 481.882353 325.270588 66.258824 0 126.494118-12.047059 180.705882-36.141177l108.42353 108.42353 54.211764-54.211765z m-343.341176-120.470588c-120.470588 0-216.847059-96.376471-216.847059-216.847059 0-30.117647 6.023529-60.235294 18.070588-90.352941l72.282353 72.282353v18.070588c0 72.282353 60.235294 132.517647 132.517647 132.517647h18.070589l60.235294 66.258824c-24.094118 12.047059-54.211765 18.070588-84.329412 18.070588z" fill="#3e9b87f3" p-id="2172"></path></svg>  </span> 
                <span v-show="isDesensitive">   <svg t="1577780696858" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2283" width="15" height="15"><path d="M512 160c-230.4 0-428.8 147.2-512 345.6 83.2 204.8 275.2 345.6 512 345.6s428.8-147.2 512-345.6c-83.2-198.4-281.6-345.6-512-345.6z m0 582.4C384 742.4 281.6 640 281.6 512S384 275.2 512 275.2s230.4 102.4 230.4 230.4S640 742.4 512 742.4z m0-371.2c-76.8 0-140.8 64-140.8 140.8s64 140.8 140.8 140.8 140.8-64 140.8-140.8-64-140.8-140.8-140.8z" fill="#3e9b87f3" p-id="2284"></path></svg></span> 
             
                </span>
                       </el-tooltip>
              </div>
                    <div class=""  style="margin-top:5px;margin-right:5px;cursor:pointer;font-size:18px;">
                          <el-tooltip effect="dark" :content="'我的日程'" placement="bottom">
                <span @click="$router.push('calendar')"><i class="iconfont el-iconricheng4"></i> </span>
                       </el-tooltip>
              </div>
              <div class=""  style="margin-top:5px;margin-right:0px;cursor:pointer;font-size:18px;">
                <el-tooltip effect="dark" :content="'假的二维码，其实是CVSS计算'" placement="bottom">
                <span @click="$router.push('cvss')"><i class="iconfont el-iconqrcode"></i> </span>
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
                    <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
                        <router-link to="/notification">
                            <i class="el-icon-message-solid" style="margin-top: 8px;height: 31px;font-size:18px;"></i>
                        </router-link>
                    </el-tooltip>
                    <span class="btn-bell-badge" v-if="message"></span>
                </div>
                <!-- 用户头像 -->
                <div class="user-avator"><img src="static/img/logo.png"></div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                       {{nickname?nickname:username?username:"-"}} <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item   command="keygen">API v1 KEY生成</el-dropdown-item>
                        <el-dropdown-item   command="changepw">修改密码</el-dropdown-item>
                        <el-dropdown-item   command="to_frontend">前台      </el-dropdown-item>
                        <el-dropdown-item divided  command="loginout">  <i class="iconfont el-tuichu1"/> {{$t("label.exit")}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script>
import bus from "../common/bus";


export default {
  data() {
    return {
      collapse: false,
      fullscreen: false,
      username:null,
      nickname:null,
      avatar_url:null,
      message: 0,
      user_info_url:"api/user/info"
    };
  },
  computed: {
    isDesensitive(){
      return JSON.parse(localStorage.getItem("__IS_DESENSITIVE__"))
    }
  },
  methods: {
    setDesensitive(){
          let isDesensitive  = JSON.parse(localStorage.getItem("__IS_DESENSITIVE__"))
          console.log(isDesensitive,typeof isDesensitive)
          if(isDesensitive){
                    localStorage.setItem('__IS_DESENSITIVE__',false)
          }else{
                    localStorage.setItem('__IS_DESENSITIVE__',true)
          }
    
        this.$router.go(0)
    },
    getUserInfo(){
      let that = this
      this.$axios
        .get(this.user_info_url, {
        })
        .then(res => {
          if(res.data.status_code == 403){
              console.log("未登录");
              sessionStorage.removeItem("__UID__");
              that.$cookies.remove("__UID__");
              that.$router.push("/login");
          }
          this.avatar_url = res.data.avatar
          this.username = res.data.username
          this.nickname = res.data.nickname
          this.message = res.data.message_count
          sessionStorage.setItem("userinfo", JSON.stringify( res.data));
 
         if(res.data.iwmo == 1){
          that.$watermark.pointMark(this.username)
        }
        });
    },
    handleCommand(command) {
      let that  = this;
      if (command == "loginout") {
        this.$axios.get("/api/logout").then(res => {
          if (res.data.status == 1) {
            sessionStorage.removeItem("__UID__");
            that.$cookies.remove("__UID__")
            this.$router.push("/login");
          } else if (res.data.status == 2){
            sessionStorage.removeItem("__UID__");
            that.$cookies.remove("__UID__")
            window.location.href = res.data.logout_url 
          }
          else {
            this.$message.error("退出失败, 错误码:" + res.data.status);
          }
        });
      }else       if (command == "changepw") {
            this.$router.push("/changepw")
      }else       if (command == "keygen") {
            this.$router.push("/keygen")
      }else       if (command == "to_frontend") {
            this.$router.push("/n_paper")
      }

    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      localStorage.setItem("is_collapse",this.collapse);
      bus.$emit("collapse", this.collapse);
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();        } else if (document.webkitCancelFullScreen) {
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
    updated() {
    this.$desensitive()
  },
  mounted() {

    this.getUserInfo()

      bus.$on("updateUserInfo", msg => {
            this.getUserInfo()
      });
      
    if (document.body.clientWidth < 1500) {
          this.collapse =true;
          bus.$emit("collapse", this.collapse);
    }

    if  ( localStorage.getItem("is_collapse",this.collapse) == "true"){
          this.collapse =true;
          bus.$emit("collapse", this.collapse);
    }else if ( localStorage.getItem("is_collapse",this.collapse) === "false"){
          this.collapse =false;
          bus.$emit("collapse", this.collapse);
    }
  }
};
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 37px;
  font-size: 15px;
  color: #fff;
    -webkit-box-shadow: 5px 2px 2px #888888;
    box-shadow: 5px 2px 2px #888888;
}
.header:hover{
    -webkit-box-shadow: 5px 2px 5px #888888;
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
  width: 250px;
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
.user-avator img {
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
}
.el-dropdown-menu__item {
  text-align: center;
}
.insight2_logo:hover, .insight2_logo:focus, .insight2_logo:active {
    transform: scale(1.2);
    transition-timing-function: cubic-bezier(0.47, 2.02, 0.31, -0.36); /*cubic-bezier 自定义过渡效果的速度曲线*/
}

.insight2_logo {
  transition-duration: 0.5s;
}
</style>
