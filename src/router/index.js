import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
    {
        //首页
        path: "/",
        name: "MyAdmin",
        redirect:"/login",
        component: () => import("@/views/admin/MyAdmin"),
        children: [
            {
                //登录页
                path: "login",
                name: "MyAdminLogin",
                component: () => import("@/views/admin/MyAdminLogin")
            }
        ]
    }
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

export default router;
