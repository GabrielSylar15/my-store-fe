import { createRouter, createWebHistory } from 'vue-router'
import BuyerLoginPage from '../pages/user/BuyerLoginPage.vue'

const routes = [
    {
        path: '/buyer/login',
        name: 'BuyerLogin',
        component: BuyerLoginPage
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router