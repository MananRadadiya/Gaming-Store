import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  CreditCard,
  MapPin,
  FileText,
  RefreshCw,
  Truck,
} from 'lucide-react';
import { Footer } from '../components';
import OrderTimeline from '../components/orders/OrderTimeline';
import InvoicePreview from '../components/orders/InvoicePreview';
import { setCurrentOrder, simulateOrderProgress } from '../store/ordersSlice';
import { formatPrice } from '../utils/helpers';
import { getEstimatedDelivery, getStatusColor, getPaymentStatusColor } from '../services/orderService';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, currentOrder } = useSelector(state => state.orders);
  const [activeTab, setActiveTab] = useState('tracking');

  useEffect(() => {
    if (orderId) {
      dispatch(setCurrentOrder(orderId));
    }
  }, [orderId, dispatch, orders]);

  const handleSimulateProgress = () => {
    if (orderId) {
      dispatch(simulateOrderProgress(orderId));
    }
  };

  if (!currentOrder) {
    return (
      <div className="bg-[#0B0F14] min-h-screen text-white pt-24">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <Package size={48} className="mx-auto mb-4 text-white/20" />
          <h2 className="text-2xl font-bold text-white/60 mb-2">Order not found</h2>
          <p className="text-white/30 mb-6">The order you're looking for doesn't exist.</p>
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00FF88] to-[#00E0FF] text-[#0B0F14] font-bold rounded-xl"
          >
            <ArrowLeft size={16} />
            View All Orders
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const tabs = [
    { id: 'tracking', label: 'Tracking', icon: Truck },
    { id: 'items', label: 'Items', icon: Package },
    { id: 'invoice', label: 'Invoice', icon: FileText },
  ];

  return (
    <div className="bg-[#0B0F14] min-h-screen text-white pt-24">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00FF88]/[0.04] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2 text-white/50 hover:text-[#00FF88] transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Back to Orders
          </button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-black text-white mb-1">{currentOrder.id}</h1>
            <p className="text-white/40 text-sm">
              Placed on{' '}
              {new Date(currentOrder.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-4 py-1.5 text-sm font-semibold rounded-full border ${getStatusColor(
                currentOrder.orderStatus
              )}`}
            >
              {currentOrder.orderStatus}
            </span>
            <span
              className={`px-4 py-1.5 text-sm font-semibold rounded-full border flex items-center gap-1.5 ${getPaymentStatusColor(
                currentOrder.paymentStatus
              )}`}
            >
              <CreditCard size={14} />
              {currentOrder.paymentStatus}
            </span>
          </div>
        </motion.div>

        {/* Quick info cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          {[
            {
              label: 'Total Amount',
              value: formatPrice(currentOrder.totalAmount),
              icon: CreditCard,
            },
            {
              label: 'Items',
              value: currentOrder.items?.reduce((a, b) => a + b.quantity, 0) || 0,
              icon: Package,
            },
            {
              label: 'Est. Delivery',
              value: getEstimatedDelivery(currentOrder.createdAt).split(',')[0],
              icon: Truck,
            },
            {
              label: 'Ship To',
              value: currentOrder.customer?.city || 'N/A',
              icon: MapPin,
            },
          ].map((info, i) => {
            const Icon = info.icon;
            return (
              <div
                key={i}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
              >
                <Icon size={16} className="text-[#00FF88]/60 mb-2" />
                <p className="text-xs text-white/40 mb-0.5">{info.label}</p>
                <p className="text-sm font-bold text-white truncate">{info.value}</p>
              </div>
            );
          })}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 mb-8 border-b border-white/[0.06] pb-4"
        >
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/20'
                    : 'text-white/40 hover:text-white/60 border border-transparent'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}

          {/* Dev: simulate progress button */}
          {currentOrder.orderStatus !== 'Delivered' && (
            <button
              onClick={handleSimulateProgress}
              className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-white/30 hover:text-[#00E0FF] border border-white/[0.06] hover:border-[#00E0FF]/30 transition-all"
              title="Simulate next status update"
            >
              <RefreshCw size={14} />
              Simulate Progress
            </button>
          )}
        </motion.div>

        {/* Tab content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* TRACKING TAB */}
          {activeTab === 'tracking' && (
            <div className="grid lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-xl p-8">
                <h3 className="text-lg font-bold text-white mb-6">Order Tracking</h3>
                <OrderTimeline timeline={currentOrder.timeline || []} />
              </div>

              <div className="lg:col-span-2 space-y-4">
                {/* Shipping info */}
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                  <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <MapPin size={16} className="text-[#00FF88]" />
                    Shipping Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-white/80 font-medium">
                      {currentOrder.customer?.firstName} {currentOrder.customer?.lastName}
                    </p>
                    <p className="text-white/40">{currentOrder.customer?.address}</p>
                    <p className="text-white/40">
                      {currentOrder.customer?.city} - {currentOrder.customer?.pinCode}
                    </p>
                    <p className="text-white/40">{currentOrder.customer?.phone}</p>
                  </div>
                </div>

                {/* Payment info */}
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                  <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <CreditCard size={16} className="text-[#00E0FF]" />
                    Payment Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/40">Method</span>
                      <span className="text-white/80 capitalize">{currentOrder.paymentMethod || 'Razorpay'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Status</span>
                      <span className={`capitalize font-medium ${
                        currentOrder.paymentStatus === 'success' ? 'text-green-400' :
                        currentOrder.paymentStatus === 'failed' ? 'text-red-400' : 'text-yellow-400'
                      }`}>{currentOrder.paymentStatus}</span>
                    </div>
                    {currentOrder.paymentId && (
                      <div className="flex justify-between">
                        <span className="text-white/40">Payment ID</span>
                        <span className="text-white/60 font-mono text-xs">{currentOrder.paymentId}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 mt-2 border-t border-white/[0.06]">
                      <span className="text-white/60 font-medium">Total</span>
                      <span className="font-bold bg-gradient-to-r from-[#00FF88] to-[#00E0FF] bg-clip-text text-transparent">
                        {formatPrice(currentOrder.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Secure badge */}
                <div className="rounded-xl border border-[#00FF88]/10 bg-[#00FF88]/[0.03] p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#00FF88]/10 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#00FF88]">Secure Payment</p>
                    <p className="text-[10px] text-white/30">256-bit SSL encrypted transaction</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ITEMS TAB */}
          {activeTab === 'items' && (
            <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-xl overflow-hidden">
              <div className="p-6 sm:p-8">
                <h3 className="text-lg font-bold text-white mb-6">Order Items</h3>
                <div className="space-y-4">
                  {currentOrder.items?.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-[#00FF88]/20 transition-colors"
                    >
                      <div className="w-16 h-16 rounded-xl bg-nexus-dark border border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package size={24} className="text-white/20" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{item.name}</p>
                        <p className="text-xs text-white/40 mt-0.5">
                          {item.category && <span className="capitalize">{item.category}</span>}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-white">{formatPrice(item.price * item.quantity)}</p>
                        <p className="text-xs text-white/40 mt-0.5">
                          {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Price breakdown */}
                <div className="mt-8 pt-6 border-t border-white/[0.06] max-w-sm ml-auto space-y-2">
                  <div className="flex justify-between text-sm text-white/40">
                    <span>Subtotal</span>
                    <span>{formatPrice(currentOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-white/40">
                    <span>Tax (18% GST)</span>
                    <span>{formatPrice(currentOrder.tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-white/40">
                    <span>Shipping</span>
                    <span>{currentOrder.shipping === 0 ? 'FREE' : formatPrice(currentOrder.shipping)}</span>
                  </div>
                  {currentOrder.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-400">
                      <span>Discount</span>
                      <span>-{formatPrice(currentOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 mt-3 border-t border-[#00FF88]/20">
                    <span className="text-lg font-bold text-white">Total</span>
                    <span className="text-lg font-bold bg-gradient-to-r from-[#00FF88] to-[#00E0FF] bg-clip-text text-transparent">
                      {formatPrice(currentOrder.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INVOICE TAB */}
          {activeTab === 'invoice' && <InvoicePreview order={currentOrder} />}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderDetailsPage;
