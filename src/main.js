// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import moment from 'moment'
import { Message } from 'element-ui'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import SIdentify from './components/identify'

import md5 from 'js-md5'

import iView from 'iview'
import 'iview/dist/styles/iview.css'

import axios from 'axios'
import qs from 'qs'
Vue.prototype.$axios = axios
axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.headers.common['token'] = sessionStorage.getItem('token')
// Vue.prototype.httpUrl = "https://nqi.gmcc.net:20443/pro-dtn-server"; //广东预发环境后台地址
// Vue.prototype.httpUrl = "https://nqi.gmcc.net:20443/pre-dtn-server"; //广东测试环境后台地址
// DTN北京常用外网版本地址
// Vue.prototype.httpUrl = 'http://218.205.192.26:8070/dtn' //院内后台地址
// Vue.prototype.imgUrl = 'http://218.205.192.26:8070' //img地址，广州。

// Vue.prototype.httpUrl = 'http://172.168.40.47:9201' //院内后台地址
// Vue.prototype.imgUrl = 'http://172.168.40.47:9201' //img地址，广州。

// 测试环境
Vue.prototype.httpUrl = 'http://10.254.218.124:8091/dtn' //院内后台地址
Vue.prototype.imgUrl = 'http://10.254.218.124:8091' //img地址，广州。

//  Vue.prototype.httpUrl = "http://10.254.218.107:8091/dtn";
//  Vue.prototype.imgUrl = 'http://10.254.218.107:8091'  // 移动内网地址

//  http://bjkyhx2.tpddns.cn:40003/  // 折腾云
// Vue.prototype.httpUrl = 'http://bjkyhx2.tpddns.cn:40003/dtn' 
// Vue.prototype.imgUrl = 'http://bjkyhx2.tpddns.cn:40003' 

Vue.directive('has', {
    inserted(el, binding, vnode) {
        // console.log('has====》', el, binding, vnode)
    //获取缓存的按钮数组
    //   const data = vnode.context.$route.meta.btnPermissions
    // console.log(vnode.context.$route.path+'')
    const data = sessionStorage.getItem((vnode.context.$route.path).toString()).split(',')
    //   console.log('111', data)
    //   var array = JSON.parse(data)
    //   console.log('222', array)
      const str = binding.value.split('_')
    //   console.log('333', str)
      // 不存在则隐藏
    //   console.log('console====>', data, data.indexOf(binding.value))
      if (data === null || data.indexOf(binding.value) === -1) {
        // el.parentNode.removeChild(el);
        el.style.display = 'none'
      }
    }
})
// http://bjkyhx.tpddns.cn:40003/
// Vue.prototype.httpUrl = "http://10.254.187.96:9201";
// // DTN北京常用内网版本地址。设计院服务器内网IP，请将所有IP修改为10.254.221.145  端口：8090  http://10.254.221.145:8090/dtn
// Vue.prototype.httpUrl = "http://10.254.221.145:8090/dtn"
// Vue.prototype.imgUrl = 'http://10.254.221.145:8090' //img地址，广州。

// 湖北内网地址
// Vue.prototype.httpUrl = "http://10.25.225.90:8070/dtn";
// Vue.prototype.imgUrl = 'http://10.25.225.90:8070'  // 湖北内网地址

Vue.prototype.$moment = moment
axios.defaults.withCredentials = true

Vue.use(ElementUI, { locale })
Vue.use(iView)
Vue.use(SIdentify)

Vue.config.productionTip = false

Vue.prototype.$qs = qs

// window.CONFIG = {
//   ipAndPort: "nqi.gmcc.net:20443",
//   protocol: "https://"
// };
// var url1 = window.location.href.split("/")[3];
// var url = "";
// if (url1 == "pre-dtn-specializedanalysis" || url1 == "pre-simulationplan") {
//   url = CONFIG.protocol + CONFIG.ipAndPort + "/pre-dtn-specializedanalysis";
// } else if (
//   url1 == "dev-dtn-specializedanalysis" ||
//   url1 == "dev-simulationplan"
// ) {
//   url = CONFIG.protocol + CONFIG.ipAndPort + "/dev-dtn-specializedanalysis";
// } else if (url1 == "pro-dtn-specializedanalysis" || url1 == "simulationplan") {
//   url = CONFIG.protocol + CONFIG.ipAndPort + "/pro-dtn-specializedanalysis";
// }
// Vue.prototype.httpUrl = url; //广州的接口请求地址，逻辑判断
// Vue.prototype.httpUrl = url;
Vue.prototype.$md5 = md5

// 判断token拦截;
axios.interceptors.request.use(
    config => {
        if (sessionStorage.getItem('token')) {
            // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.Authorization = `${sessionStorage.getItem('token')}`
            config.headers.token = `${sessionStorage.getItem('token')}`
        }else{
            // 如果不存在token
            router.push('/login')
        }
        return config
    },
    err => {
        return Promise.reject(err)
    }
)

// 拦截如果返回是用户未登录状态直接跳转login页面
axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        if (error && error.response && error.response.data && (error.response.data.error == '用户未登录' || error.response.data.error == '无效的 Token，无法解析')) {
            Message({
                //饿了么的消息弹窗组件,类似toast
                showClose: true,
                message: error.response.data.error,
                type: 'error'
            })
            sessionStorage.removeItem('token') //清除token缓存
            sessionStorage.removeItem('user') // 清除用户ID
            localStorage.removeItem('arr')
            router.push('/nokia')
        }
        return Promise.reject(error)
    }
)

// 判断路由拦截;
router.beforeEach((to, from, next) => {
    console.log('路由拦截====》', 'to===>',to, 'to.query.q', to.query, 'from===>',from)
    let token = ''
    if(to.path == '/nokia') {
        let token = '16260783b0ed8b2b27a268abd4bdf97eacea867857503'.slice(6, 38)
        // let token = to.query.p.slice(6, 33)
        console.log('getToken=====>', token)
        if(to.query.q !== undefined && to.query.q.slice(6, 38) === '83b0ed8b2b27a268abd4bdf97eacea86') {
            sessionStorage.setItem('token', '123456789kkkk')
        }
    }
    console.log('token======>',  sessionStorage.getItem('token'))
    if (to.meta.requireAuth) {
        if (sessionStorage.getItem('token')) {
            // 判断本地是否存在token
            next()
        }else {
            // 未登录,跳转到登陆页面
            next({
                path: '/home'
            })
        }
    } else {
        if (sessionStorage.getItem('token')) {
            next('/home')
        } else {
            next()
        }
    }
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    axios,
    qs,
    components: { App },
    template: '<App/>'
})
