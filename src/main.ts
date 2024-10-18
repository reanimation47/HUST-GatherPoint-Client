import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import Login from './components/Authenticate/Login.vue'
import Home from './components/Home/Home.vue'
import { RLinks } from './configurations/routerLinks'

import { createMemoryHistory, createWebHistory, createRouter } from 'vue-router'
const routes = [
  { path: RLinks.LoginPage , name: "login",  component: Login },
  { path: RLinks.Default , redirect: {name: "login"}},
  
  { path: RLinks.Home, name: "home",  component: Home},
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})


createApp(App).use(router).mount('#app')
