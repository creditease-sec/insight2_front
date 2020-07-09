import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios';
import VueI18n from 'vue-i18n'
import ElementUI from 'element-ui'
import VueDragTree from 'vue-drag-tree'
import VTooltip from 'v-tooltip'
import 'echarts'
import ECharts from 'vue-echarts'
import VeeValidate from 'vee-validate'
import VueGoodWizard from 'vue-good-wizard'
import VueResource from 'vue-resource'
import mavonEditor from 'mavon-editor'
import VueQuillEditor from 'vue-quill-editor'
import FullCalendar from 'vue-fullcalendar'
// import {console_log} from './utils/common'
import VueCookies from 'vue-cookies'
import env from "../config/prod.env";
/*CSS样式*/
import 'vue-drag-tree/dist/vue-drag-tree.min.css'
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
import "babel-polyfill";
import 'codemirror/lib/codemirror.css'
import 'static/css/iconfont.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import 'mavon-editor/dist/css/index.css'

import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
import marked from 'marked'
import filterXSS from 'xss'
filterXSS.whiteList['input'] = ['type', 'src', 'disabled', 'checked', 'class']
filterXSS.whiteList['img'] = ['src', 'alt', 'title', 'width', 'max-width', 'style', 'height']
filterXSS.whiteList['math'] = []
filterXSS.whiteList['semantics'] = []
filterXSS.whiteList['mrow'] = []
filterXSS.whiteList['mtext'] = []
filterXSS.whiteList['annotation'] = ['encoding']
filterXSS.whiteList['msub'] = []
filterXSS.whiteList['mi'] = []
filterXSS.whiteList['mo'] = []
filterXSS.whiteList['mn'] = []
filterXSS.whiteList['li'] = ['class']
filterXSS.whiteList['span'] = ['class', 'title', 'aria-hidden', 'style']
filterXSS.whiteList['code'] = []
filterXSS.whiteList['li'] = ['class', 'id']
filterXSS.whiteList['td'] = ['style', 'class']
filterXSS.whiteList['p'] = ['style', 'class']
filterXSS.whiteList['div'] = ['style', 'class']
filterXSS.whiteList['a'] = ['style', 'class', 'id', 'target', 'href', 'title']
filterXSS.stripIgnoreTag = true
Vue.prototype.filterXSS = filterXSS;
Vue.prototype.marked = marked;

if (env.DIST=="YX"){
  console.log("启用 Sentry")
  Sentry.init({
    dsn: 'http://3e70606073e949289d2192d9b1bada4a@10.143.135.72:9000/2',
    integrations: [new Integrations.Vue({Vue, attachProps: true})],
  });
}

/* Vue. Use*/
Vue.use(ElementUI, { size: 'small' });
Vue.use(VueI18n);
Vue.use(VueDragTree)
Vue.use(VTooltip)
Vue.component('v-chart', ECharts)
Vue.use(VeeValidate, {
    fieldsBagName: 'veefields'       //此处默认为fields
  }); 
Vue.use(VueGoodWizard);
Vue.use(VueResource)
Vue.use(VueQuillEditor, /* { default global options } */)
Vue.use(mavonEditor);
Vue.use(FullCalendar)
Vue.use(VueCookies)
/*  初始化配置*/
import {
  gc
} from "@/utils/global_config";
import {getCookie,desensitive, console_log} from "./utils/common";
import watermark from "./utils/watermark";

Vue.prototype.$watermark = watermark
Vue.prototype.$desensitive = desensitive
Vue.prototype.gc = gc

gc(true)

/*  Axios拦截器 */
import { Loading } from 'element-ui';

// 超时时间
axios.defaults.timeout = 15000;

// http请求拦截器
axios.interceptors.request.use(config => {
  Vue.prototype.$loading = Loading.service({ 
    // fullscreen: true,
    // lock: true,
    text: '加载中',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.4)'
});
  return config
}, error => {
  setTimeout(() => {
    Vue.prototype.$loading.close()
  },3000)
  return Promise.reject(error)
})

// http响应拦截器
axios.interceptors.response.use(response => {// 响应成功关闭loading
    if(response.data.data && response.data.data.ecode == '401') {
        Vue.prototype.$loading.close()
        router.replace({
            path: '/login',
            // query: {redirect: router.currentRoute.fullPath}//登录成功后跳入浏览的当前页面
        })
      }else{
        Vue.prototype.$loading.close()
        return response;
      }
  return data
}, error => {
  setTimeout(() => {
    Vue.prototype.$loading.close()
  },1000)
  return Promise.reject(error)
})

Vue.prototype.$axios = axios;

/*  i18n支持 */
const i18n = new VueI18n({
  locale: 'zh', 
  messages : {
    'zh': require('./common/i18n/zh.json'),
    'en': require('./common/i18n/en.json')
  }
})


let router_set = new Set()
router_set.add("loginHandler")
var async_routers = [

  {
    name: "loginHandler",
    route: {
      path: '/666',
      component: resolve => require(['./components/page/Login.vue'], resolve)
    }
  }
];

let filtered_routers = async_routers.map(function(value,index,array){  
  if (router_set.has(value["name"]) )
   return value["route"]
});

//console.log(filtered_routers)


function set_hook(){
    router.addRoutes(
      filtered_routers
    )
 
    router.beforeEach((to, from, next) => {
 
        let username =  sessionStorage.getItem('__UID__');
        
        if(!username){
            username = document.cookie.indexOf("__UID__")>-1?"isLogin":false;
        }
        
         if(!username && to.path !== '/login'){
            // next('/login');
            router.push({
              path:"/login",
              query:{redirect:to.fullPath}
            })
          
        } else if(username && to.path == '/login'){
    
          next('/n_my_vulns');
        
        } else if(to.meta.permission){
       
          username && getCookie("__ROLELIST__")!=null && getCookie("__ROLELIST__").indexOf("action.user.UserAdd") > -1 ? next() : next('/403');
        }else{

            // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
            if(navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor'){
                Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                    confirmButtonText: '确定'
                });
            }else{
                next();
            }
        }
    })
}

set_hook()

new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#app');


