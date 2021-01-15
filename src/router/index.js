import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "MyAdmin",
        redirect: "/index",
        component: () => import("@/views/admin/MyAdmin"),
        children: [
            {
                //登录页
                path: "login",
                name: "MyAdminLogin",
                component: () => import("@/views/admin/MyAdminLogin")
            }
            ,
            {
                //首页
                path: "index",
                name: "MyAdminIndex",
                component: () => import("@/views/admin/index/MyIndex")
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
