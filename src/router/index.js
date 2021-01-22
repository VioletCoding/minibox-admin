import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
    {
        //登录页
        path: "/login",
        name: "MyAdminLogin",
        component: () => import("@/views/admin/MyAdminLogin")
    },
    {
        path: "/",
        name: "MyAdmin",
        redirect: "/home",
        component: () => import("@/views/admin/MyAdmin"),
        children: [
            {
                //首页
                path: "home",
                name: "MyAdminHome",
                component: () => import("@/views/admin/index/main/MyHome")
            },
            {
                //用户列表
                path: "userList",
                name: "MyAdminUserList",
                component: () => import("@/views/admin/index/main/user/MyUserList")
            },
            {
                //角色列表
                path: "roleList",
                name: "MyAdminRoleList",
                component: () => import("@/views/admin/index/main/user/MyRoleList")
            },
            {
                //菜单列表
                path: "menuList",
                name: "MyAdminMenuList",
                component: () => import("@/views/admin/index/main/menu/MyMenuList")
            },
            {
                //游戏列表
                path: "gameList",
                name: "MyAdminGameList",
                component: () => import("@/views/admin/index/main/game/MyGameList")
            }
        ]
    },

];


const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

export default router;
