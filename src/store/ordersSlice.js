import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: JSON.parse(localStorage.getItem('nexus_orders')) || [],
  currentOrder: null,
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    createOrder: (state, action) => {
      const order = {
        ...action.payload,
        id: `ORD-${new Date().getFullYear()}-${String(state.orders.length + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        orderStatus: 'Processing',
        timeline: [
          { step: 'Order Placed', completed: true, date: new Date().toISOString() },
          { step: 'Payment Confirmed', completed: false, date: null },
          { step: 'Processing', completed: false, date: null },
          { step: 'Shipped', completed: false, date: null },
          { step: 'Out for Delivery', completed: false, date: null },
          { step: 'Delivered', completed: false, date: null },
        ],
      };
      state.orders.unshift(order);
      state.currentOrder = order;
      localStorage.setItem('nexus_orders', JSON.stringify(state.orders));
    },

    updatePaymentStatus: (state, action) => {
      const { orderId, paymentId, paymentStatus } = action.payload;
      const order = state.orders.find(o => o.id === orderId);
      if (order) {
        order.paymentId = paymentId;
        order.paymentStatus = paymentStatus;
        if (paymentStatus === 'success') {
          order.timeline[1] = { step: 'Payment Confirmed', completed: true, date: new Date().toISOString() };
          order.timeline[2] = { step: 'Processing', completed: true, date: new Date().toISOString() };
        }
        if (state.currentOrder?.id === orderId) {
          state.currentOrder = { ...order };
        }
        localStorage.setItem('nexus_orders', JSON.stringify(state.orders));
      }
    },

    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(o => o.id === orderId);
      if (order) {
        order.orderStatus = status;
        const stepMap = {
          'Processing': 2,
          'Shipped': 3,
          'Out for Delivery': 4,
          'Delivered': 5,
        };
        const stepIndex = stepMap[status];
        if (stepIndex !== undefined) {
          for (let i = 0; i <= stepIndex; i++) {
            order.timeline[i].completed = true;
            if (!order.timeline[i].date) {
              order.timeline[i].date = new Date().toISOString();
            }
          }
        }
        if (state.currentOrder?.id === orderId) {
          state.currentOrder = { ...order };
        }
        localStorage.setItem('nexus_orders', JSON.stringify(state.orders));
      }
    },

    fetchOrders: (state) => {
      state.orders = JSON.parse(localStorage.getItem('nexus_orders')) || [];
    },

    setCurrentOrder: (state, action) => {
      state.currentOrder = state.orders.find(o => o.id === action.payload) || null;
    },

    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    simulateOrderProgress: (state, action) => {
      const orderId = action.payload;
      const order = state.orders.find(o => o.id === orderId);
      if (order) {
        const nextIncomplete = order.timeline.findIndex(t => !t.completed);
        if (nextIncomplete !== -1) {
          order.timeline[nextIncomplete].completed = true;
          order.timeline[nextIncomplete].date = new Date().toISOString();
          const statusLabels = ['Order Placed', 'Payment Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
          order.orderStatus = statusLabels[nextIncomplete];
        }
        if (state.currentOrder?.id === orderId) {
          state.currentOrder = { ...order };
        }
        localStorage.setItem('nexus_orders', JSON.stringify(state.orders));
      }
    },
  },
});

export const {
  createOrder,
  updatePaymentStatus,
  updateOrderStatus,
  fetchOrders,
  setCurrentOrder,
  clearCurrentOrder,
  setLoading,
  setError,
  simulateOrderProgress,
} = ordersSlice.actions;

export default ordersSlice.reducer;
