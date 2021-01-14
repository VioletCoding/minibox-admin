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

//校验权限
function checkAuthentication() {
    let token = localStorage.getItem("accessToken");
    let tempToken = sessionStorage.getItem("accessToken");

    if (token == "" || token == null || token == undefined) return false;
    else return true;

    if (tempToken == "" || tempToken == null || tempToken == undefined) return false;
    else return true;
}

//路由前置守卫
router.beforeEach((to, from, next) => {
    if (to.name != "MyAdminLogin" && !checkAuthentication()) next({name: "MyAdminLogin"})
    else next()
})

export default router;
