import CartPage from '@/pages/order/Cart.vue'
import CheckOutPage from '@/pages/order/CheckOut.vue'
import OrderSuccessPage from '@/pages/order/OrderSuccess.vue'
import OrderDetailPage from '@/pages/order/OrderDetail.vue'
import UserOrdersPage from '@/pages/user/UserOrders.vue'

const orderRoutes = [
  { path: '/cart', name: 'Cart', component: CartPage },
  { path: '/checkout', name: 'CheckOut', component: CheckOutPage },
  { path: '/order/success/:id', name: 'OrderSuccess', component: OrderSuccessPage },
  { path: '/user/orders', name: 'UserOrders', component: UserOrdersPage },
  { path: '/user/orders/:alias', name: 'OrderDetail', component: OrderDetailPage },
]

export default orderRoutes
