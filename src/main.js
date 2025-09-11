import {createApp} from 'vue';
import App from './App.vue';
import router from './routes/index.js'; // 👈 dùng router tổng
import './assets/styles/tailwind.css';
import Antd from 'ant-design-vue';
import {createPinia} from 'pinia';

const app = createApp(App);
app.use(router);
app.use(Antd);
app.use(createPinia());
app.mount('#app');
