import Vue from 'vue';
import App from './App.vue';
import router from './router';
import util from "@/api/util";
/**************************Antd**************************/
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

Vue.use(Antd);
/**************************Axios**************************/
import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.use(VueAxios, axios);

/**************************EChars**************************/
import ECharts from 'vue-echarts';

Vue.prototype.$echarts = ECharts;
Vue.use(ECharts);
/**************************nprogress 加载进度条**************************/
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({showSpinner: false, minimum: 0.2});
/**************************Vue Config**************************/
Vue.config.productionTip = false;
let infiniteScroll = require("vue-infinite-scroll");
Vue.use(infiniteScroll);
new Vue({router, render: h => h(App)}).$mount('#app');

//请求的地址
//axios.defaults.baseURL = "http://192.168.0.105:20001/";
axios.defaults.baseURL = "http://violetevergardenback.cn1.utools.club";
axios.defaults.timeout = 30000;
//请求拦截器
axios.interceptors.request.use(
    config => {
        config.headers['Content-Type'] = 'application/json;charset=UTF-8';
        let token = localStorage.getItem("accessToken");
        config.headers["accessToken"] = token;
        if (token == "" || token == null || token == undefined) {
            config.headers["accessToken"] = sessionStorage.getItem("accessToken");
        }
        return config;
    },
    err => Promise.reject(err)
);
//响应拦截器
axios.interceptors.response.use(
    resp => {
        return resp;
    },
    error => {
        let status = error.response.status;
        if (status == 401) {
            util.removeAllAuthenticate();
            router.replace("/login");
        }
        return Promise.reject(error);
    });

//路由前置守卫
router.beforeEach((to, from, next) => {
    if (to.name != "MyAdminLogin" && !util.isLoginUserTokenExist()) {
        next({name: "MyAdminLogin"})
    } else {
        NProgress.start();
        next();
    }
})
//路由后置守卫
router.afterEach(transition => {
    NProgress.done();
})
