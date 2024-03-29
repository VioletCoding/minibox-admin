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
                //个人中心
                path: "personal",
                name: "MyPersonalCenter",
                component: () => import("@/views/admin/index/main/user/MyPersonalCenter")
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
            },
            {
                //帖子列表
                path: "postList",
                name: "MyAdminPostList",
                component: () => import("@/views/admin/index/main/post/MyPostList")
            },
            {
                //版块列表
                path: "blockList",
                name: "MyAdminBlockList",
                component: () => import("@/views/admin/index/main/block/MyBlockList")
            },
            {
                //标签管理
                path: "tagList",
                name: "MyTagList",
                component: () => import("@/views/admin/index/main/tag/MyTagList")
            },
            {
                //游戏图片管理
                path: "photoList",
                name: "MyPhotoList",
                component: () => import("@/views/admin/index/main/game/MyPhotoList")
            }
        ]
    },

];


const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
    //平滑滚动
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return {
                selector: to.hash,
                behavior: 'smooth',
            }
        }
    }
});

export default router;
