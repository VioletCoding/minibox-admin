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
                path:"userList",
                name:"MyAdminUserList",
                component: () => import("@/views/admin/index/main/user/MyUserList")
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
