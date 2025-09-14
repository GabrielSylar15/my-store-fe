import ProductListPage from "@/pages/inventory/ProductListPage.vue";
import ProductDetailPage from "@/pages/inventory/ProductDetailPage.vue";

const productRoutes = [
    {
        path: '/product',
        name: 'ProductList',
        component: ProductListPage
    },
    {
        path: '/product/:productName',
        name: 'ProductDetail',
        component: ProductDetailPage,
        props: true
    }
];

export default productRoutes;
