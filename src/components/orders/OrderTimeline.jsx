import React from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  CreditCard,
  Settings,
  Truck,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

const timelineSteps = [
  { label: 'Order Placed', icon: ShoppingCart },
  { label: 'Payment Confirmed', icon: CreditCard },
  { label: 'Processing', icon: Settings },
  { label: 'Shipped', icon: Truck },
  { label: 'Out for Delivery', icon: MapPin },
  { label: 'Delivered', icon: CheckCircle2 },
];

const OrderTimeline = ({ timeline = [] }) => {
  const activeIndex = timeline.reduce((acc, step, i) => (step.completed ? i : acc), -1);

  return (
    <div className="relative">
      {timelineSteps.map((step, index) => {
        const data = timeline[index] || { completed: false, date: null };
        const isActive = index === activeIndex;
        const isCompleted = data.completed;
        const isPending = !isCompleted;
        const Icon = step.icon;

        const formattedDate = data.date
          ? new Date(data.date).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : null;

        return (
          <div key={index} className="relative flex items-start gap-4 pb-8 last:pb-0">
            {/* Connector line */}
            {index < timelineSteps.length - 1 && (
              <div className="absolute left-[19px] top-[44px] w-[2px] h-[calc(100%-28px)]">
                <div
                  className={`w-full h-full transition-all duration-700 ${
                    isCompleted && timeline[index + 1]?.completed
                      ? 'bg-gradient-to-b from-[#00FF88] to-[#00FF88]'
                      : isCompleted
                      ? 'bg-gradient-to-b from-[#00FF88] to-white/10'
                      : 'bg-white/10'
                  }`}
                />
              </div>
            )}

            {/* Icon node */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.12, type: 'spring', stiffness: 200 }}
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all duration-500 ${
                isActive
                  ? 'bg-[#00FF88]/20 border-[#00FF88] shadow-[0_0_20px_rgba(0,255,136,0.4)]'
                  : isCompleted
                  ? 'bg-[#00FF88]/10 border-[#00FF88]/50'
                  : 'bg-white/[0.03] border-white/10'
              }`}
            >
              {/* Pulse ring for active */}
              {isActive && (
                <motion.div
                  animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full border-2 border-[#00FF88]/40"
                />
              )}

              {/* Completed pulse */}
              {isCompleted && !isActive && (
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full bg-[#00FF88]/10"
                />
              )}

              <Icon
                size={18}
                className={`transition-colors duration-500 ${
                  isActive
                    ? 'text-[#00FF88]'
                    : isCompleted
                    ? 'text-[#00FF88]/70'
                    : 'text-white/25'
                }`}
              />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.12 + 0.1 }}
              className="flex-1 pt-1.5"
            >
              <p
                className={`font-semibold text-sm transition-colors ${
                  isActive
                    ? 'text-[#00FF88]'
                    : isCompleted
                    ? 'text-white/90'
                    : 'text-white/30'
                }`}
              >
                {step.label}
              </p>
              {formattedDate && (
                <p className="text-white/40 text-xs mt-1">{formattedDate}</p>
              )}
              {isPending && (
                <p className="text-white/20 text-xs mt-1 italic">Pending</p>
              )}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;
