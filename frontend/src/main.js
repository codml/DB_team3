import { createApp } from 'vue'
import App from './App.vue'
import Login from './pages/login/LoginPage.vue'
import SignUP from './pages/signup/SignUPPage.vue'
import Index from './router/index.js'

createApp(App).use(Index).mount('#app')
createApp(Login)
createApp(SignUP)