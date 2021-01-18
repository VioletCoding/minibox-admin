import Vue from 'vue';
import App from './App.vue';
import router from './router';

/**************************Ant**************************/
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

NProgress.configure({showSpinner: false, minimum: 0.2})
/**************************Vue Config**************************/
Vue.config.productionTip = false;
let infiniteScroll = require("vue-infinite-scroll");
Vue.use(infiniteScroll);

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');


axios.defaults.baseURL = "http://192.168.0.105:20001/";
axios.defaults.timeout = 5000;
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
        // TODO 响应拦截器
        if (status == 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("userId");
            sessionStorage.removeItem("accessToken");
            sessionStorage.removeItem("userId");
            router.replace("/login")
        }
        return Promise.reject(error);
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
    else {
        NProgress.start();
        next();
    }
})
//路由后置守卫
router.afterEach(transition => {
    NProgress.done();
})

