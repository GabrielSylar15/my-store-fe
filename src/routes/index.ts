import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import userRoutes from './user.routes.js';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage
    },
    ...userRoutes
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
