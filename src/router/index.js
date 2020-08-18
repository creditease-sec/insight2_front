import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

export const constantRouterMap = [
    {
        path: '/',
        redirect: '/n_my_vulns'
    },
    {
        path: '/admin',
        redirect: '/dashboard'
    },
    {
        path: '/',
        component: resolve => require(['../components/common/Home.vue'], resolve),
        meta: { title: '主页' },
        children: [
            {
                path: '/dashboard',
                component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                meta: { title: "System", noKeepAlive: true, permission: true }
            },
            {
                path: '/cron',
                name: 'cron',
                component: resolve => require(['../components/page/cron/Cron.vue'], resolve),
                meta: { title: "Cron", noKeepAlive: true }
            },
            {
                path: '/view_asset_detail',
                name: 'view_asset_detail',
                component: resolve => require(['../components/page/asset/subpage/ViewAssetDetail.vue'], resolve),
                meta: { title: "ViewAssetDetail", noKeepAlive: true }
            },
            {
                path: '/user',
                name: 'user',
                component: resolve => require(['../components/page/user/User.vue'], resolve),
                meta: { title: "User" }
            },
            {
                path: '/role',
                name: 'role',
                component: resolve => require(['../components/page/user/Role.vue'], resolve),
                meta: { title: "Role" }
            },
            {
                path: '/usergroup',
                name: 'usergroup',
                component: resolve => require(['../components/page/user/UserGroup.vue'], resolve),
                meta: { title: "UserGroup" }
            },
            {
                path: '/editgroupuser',
                name: 'editgroupuser',
                component: resolve => require(['../components/page/user/subpage/EditGroupUser.vue'], resolve),
                meta: { title: "EditGroupUser", noKeepAlive: true }
            },
            {
                path: '/setting',
                name: 'setting',
                component: resolve => require(['../components/page/Setting.vue'], resolve),
                meta: { title: "Setting", noKeepAlive: true }
            },
            {
                path: '/editldap',
                name: 'editldap',
                component: resolve => require(['../components/page/setting/subpage/EditLdap.vue'], resolve),
                meta: { title: "EditLdap" }
            },
            {
                path: '/vulns',
                name: 'vulns',
                component: resolve => require(['../components/page/vulns/Vulns.vue'], resolve),
                meta: { title: "Vulns" }
            },
            {
                path: '/vulnlog',
                name: 'vulnlog',
                component: resolve => require(['../components/page/vulns/VulnLog.vue'], resolve),
                meta: { title: "VulnLog" }
            },
            {
                path: '/cvss',
                name: 'cvss',
                component: resolve => require(['../components/page/vulns/CVSS.vue'], resolve),
                meta: { title: "CVSS" }
            },
            {
                path: '/asset',
                name: 'asset',
                component: resolve => require(['../components/page/asset/Asset.vue'], resolve),
                meta: { title: "Asset", noKeepAlive: true }
            },
            {
                path: '/asset_import',
                name: 'asset_import',
                component: resolve => require(['../components/page/asset/subpage/AssetImport.vue'], resolve),
                meta: { title: "AssetImport", noKeepAlive: true }
            },
            {
                path: '/app',
                name: 'app',
                component: resolve => require(['../components/page/asset/App.vue'], resolve),
                meta: { title: "App" , noKeepAlive: true}
            },
            {
                path: '/doc',
                name: 'doc',
                component: resolve => require(['../components/page/doc/Doc.vue'], resolve),
                meta: { title: "Doc" }
            },
            {
                path: '/viewvulndetail',
                name: 'viewvulndetail',
                component: resolve => require(['../components/page/vulns/subpage/ViewVulnDetail.vue'], resolve),
                meta: { title: "ViewVulnDetail", noKeepAlive: true }
            },
            {
                path: '/viewpaperdetail',
                name: 'viewpaperdetail',
                component: resolve => require(['../components/page/knowledge/subpage/ViewPaperDetail.vue'], resolve),
                meta: { title: "ViewPaperDetail", noKeepAlive: true }
            },
            {
                path: '/pointrecord',
                name: 'pointrecord',
                component: resolve => require(['../components/page/philistine/PointRecord.vue'], resolve),
                meta: { title: "PointRecord" }
            },
            {
                path: '/paper',
                name: 'paper',
                component: resolve => require(['../components/page/knowledge/Paper.vue'], resolve),
                meta: { title: "Paper" }
            },
            {
                path: '/extension',
                name: 'extension',
                component: resolve => require(['../components/page/extension/Extension.vue'], resolve),
                meta: { title: "Extension" }
            },
            {
                path: '/extensionlog',
                name: 'extensionlog',
                component: resolve => require(['../components/page/extension/ExtensionLog.vue'], resolve),
                meta: { title: "ExtensionLog" }
            },
            {
                path: '/notification',
                component: resolve => require(['../components/page/Notification.vue'], resolve)
            },
            {
                path: '/changepw',
                name: 'changepw',
                component: resolve => require(['../components/page/user/ChangePW.vue'], resolve),
                meta: { title: "ChangePW" }
            },
            {
                path: '/keygen',
                name: 'keygen',
                component: resolve => require(['../components/page/doc/KeyGen.vue'], resolve),
                meta: { title: "KeyGen" }
            },
            {
                path: '/calendar',
                name: 'calendar',
                component: resolve => require(['../components/page/Calendar.vue'], resolve),
                meta: { title: "Calendar" }
            },
            {
                path: '/markdowndoc',
                name: 'markdowndoc',
                component: resolve => require(['../components/page/doc/MarkdownDoc.vue'], resolve),
                meta: { title: "MarkdownDoc" }
            }



        ]
    },
    {
        path: '/login',
        component: resolve => require(['../components/page/Login.vue'], resolve)
    },
    {
        path: '/nuser',
        component: resolve => require(['../components/common/NHome.vue'], resolve),
        children: [
            {
                path: '/n_dashboard',
                component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                meta: { title: "System" }
            },
            {
                path: '/n_open_vulns',
                name: 'n_open_vulns',
                component: resolve => require(['../components/page/personal/OpenVulns.vue'], resolve),
                meta: { title: "OpenVulns", noKeepAlive: true }
            },
            {
                path: '/n_my_vulns',
                name: 'n_my_vulns',
                component: resolve => require(['../components/page/personal/MyVuls.vue'], resolve),
                meta: { title: "MyVulns", noKeepAlive: true }
            },
            {
                path: '/n_my_done_vulns',
                name: 'n_my_done_vulns',
                component: resolve => require(['../components/page/personal/MyDoneVuls.vue'], resolve),
                meta: { title: "MyDoneVulns", noKeepAlive: true }
            },

            {
                path: '/n_paper',
                name: 'n_paper',
                component: resolve => require(['../components/page/personal/Paper.vue'], resolve),
                meta: { title: "Paper", noKeepAlive: true }
            },
            {
                path: '/n_viewpaperdetail',
                name: 'n_viewpaperdetail',
                component: resolve => require(['../components/page/personal/subpage/ViewPaperDetail.vue'], resolve),
                meta: { title: "ViewPaperDetail", noKeepAlive: true }
            },
            {
                path: '/n_viewvulndetail',
                name: 'n_viewvulndetail',
                component: resolve => require(['../components/page/personal/subpage/ViewVulnDetail.vue'], resolve),
                meta: { title: "ViewVulnDetail", noKeepAlive: true }
            },
            {
                path: '/n_notification',
                component: resolve => require(['../components/page/Notification.vue'], resolve)
            },
            {
                path: '/n_personal_setting',
                component: resolve => require(['../components/page/user/PersonalSetting.vue'], resolve)
            },
            {
                path: '/n_pointrecord',
                name: 'n_pointrecord',
                component: resolve => require(['../components/page/personal/PointRecord.vue'], resolve),
                meta: { title: "PointRecord" }
            },
            {
                path: '/n_changepw',
                name: 'n_changepw',
                component: resolve => require(['../components/page/user/ChangePW.vue'], resolve),
                meta: { title: "ChangePW" }
            },
        ]
    },
    {
        path: '/404',
        component: resolve => require(['../components/page/404.vue'], resolve)
    },
    {
        path: '/403',
        component: resolve => require(['../components/page/403.vue'], resolve)
    },
    {
        path: '*',
        redirect: '/404'
    }
]

export default new Router({
    routes: constantRouterMap
})

export const asyncRouterMap = [
    {
        path: '/test_async_route',
        component: resolve => require(['../components/page/Login.vue'], resolve),
        children: [

        ]
    },
    { path: '*', redirect: '/404', hidden: true }
]