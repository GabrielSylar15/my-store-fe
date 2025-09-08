import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import userRoutes from './user.routes.js';
import productRoutes from "@/routes/product.routes";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage
    },
    ...userRoutes,
    ...productRoutes,
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
