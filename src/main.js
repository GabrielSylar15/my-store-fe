import { createApp } from 'vue'
import App from './App.vue'
import router from './routes/user.routes.js'
import './assets/styles/tailwind.css'

const app = createApp(App)
app.use(router)
app.mount('#app')