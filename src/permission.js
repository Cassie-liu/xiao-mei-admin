import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

// 验证是否有权限
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) {
      // if (JSON.parse(sessionStorage.getItem('role')).role.length === 0) {
      //   store.dispatch('permission/generateRoutes', { roles: []})
      //     .then(res => {
      //         sessionStorage.setItem('role', JSON.stringify({role: ['admin']}))
      //         // router.addRoutes(store.getters.addRoutes);
      //         next({ ...to, replace: true })
      //     }).catch(err => {
      //       store.dispatch('FedLogOut').then(() => {
      //         Message.error(err || '验证失败, 请重新登录');
      //         next({ path: '/' })
      //       })
      //   })
      //   // get user info
        // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
        store.dispatch('GetInfo')
          .then(res => {
            const roles = res.data.role
            // generate accessible routes map based on roles
            // store.dispatch('permission/generateRoutes', { roles })
            //   .then(res => {
            //     // dynamically add accessible route
            //     // hack method to ensure that addRoutes is complete
            //     router.addRoutes(store.getters.addRoutes)
            //     // set the replace: true, so the navigation will not leave a history record
            //     next({ ...to, replace: true })
            //   }).catch(err => {
            //     store.dispatch('FedLogOut').then(() => {
            //       Message.error(err || 'Verification failed, please login again')
            //       next({ path: '/' })
            //     })
            //   })
          })
        next()
      } else {
        next()
      }
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
