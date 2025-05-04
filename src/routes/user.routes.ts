import {createRouter, createWebHistory} from 'vue-router'
import BuyerLoginPage from '../pages/user/BuyerLoginPage.vue'
import OAuthCallbackPage from "@/pages/user/OAuthCallbackPage.vue";

const routes = [
    {
        path: '/buyer/login',
        name: 'BuyerLogin',
        component: BuyerLoginPage
    },
    {
        path: '/buyer/login/callback',
        name: 'OAuthCallback',
        component: OAuthCallbackPage
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router