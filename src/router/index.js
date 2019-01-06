import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/user/index',
    name: 'User',
    hidden: true,
    meta: { title: '用户管理', icon: 'user' },
    children: [{
      path: 'user/index',
      component: () => import('@/views/user/index')
    }]
  },
  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/user/index'),
        meta: { title: '用户管理', icon: 'user' }
      }
    ]
  },
  {
    path: '/dynamic',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Dynamic',
        component: () => import('@/views/Dynamic/index'),
        meta: { title: '动态管理', icon: 'dynamic' }
      }
    ]
  },
  {
    path: '/case',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Case',
        component: () => import('@/views/case/index'),
        meta: { title: '案例管理', icon: 'case' }
      }
    ]
  },
  {
    path: '/solution',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Solution',
        component: () => import('@/views/solution/index'),
        meta: { title: '解决方案管理', icon: 'solution' }
      }
    ]
  },
  {
    path: '/lesson',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Lesson',
        component: () => import('@/views/lesson/index'),
        meta: { title: '课程报名', icon: 'lesson' }
      }
    ]
  },
  {
    path: '/commodity',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Commodity',
        component: () => import('@/views/commodity/index'),
        meta: { title: '商品管理', icon: 'commodity' }
      }
    ]
  },
  {
    path: '/health',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Health',
        component: () => import('@/views/health/index'),
        meta: { title: '养生排行榜', icon: 'ranking' }
      }
    ]
  },
  {
    path: '/settings',
    component: Layout,
    redirect: '/settings/disease',
    name: 'Settings',
    meta: { title: '系统设置', icon: 'setting' },
    children: [
      {
        path: 'disease',
        name: 'Disease',
        component: () => import('@/views/settings/disease/index'),
        meta: { title: '疾病配置', icon: 'disease' }
      },
      {
        path: 'health',
        name: 'HealthConfig',
        component: () => import('@/views/settings/health/index'),
        meta: { title: '养生配置', icon: 'healthConfig' }
      },
      {
        path: 'other',
        name: 'Other',
        component: () => import('@/views/settings/other/index'),
        meta: { title: '其他配置', icon: 'other' }
      },
    ]
  },
  {
    path: '/operation',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Operation',
        component: () => import('@/views/operation/index'),
        meta: { title: '系统运维', icon: 'operation' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
