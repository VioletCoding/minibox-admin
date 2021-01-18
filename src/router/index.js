import Vue from 'vue';
import VueRouter from 'vue-router';
//解决路由跳转同一路由的报错问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = location => {
    return originalPush.call(this, location).catch(err => err);
}
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
