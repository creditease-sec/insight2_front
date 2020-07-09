<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <div class="content">
                <transition name="move" mode="out-in">
            <div v-if="$route.meta.noKeepAlive">
                     <router-view ></router-view> 
                    </div>
                    <div v-else>
                           <keep-alive>
                        <router-view></router-view>
                      </keep-alive>
                  
                    </div>

                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import vHead from "./Header.vue";
import vSidebar from "./Sidebar.vue";
import bus from "./bus";

export default {
  data() {
    return {
      collapse:   false
    };
  },
  components: {
    vHead,
    vSidebar,
  },
  created() {
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
          confirmButtonText: '确认(confirm)',
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
            window.localStorage.setItem(LOCALE_KEY, "zh");
            if("en-US".indexOf(CURRENT_LANG) == -1 ){
                history.go(0);
            }

        });
    }

    bus.$on("collapse", msg => {
      this.collapse = msg;
    });


  }
};
</script>
