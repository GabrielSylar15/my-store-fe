import BuyerLoginPage from '../pages/user/BuyerLoginPage.vue'
import OAuthCallbackPage from "@/pages/user/OAuthCallbackPage.vue";

const userRoutes = [
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
];

export default userRoutes;
