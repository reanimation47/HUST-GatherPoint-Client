import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import Login from './components/Authenticate/Login.vue'

import { createMemoryHistory, createWebHistory, createRouter } from 'vue-router'
const routes = [
  { path: '/login', name: "login",  component: Login },
  { path: '/', redirect: {name: "login"}},
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})


createApp(App).use(router).mount('#app')
