/**
 * ═══════════════════════════════════════════════════════════════
 * NexusBot — Floating AI Assistant for the NEXUS gaming store
 * ═══════════════════════════════════════════════════════════════
 *
 * Renders a fixed bottom-right pulsing neon button that toggles
 * a premium cyberpunk chat window powered by rule-based NLP.
 *
 * Features:
 *  - Animated chat bubble with glow
 *  - Unread badge counter
 *  - Full chat window with product recommendations
 *  - Cart integration
 *  - localStorage persistence
 *  - Mobile responsive
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Bot } from 'lucide-react';
import ChatWindow from './ChatWindow';
import useNexusAI from '../../hooks/useNexusAI';

/* ── Button animation ── */
const pulseKeyframes = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

const NexusBot = () => {
  const {
    messages,
    isTyping,
    isOpen,
    isMinimized,
    unreadCount,
    sendMessage,
    handleAddToCart,
    handleViewProduct,
    toggleChat,
    minimizeChat,
    maximizeChat,
    clearChat,
    quickSuggestions,
  } = useNexusAI();

  return (
    <>
      {/* ═══ CHAT WINDOW ═══ */}
      <AnimatePresence>
        {isOpen && (
          <ChatWindow
            messages={messages}
            isTyping={isTyping}
            isMinimized={isMinimized}
            onSendMessage={sendMessage}
            onAddToCart={handleAddToCart}
            onViewProduct={handleViewProduct}
            onClose={toggleChat}
            onMinimize={minimizeChat}
            onMaximize={maximizeChat}
            onClear={clearChat}
            quickSuggestions={quickSuggestions}
          />
        )}
      </AnimatePresence>

      {/* ═══ FLOATING ACTION BUTTON ═══ */}
      <motion.button
        onClick={toggleChat}
        animate={!isOpen ? pulseKeyframes : {}}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-4 sm:right-6 z-[10000]
                   w-14 h-14 rounded-full
                   flex items-center justify-center
                   border border-cyan-500/30
                   transition-colors duration-300 cursor-pointer
                   group"
        style={{
          background: isOpen
            ? 'linear-gradient(135deg, rgba(239,68,68,0.9) 0%, rgba(185,28,28,0.9) 100%)'
            : 'linear-gradient(135deg, rgba(0,224,255,0.15) 0%, rgba(0,100,255,0.15) 100%)',
          boxShadow: isOpen
            ? '0 0 20px rgba(239, 68, 68, 0.3), 0 8px 25px rgba(0,0,0,0.4)'
            : '0 0 20px rgba(0, 224, 255, 0.25), 0 0 40px rgba(0, 224, 255, 0.1), 0 8px 25px rgba(0,0,0,0.4)',
          borderColor: isOpen ? 'rgba(239, 68, 68, 0.4)' : undefined,
        }}
        aria-label={isOpen ? 'Close AI chat' : 'Open AI chat'}
      >
        {/* Outer glow ring */}
        {!isOpen && (
          <motion.span
            className="absolute inset-0 rounded-full border border-cyan-400/20"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        )}

        {/* Icon */}
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={22} className="text-white" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Bot size={22} className="text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        <AnimatePresence>
          {unreadCount > 0 && !isOpen && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1
                         flex items-center justify-center rounded-full
                         bg-red-500 text-white text-[10px] font-bold
                         border-2 border-[#0B0F14]"
              style={{ boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)' }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
};

export default React.memo(NexusBot);
