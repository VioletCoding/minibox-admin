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
