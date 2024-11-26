import './assets/main.css'

import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import App from './App.vue'
import Login from './components/Authenticate/Login.vue'
import Register from './components/Authenticate/Register.vue'
import Home from './components/Home/Home.vue'
import FindNearbyPlaces from './components/Home/FindNearbyPlaces.vue'
import SocialsPage from './components/Social/SocialsPage.vue';
import AddFriends from './components/Social/AddFriends.vue';
import FriendsList from './components/Social/FriendsList.vue';
import PlacesPage from './components/Places/PlacesPage.vue';
import { RLinks } from './configurations/routerLinks'

import { createMemoryHistory, createWebHistory, createRouter } from 'vue-router'
const routes = [
  { path: RLinks.LoginPage , name: "login",  component: Login },
  { path: RLinks.RegisterPage, name: "register",  component: Register},
  { path: RLinks.Default , redirect: {name: "login"}},
  
  { path: RLinks.Home, name: "home",  component: Home},
  { path: RLinks.FindNearbyPlace , name: "find-nearby",  component: FindNearbyPlaces},

  { path: RLinks.SocialPage, name: RLinks.SocialPage,  component: SocialsPage},
  { path: RLinks.AddFriends, name: RLinks.AddFriends,  component: AddFriends},
  { path: RLinks.FriendsList, name: RLinks.FriendsList,  component: FriendsList},

  { path: RLinks.PlacesPage , name: RLinks.PlacesPage,  component: PlacesPage},
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})


createApp(App).use(router).use(PrimeVue).mount('#app')
