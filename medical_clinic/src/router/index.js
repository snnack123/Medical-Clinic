import { createRouter, createWebHistory } from 'vue-router'
import ProductList from '../views/ProductList'
import Register from '../views/Register'
import Login from '../views/Login'
import AddProduct from '../views/AddProduct'
import store from '../store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: ProductList
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/addProduct',
    name: 'AddProduct',
    component: AddProduct
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Global navigation guard example
router.beforeEach((to, from, next) => {
  if (to.name === 'Register' || to.name === 'Login' || to.name === 'Home') {
    next();
  } else if (to.name !== 'Login' && !store.state.isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
})

export default router
