import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Clock, ArrowRight } from 'lucide-react';
import { Footer } from '../components';
import OrderCard from '../components/orders/OrderCard';
import { fetchOrders } from '../store/ordersSlice';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector(state => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <div className="bg-[#0B0F14] min-h-screen text-white pt-24">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00FF88]/[0.04] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00FF88]/20 to-[#00E0FF]/10 flex items-center justify-center border border-[#00FF88]/20">
              <Package size={20} className="text-[#00FF88]" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[#00FF88] to-[#00E0FF] bg-clip-text text-transparent">
              My Orders
            </h1>
          </div>
          <p className="text-white/40 ml-[52px]">
            Track and manage all your NEXUS orders
          </p>
        </motion.div>

        {/* Stats bar */}
        {orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            {[
              {
                label: 'Total Orders',
                value: orders.length,
                icon: Package,
                color: 'from-[#00FF88]/20 to-[#00FF88]/5',
              },
              {
                label: 'In Progress',
                value: orders.filter(o => o.orderStatus !== 'Delivered').length,
                icon: Clock,
                color: 'from-[#00E0FF]/20 to-[#00E0FF]/5',
              },
              {
                label: 'Delivered',
                value: orders.filter(o => o.orderStatus === 'Delivered').length,
                icon: ShoppingBag,
                color: 'from-[#BD00FF]/20 to-[#BD00FF]/5',
              },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className={`rounded-xl bg-gradient-to-br ${stat.color} border border-white/[0.06] p-4 text-center`}
                >
                  <Icon size={18} className="mx-auto mb-2 text-white/50" />
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-white/40 mt-1">{stat.label}</p>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Orders list */}
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <OrderCard key={order.id} order={order} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <Package size={32} className="text-white/20" />
            </div>
            <h2 className="text-2xl font-bold text-white/60 mb-2">No orders yet</h2>
            <p className="text-white/30 mb-8 max-w-sm mx-auto">
              Start shopping and your orders will appear here
            </p>
            <Link
              to="/store"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00FF88] to-[#00E0FF] text-[#0B0F14] font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] transition-shadow"
            >
              <ShoppingBag size={18} />
              Browse Store
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default OrdersPage;
