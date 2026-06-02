import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import userRoutes from './user.routes.js';
import productRoutes from "@/routes/product.routes";
import orderRoutes from "@/routes/order.routes";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage
    },
    ...userRoutes,
    ...productRoutes,
    ...orderRoutes,
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior: () => ({ top: 0, behavior: 'instant' }),
});

export default router;
