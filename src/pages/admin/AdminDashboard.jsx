import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Package, Users, ShoppingCart, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { fetchAdminProducts, fetchOrders } from '../../store/adminSlice';
import { fetchUsers } from '../../store/authSlice';

const StatCard = ({ label, value, icon: Icon, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 hover:border-white/[0.12] transition-all group"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">{label}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon size={20} style={{ color }} />
      </div>
    </div>
    {/* Decorative gradient */}
    <div
      className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
      style={{ background: `linear-gradient(to right, ${color}, transparent)` }}
    />
  </motion.div>
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { products, orders, loading } = useSelector((s) => s.admin);
  const { users } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchUsers());
    dispatch(fetchOrders());
  }, [dispatch]);

  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: '#00FF88' },
    { label: 'Total Users', value: users.length, icon: Users, color: '#00E0FF' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: '#BD00FF' },
    { label: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: '#FF6B6B' },
    { label: 'Total Stock', value: totalStock.toLocaleString(), icon: TrendingUp, color: '#FFD93D' },
    { label: 'Categories', value: new Set(products.map((p) => p._category)).size, icon: Activity, color: '#4ECDC4' },
  ];

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#00FF88]/30 border-t-[#00FF88] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">Overview of your gaming store</p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 0.05} />
        ))}
      </div>

      {/* Recent orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-bold text-white">Recent Orders</h3>
        </div>
        {orders.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 text-sm">No orders yet</div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Order #{order.id}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">${order.total?.toFixed(2)}</p>
                  <span
                    className={`inline-block text-[10px] font-bold uppercase tracking-wider mt-1 px-2 py-0.5 rounded-full ${
                      order.status === 'delivered'
                        ? 'bg-[#00FF88]/10 text-[#00FF88]'
                        : order.status === 'processing'
                        ? 'bg-yellow-500/10 text-yellow-400'
                        : 'bg-white/5 text-neutral-400'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Top products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-bold text-white">Top Products</h3>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {products.slice(0, 5).map((product) => (
            <div key={`${product._category}-${product.id}`} className="px-6 py-4 flex items-center gap-4">
              <img
                src={product.images?.[0] || 'https://via.placeholder.com/40'}
                alt={product.title}
                className="w-10 h-10 rounded-lg object-cover bg-white/5"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{product.title}</p>
                <p className="text-xs text-neutral-500 capitalize">{product._category}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#00FF88]">${product.discountPrice || product.price}</p>
                <p className="text-[10px] text-neutral-500">{product.stock} in stock</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
