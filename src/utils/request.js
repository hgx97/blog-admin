import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
// import router from '@/router'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 前置url 在.env.*文件配置具体路径
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // 如果vuex里有token就为请求设置headers的Authorization
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // 如果自定义code不是200就判断其错误
    if (res.status !== 200) {
      if (response.status === 401 || res.status === 401) {
        MessageBox.alert(res.message, '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          // 401代表token失效或者未登陆，所以先清空token在返回登陆页面
          store.dispatch('user/resetToken')
          location.reload()
        })
      } else {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject(res.message)
    } else {
      const token = response.headers.authorization
      // 如果有返回新的token 则更新store和cookie里的token
      if (token && store.getters.token && store.getters.token != token) {
        try {
          store.dispatch('user/changeToken', token)
          console.log('更新token成功')
        } catch (error) {
          console.log('err' + error) // for debug
          Message({
            message: '更新token失败',
            type: 'error',
            duration: 5 * 1000
          })
        }
      }
      return res
    }
  },
  error => {
    // console.log(error.status)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
