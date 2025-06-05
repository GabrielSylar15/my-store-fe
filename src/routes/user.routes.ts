import BuyerLoginPage from '../pages/user/BuyerLoginPage.vue'
import OAuthCallbackPage from "@/pages/user/OAuthCallbackPage.vue";
import BuyerProfile from "@/components/users/BuyerProfile.vue";

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
    },
    {
        path: '/user/account/profile',
        name: "AccountProfilePage",
        component: BuyerProfile
    }
];

export default userRoutes;
