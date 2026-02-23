/**
 * ═══════════════════════════════════════════════════════════════
 * ChatWindow — Main chat interface for the NEXUS AI bot
 * ═══════════════════════════════════════════════════════════════
 *
 * Glassmorphism chat panel with:
 *  - Header with title + controls
 *  - Scrollable message area
 *  - Quick suggestion pills
 *  - Input field with send button
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Minus,
  Trash2,
  Send,
  Zap,
  ChevronDown,
  Bot,
  Sparkles,
} from 'lucide-react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

/* ── Animation variants ── */
const windowVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.9,
    transformOrigin: 'bottom right',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.9,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

const minimizedVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: { type: 'spring', stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, height: 0, transition: { duration: 0.15 } },
};

/* ════════════════════════════════════════════════════════════════
   CHAT WINDOW COMPONENT
   ════════════════════════════════════════════════════════════════ */

const ChatWindow = ({
  messages,
  isTyping,
  isMinimized,
  onSendMessage,
  onAddToCart,
  onViewProduct,
  onClose,
  onMinimize,
  onMaximize,
  onClear,
  quickSuggestions,
}) => {
  const [input, setInput] = useState('');
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const inputRef = useRef(null);

  /* ── Auto-scroll to bottom on new messages ── */
  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Focus input when chat opens / unminimizes
  useEffect(() => {
    if (!isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isMinimized]);

  /* ── Track scroll position for "scroll to bottom" button ── */
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distFromBottom > 80);
  }, []);

  /* ── Submit message ── */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  /* ── Quick suggestion click ── */
  const handleSuggestion = (text) => {
    onSendMessage(text);
  };

  return (
    <motion.div
      variants={windowVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed bottom-24 right-4 sm:right-6 z-[9999]
                 w-[calc(100vw-2rem)] sm:w-[400px] max-h-[75vh]
                 flex flex-col rounded-2xl overflow-hidden
                 border border-white/[0.08]"
      style={{
        background: 'linear-gradient(135deg, rgba(11,15,20,0.97) 0%, rgba(15,20,30,0.97) 100%)',
        boxShadow: `
          0 25px 60px rgba(0, 0, 0, 0.6),
          0 0 40px rgba(0, 224, 255, 0.06),
          inset 0 1px 0 rgba(255, 255, 255, 0.04)
        `,
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* ─── HEADER ─── */}
      <div className="relative flex items-center justify-between px-4 py-3
                       border-b border-white/[0.06]"
      >
        {/* Neon top-edge glow */}
        <div className="absolute top-0 left-0 right-0 h-[1px]
                        bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

        <div className="flex items-center gap-2.5">
          {/* Bot avatar */}
          <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20
                          border border-cyan-500/30 flex items-center justify-center">
            <Bot size={16} className="text-cyan-400" />
            {/* Online dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00FF88]
                             border-2 border-[#0B0F14]"
                  style={{ boxShadow: '0 0 6px rgba(0, 255, 136, 0.5)' }} />
          </div>

          <div>
            <h3 className="text-sm font-bold text-white/90 flex items-center gap-1.5">
              NEXUS AI
              <Sparkles size={12} className="text-cyan-400" />
            </h3>
            <p className="text-[10px] text-[#00FF88]/70 font-medium">Online • Ready to help</p>
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={onClear}
            title="Clear chat"
            className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10
                       transition-colors duration-200"
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={isMinimized ? onMaximize : onMinimize}
            title={isMinimized ? 'Expand' : 'Minimize'}
            className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.06]
                       transition-colors duration-200"
          >
            <Minus size={14} />
          </button>
          <button
            onClick={onClose}
            title="Close chat"
            className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.06]
                       transition-colors duration-200"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* ─── COLLAPSIBLE BODY ─── */}
      <AnimatePresence mode="wait">
        {!isMinimized && (
          <motion.div
            key="chat-body"
            variants={minimizedVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col flex-1 min-h-0"
          >
            {/* ─── MESSAGES AREA ─── */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-3.5 py-3  scrollbar-thin
                         scrollbar-track-transparent scrollbar-thumb-white/10
                         hover:scrollbar-thumb-white/20"
              style={{ maxHeight: 'calc(75vh - 160px)', minHeight: '240px' }}
            >
              {/* Quick suggestions — show when only welcome message exists */}
              {messages.length <= 1 && (
                <div className="mb-4">
                  <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 flex items-center gap-1">
                    <Zap size={10} /> Quick suggestions
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {quickSuggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSuggestion(s)}
                        className="text-[11px] px-2.5 py-1 rounded-full
                                   bg-cyan-500/[0.07] border border-cyan-500/20
                                   text-cyan-300/70 hover:text-cyan-200 hover:bg-cyan-500/15
                                   hover:border-cyan-500/40 transition-all duration-200"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Rendered messages */}
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  onAddToCart={onAddToCart}
                  onViewProduct={onViewProduct}
                />
              ))}

              {/* Typing indicator */}
              <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>

            {/* ─── SCROLL TO BOTTOM ─── */}
            <AnimatePresence>
              {showScrollBtn && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => scrollToBottom()}
                  className="absolute bottom-[68px] left-1/2 -translate-x-1/2
                             w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/30
                             flex items-center justify-center text-cyan-400
                             hover:bg-cyan-500/30 transition-colors z-10"
                >
                  <ChevronDown size={14} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* ─── INPUT BAR ─── */}
            <form
              onSubmit={handleSubmit}
              className="relative flex items-center gap-2 px-3 py-2.5
                         border-t border-white/[0.06]"
            >
              {/* Subtle glow line */}
              <div className="absolute top-0 left-4 right-4 h-[1px]
                              bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about gaming gear..."
                className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-xl
                           px-3.5 py-2 text-[13px] text-white/90 placeholder-white/20
                           focus:outline-none focus:border-cyan-500/40 focus:bg-white/[0.06]
                           transition-all duration-200"
              />

              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600
                           text-white disabled:opacity-30 disabled:cursor-not-allowed
                           hover:shadow-[0_0_15px_rgba(0,224,255,0.3)]
                           active:scale-95 transition-all duration-200"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default React.memo(ChatWindow);
