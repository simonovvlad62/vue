import { createRouter, createWebHistory } from 'vue-router'
import home from '../views/home.vue'
import contacts from '../views/contacts.vue'
import login from '../views/login.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: home
  },
  {
    path: '/contacts',
    name: 'contacts',
    component: contacts
  },
  {
    path: '/login',
    name: 'login',
    component: login
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router