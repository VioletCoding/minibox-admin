import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false
Vue.use(Antd);
/**************************Axios**************************/
Vue.use(VueAxios, axios)
axios.defaults.baseURL = "http://192.168.0.105:20001/";
axios.defaults.timeout = 5000;
//请求拦截器
axios.interceptors.request.use(
    config => {
        config.headers['Content-Type'] = 'application/json;charset=UTF-8';
        config.headers["accessToken"] = localStorage.getItem("accessToken");
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
        return Promise.reject(error);
    });


new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
