import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  UserPlus,
  Heart,
  MessageCircle,
  Trophy,
  Swords,
  Check,
  Trash2,
  X,
} from 'lucide-react';
import { markAsRead, markAllAsRead, clearAll } from '../../store/notificationSlice';

const TYPE_CONFIG = {
  follower: { icon: UserPlus, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  like: { icon: Heart, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  comment: { icon: MessageCircle, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  achievement: { icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  tournament: { icon: Swords, color: 'text-purple-400', bg: 'bg-purple-500/10' },
};

const NotificationPanel = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector((s) => s.notifications);

  const timeAgo = (ts) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="rounded-2xl border border-white/[0.06] overflow-hidden"
          style={{ background: 'rgba(15,15,20,0.9)', backdropFilter: 'blur(20px)' }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

          {/* Header */}
          <div className="px-5 py-4 flex items-center justify-between border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-purple-400" />
              <h3 className="text-sm font-bold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={() => dispatch(markAllAsRead())}
                  className="p-1.5 rounded-lg text-neutral-600 hover:text-cyan-400 hover:bg-white/[0.04] transition-all"
                  title="Mark all read"
                >
                  <Check size={14} />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={() => dispatch(clearAll())}
                  className="p-1.5 rounded-lg text-neutral-600 hover:text-red-400 hover:bg-white/[0.04] transition-all"
                  title="Clear all"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-10 text-center text-neutral-600 text-sm">
                No notifications
              </div>
            ) : (
              notifications.map((notif, i) => {
                const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.follower;
                const IconComp = config.icon;

                return (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => dispatch(markAsRead(notif.id))}
                    className={`flex items-start gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer ${
                      !notif.read ? 'bg-white/[0.02]' : ''
                    }`}
                  >
                    {notif.avatar ? (
                      <img
                        src={notif.avatar}
                        alt=""
                        className="w-8 h-8 rounded-full border border-white/10 flex-shrink-0 mt-0.5"
                      />
                    ) : (
                      <div
                        className={`w-8 h-8 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}
                      >
                        <IconComp size={14} className={config.color} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-relaxed ${notif.read ? 'text-neutral-500' : 'text-neutral-200'}`}>
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-neutral-700 mt-0.5">{timeAgo(notif.timestamp)}</span>
                    </div>
                    {!notif.read && (
                      <div className="w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0 mt-2" />
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;
