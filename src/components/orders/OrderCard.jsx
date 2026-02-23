import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Package, ChevronRight, CreditCard, Truck } from 'lucide-react';
import { formatPrice } from '../../utils/helpers';
import { getStatusColor, getPaymentStatusColor } from '../../services/orderService';

const OrderCard = ({ order, index = 0 }) => {
  const navigate = useNavigate();

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const itemCount = order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={() => navigate(`/orders/${order.id}`)}
      className="group relative cursor-pointer rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-[#00FF88]/30 hover:shadow-[0_0_40px_rgba(0,255,136,0.08)]"
    >
      {/* Neon top border glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FF88]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00FF88]/20 to-[#00E0FF]/10 flex items-center justify-center border border-[#00FF88]/20">
              <Package size={18} className="text-[#00FF88]" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">{order.id}</h3>
              <p className="text-white/40 text-xs mt-0.5">{formattedDate}</p>
            </div>
          </div>

          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.orderStatus)}`}>
            {order.orderStatus}
          </span>
        </div>

        {/* Items preview */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex -space-x-2">
            {order.items?.slice(0, 3).map((item, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-lg bg-nexus-dark border border-white/10 overflow-hidden flex items-center justify-center"
              >
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <Package size={14} className="text-white/30" />
                )}
              </div>
            ))}
            {order.items?.length > 3 && (
              <div className="w-10 h-10 rounded-lg bg-nexus-dark border border-white/10 flex items-center justify-center text-xs text-white/50 font-medium">
                +{order.items.length - 3}
              </div>
            )}
          </div>
          <span className="text-white/50 text-xs">
            {itemCount} item{itemCount !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <CreditCard size={13} className="text-white/30" />
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${getPaymentStatusColor(order.paymentStatus)}`}>
                {order.paymentStatus}
              </span>
            </div>
            {order.orderStatus === 'Shipped' && (
              <div className="flex items-center gap-1.5 text-cyan-400">
                <Truck size={13} />
                <span className="text-xs font-medium">In Transit</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-lg font-bold bg-gradient-to-r from-[#00FF88] to-[#00E0FF] bg-clip-text text-transparent">
              {formatPrice(order.totalAmount)}
            </span>
            <ChevronRight size={16} className="text-white/30 group-hover:text-[#00FF88] transition-colors" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderCard;
