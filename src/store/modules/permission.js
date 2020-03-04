import { constantRoutes } from '@/router'
/* Layout */
import Layout from '@/layout'

const _import = require('@/utils/_import')

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRoutes(asyncRouterMap) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component1) {
      if (route.component1 === 'Layout') {
        route.component = Layout
      } else {
        route.component = _import(route.component1) // 导入组件
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRoutes(route.children)
    }
    return true
  })

  return accessedRouters
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, routelist) {
    return new Promise(resolve => {
      let accessedRoutes
      // eslint-disable-next-line prefer-const
      accessedRoutes = filterAsyncRoutes(routelist)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
