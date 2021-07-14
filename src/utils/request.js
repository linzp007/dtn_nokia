import axios from 'axios'
import { Notification } from 'element-ui'

// 创建axios实例
const service = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? 'http://' + window.location.hostname + ':' + window.location.port + '/dtn' : '/api', // api 的 base_url,
    timeout: 100000, // 请求超时时间
    withCredentials: true
})

// request拦截器
service.interceptors.request.use(
    config => {
        if (sessionStorage.getItem('token')) {
            console.log('login====>', sessionStorage.getItem('token'))
            // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers['Authorization'] = sessionStorage.getItem('token')
            config.headers['token'] = sessionStorage.getItem('token')
            config.headers.common['token'] = sessionStorage.getItem('token')
        }
        config.headers['Content-Type'] = 'application/json;charset=UTF-8'
        return config
    },
    error => {
        // Do something with request error
        console.log(error) // for debug
        Promise.reject(error)
    }
)

// response 拦截器
service.interceptors.response.use(
    // 根据返回的code值来做不同的处理（和后端约定）
    response => {
        const code = response.data.code
        if (code !== undefined && code !== 0 && code !== 200) {
            Notification.error({
                title: response.data.msg
            })
            return Promise.reject('error')
        } else {
            return response.data
        }
    },
    error => {
        let code = 0
        try {
            if (!error.response.data.status) {
                code = error.response.data.code
            } else {
                code = error.response.data.status
            }
        } catch (e) {
            if (error.toString().indexOf('Error: timeout') !== -1) {
                Notification.error({
                    title: '网络请求超时',
                    duration: 5000
                })
                return Promise.reject(error)
            }
        }
        if (code) {
            const errorSysMsg = error.response.message
            const errorUserMsg = error.response.data.error
            if (errorSysMsg !== undefined) {
                Notification.error({
                    title: errorSysMsg,
                    duration: 5000
                })
            }
            if (errorUserMsg !== undefined) {
                Notification.error({
                    title: errorUserMsg,
                    duration: 5000
                })
            }
            // sessionStorage.removeItem('token') //清除token缓存
            // sessionStorage.removeItem('user') // 清除用户ID
            // localStorage.removeItem('arr')
        } else {
            Notification.error({
                title: '接口请求失败',
                duration: 5000
            })
        }
        return Promise.reject(error)
    }
)
export default service
