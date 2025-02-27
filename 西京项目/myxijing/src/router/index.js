import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Home from '../views/Home'
import home from '../components/Home'
import AccountPeriodSetting from '../components/AccountPeriodSetting'
import CommunityMaintenance from '../components/CommunityMaintenance'
import MonthPaymentStatistics from '../components/MonthPaymentStatistics'
import DeductionSetting from '../components/DeductionSetting'
import PowerList from '../components/PowerList'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/home',
    component: Home,
    meta: {
      requireAuth: true,
    },
    children: [{
      path: '/home',
      component: home,
      meta: {
        title: '首页'
      }
    },
    {
      path: '/powerList',
      component: PowerList,
      meta: {
        title: '角色管理'
      }
    }, {
      path: '/accountPeriodSetting',
      component: AccountPeriodSetting,
      meta: {
        title: '账期设置'
      }
    }, {
      path: '/communityMaintenance',
      component: CommunityMaintenance,
      meta: {
        title: '小区设置'
      }
    }, {
      path: '/monthPaymentStatistics',
      component: MonthPaymentStatistics,
      meta: {
        title: '月缴费管理'
      }
    }, {
      path: '/deductionSetting',
      component: DeductionSetting,
      meta: {
        title: '减免项设置'
      }
    }]
  },

]

const router = new VueRouter({
  routes
})




router.beforeEach((to, from, next) => {
  // 判断该路由是否需要登录权限
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (sessionStorage.getItem('token')) {
      Vue.axios.interceptors.request.use(
        config => {
          config.headers.token = sessionStorage.getItem('token') //设置响应头
          return config
        },
        err => {
          console.log(err)
        }
      )
      /* 路由发生变化修改页面title */
      if (to.meta.title) {
        document.title = to.meta.title
      }
      return next()
    } else {
      return next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    }
  } else {
    return next()
  }
});
// 全局路由前置守卫
// router.beforeEach((to, from, next) => {
//   if (to.path == '/login') {
//     //如果登录的是 login 页面，任何人都可以登录，放行
//     return next()
//   }
//   if (sessionStorage.token) {
//     //如果不是登录页面，判断sessionStorage中是否有token数据，如果有，放行
//     // 其它操作，需要在请求头中设置 token 验证
//     Vue.axios.interceptors.request.use(
//       config => {
//         config.headers.token = sessionStorage.getItem('token') //设置响应头
//         return config
//       },
//       err => {
//         console.log(err)
//       }
//     )
//     /* 路由发生变化修改页面title */
//     if (to.meta.title) {
//       document.title = to.meta.title
//     }
//     return next()
//   }
//   return next({
//     path: '/login'
//   }) //如果不是登录页面，并且没有token值，就跳转到登录页
// })








// // 路由判断登录 根据路由配置文件的参数
// if (to.matched.some(record => record.meta.requireAuth)) { // 判断该路由是否需要登录权限
//   // console.log('需要登录');
//   /* 路由发生变化修改页面title */
//   if (to.meta.title) {
//     document.title = to.meta.title
//   }
//   if (sessionStorage.token) {
//     next();
//   } else {
//     next({
//       path: '/'
//     })
//   }
// } else {
//   next();
// }

export default router