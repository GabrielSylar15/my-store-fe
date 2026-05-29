import BuyerLoginPage from '../pages/user/BuyerLoginPage.vue'
import OAuthCallbackPage from "@/pages/user/OAuthCallbackPage.vue";
import UserProfile from "@/pages/user/UserProfile.vue";

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
        component: UserProfile
    }
];

export default userRoutes;
