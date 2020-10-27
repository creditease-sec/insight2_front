<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <el-menu-item
              v-for="(subItem,i) in item.subs"
              :key="i"
              style="line-height:40px;"
              :index="subItem.index"
              v-show="permission_list.contains(subItem.permission)||subItem.permission=='default_show'"
            >
              <i :class="subItem.icon" />
              <span style="font-size:10px !important;">{{ subItem.title }}</span>
            </el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item
            :index="item.index"
            :key="item.index"
            v-if="permission_list.containsList(item.permission)||item.permission=='default_show'"
          >
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
      <el-menu-item index="markdowndoc">
        <hr />
        <div
          style="text-align:center;font-weight: bold;
    color: #606266;"
        >{{!collapse?app_version:app_version.substring(0,2)}}</div>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import bus from "../common/bus";
import { getCookie } from "../../utils/common";
import env from "../../../config/prod.env";
export default {
  data() {
    return {
      collapse: false,
      permission_list: "",
      app_version: env.APP_VERSION,
      items: [
        {
          icon: "iconfont el-icontubiao1",
          index: "dashboard",
          title: this.$t("title.system_index"),
          permission: "default_show"
        },
        {
          icon: "iconfont  el-iconloudong",
          index: "1",
          title: this.$t("title.vul"),
          permission: ["action.vul.VulList", "action.vullog.VulLogList"],
          subs: [
            {
              icon: "iconfont  el-iconloudong2",
              index: "vulns",
              title: this.$t("title.vul"),
              permission: "action.vul.VulList"
            },
            {
              icon: "iconfont  el-iconccgl-tongbucaozuorizhi-4",
              index: "vulnlog",
              title: this.$t("title.log"),
              permission: "action.vullog.VulLogList"
            }
          ]
        },
        {
          icon: "iconfont  el-iconzichan1",
          index: "3",
          title: this.$t("title.asset"),
          permission: ["action.assets.AssetList", "action.app.AppList"],
          subs: [
            {
              icon: "iconfont  el-iconyingyong",
              index: "app",
              title: this.$t("title.app"),
              permission: "action.app.AppList"
            },
            {
              icon: "iconfont  el-iconzichan",
              index: "asset",
              title: this.$t("title.asset"),
              permission: "action.assets.AssetList"
            }
          ]
        },
        {
          icon: "iconfont  el-iconwenzhang1",
          index: "4",
          title: this.$t("title.knowledge"),
          subs: [
            {
              icon: "iconfont el-iconwendangdocument69",
              index: "paper",
              title: this.$t("title.paper"),
              permission: "default_show"
            }
          ]
        },
        {
          icon: "iconfont  el-iconyonghu",
          index: "2",
          title: this.$t("title.user"),
          permission: [
            "action.user.UserList",
            "action.groupuser.GroupUserList",
            "action.role.RoleList"
          ],
          subs: [
            {
              icon: "iconfont  el-iconyonghu",
              index: "user",
              title: this.$t("title.user"),
              permission: "action.user.UserList"
            },
            {
              icon: "iconfont  el-iconjiaose",
              index: "role",
              title: this.$t("title.role"),
              permission: "action.role.RoleList"
            },
            {
              icon: "iconfont el-iconyonghuzu1",
              index: "usergroup",
              title: this.$t("title.group"),
              permission: "action.groupuser.GroupUserList"
            }
          ]
        },
        {
          icon: "iconfont  el-iconzichan",
          index: "5",
          title: this.$t("title.philistine"),
          permission: ["action.point.PointList"],
          subs: [
            {
              icon: "iconfont el-iconjifen1",
              index: "pointrecord",
              title: this.$t("title.point"),
              permission: "action.point.PointList"
            }
            // {icon: 'iconfont  el-iconorder-copy',
            //     index: '404',
            //     title:"订单",
            // },
            // {icon: 'iconfont  el-iconorder-copy',
            //     index: '404',
            //     title:"礼品",
            // },
          ]
        },
        {
          icon: "iconfont el-iconshujupeizhi",
          index: "setting",
          title: this.$t("title.setting"),
          permission: ["action.system.SystemConfig"]
        },
        {
          icon: "iconfont el-iconwendangdocument69",
          index: "doc",
          title: this.$t("title.doc"),
          permission: ["action.system.SystemConfig"],
          subs: [
            {
              icon: "iconfont el-iconwendangdocument69",
              index: "doc",
              title: this.$t("title.doc"),
              permission: "default_show"
            },
            {
              icon: "iconfont el-iconwendangdocument69",
              index: "markdowndoc",
              title: this.$t("title.use"),
              permission: "default_show"
            }
          ]
        },
        {
          icon: "iconfont el-iconapi",
          index: "extension",
          title: this.$t("title.ext"),
          permission: ["action.extension.ExtensionList"],
          subs: [
           {
              icon: "iconfont el-iconapi",
              index: "extension",
              title: this.$t("title.ext"),
              permission: ["action.extension.ExtensionList"]
            },
            // {
            //   icon: "iconfont el-iconwendangdocument69",
            //   index: "cron",
            //   title: this.$t("title.cron"),
            //   permission: "default_show"
            // }
          ]
        },
        

      ]
    };
  },
  methods: {},
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  },
  created() {
    this.permission_list = getCookie("__ROLELIST__")
      ? getCookie("__ROLELIST__")
      : "";
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", msg => {
      this.collapse = msg;
    });
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 40px;
  bottom: 0;
  overflow-y: scroll;
  /* background-color: #324157; */
  -webkit-box-shadow: 5px 2px 5px #888888;
  box-shadow: 8px 5px 10px #c7c6c6;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 125px;
}
.sidebar > ul {
  height: 100%;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 125px;
}
</style>
