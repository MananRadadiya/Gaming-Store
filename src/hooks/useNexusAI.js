/**
 * ═══════════════════════════════════════════════════════════════
 * useNexusAI — Custom hook for the NEXUS AI chatbot
 * ═══════════════════════════════════════════════════════════════
 *
 * Manages chat state, product cache, message persistence,
 * and interfaces with the aiLogic engine.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../store/productsSlice';
import { addToCart } from '../store/cartSlice';
import { processQuery, getWelcomeMessage } from '../utils/aiLogic';

const STORAGE_KEY = 'nexus_ai_chat';
const TYPING_DELAY_MIN = 600;
const TYPING_DELAY_MAX = 1400;

/** Generate a unique message id */
const uid = () => `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

/** Random delay to simulate "thinking" */
const thinkDelay = () =>
  Math.floor(Math.random() * (TYPING_DELAY_MAX - TYPING_DELAY_MIN)) + TYPING_DELAY_MIN;

/**
 * Load persisted chat messages from localStorage.
 * Returns the welcome message if nothing is stored.
 */
const loadMessages = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    /* corrupted storage — ignore */
  }
  return [getWelcomeMessage()];
};

/** Persist messages to localStorage */
const saveMessages = (messages) => {
  try {
    // Keep only last 100 messages to avoid bloat
    const trimmed = messages.slice(-100);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    /* storage full — ignore */
  }
};

export default function useNexusAI() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Products from Redux store
  const reduxProducts = useSelector((state) => state.products.products);
  const productsLoading = useSelector((state) => state.products.loading);
  const lastFetchedAt = useSelector((state) => state.products.lastFetchedAt);

  // Local product cache — avoids re-renders from Redux for the bot
  const productsRef = useRef([]);

  // Chat state
  const [messages, setMessages] = useState(loadMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // ── Sync products into the ref whenever Redux updates ──
  useEffect(() => {
    if (reduxProducts.length > 0) {
      productsRef.current = reduxProducts;
    }
  }, [reduxProducts]);

  // ── Fetch products once if not already loaded ──
  useEffect(() => {
    if (reduxProducts.length === 0 && !productsLoading && !lastFetchedAt) {
      dispatch(fetchProducts());
    }
  }, [dispatch, reduxProducts.length, productsLoading, lastFetchedAt]);

  // ── Persist messages whenever they change ──
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  // ── Reset unread when chat is opened ──
  useEffect(() => {
    if (isOpen && !isMinimized) setUnreadCount(0);
  }, [isOpen, isMinimized]);

  /* ──────────────────────────────────────────────────────────────
     SEND MESSAGE
     ────────────────────────────────────────────────────────────── */
  const sendMessage = useCallback(
    (text) => {
      if (!text?.trim()) return;

      const userMsg = {
        id: uid(),
        role: 'user',
        type: 'text',
        text: text.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      // Simulate processing delay
      setTimeout(() => {
        const response = processQuery(text, productsRef.current);

        const botMsg = {
          id: uid(),
          role: 'bot',
          type: response.type,
          text: response.text,
          products: response.products || [],
          intent: response.intent,
          totalFound: response.totalFound,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);

        // Increment unread if minimized or closed
        if (!isOpen || isMinimized) {
          setUnreadCount((c) => c + 1);
        }
      }, thinkDelay());
    },
    [isOpen, isMinimized]
  );

  /* ──────────────────────────────────────────────────────────────
     ACTIONS — Add to cart, navigate, etc.
     ────────────────────────────────────────────────────────────── */

  /** Add a product to cart from within the chat */
  const handleAddToCart = useCallback(
    (product) => {
      dispatch(addToCart(product));

      const confirmMsg = {
        id: uid(),
        role: 'bot',
        type: 'text',
        text: `✅ **${product.name}** has been added to your cart!`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, confirmMsg]);
    },
    [dispatch]
  );

  /** Navigate to a product page */
  const handleViewProduct = useCallback(
    (product) => {
      navigate(`/product/${product.id}`);
      setIsOpen(false); // close chat to show product page
    },
    [navigate]
  );

  /* ──────────────────────────────────────────────────────────────
     CHAT CONTROLS
     ────────────────────────────────────────────────────────────── */

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) setIsMinimized(false); // opening → unminimize
      return !prev;
    });
  }, []);

  const minimizeChat = useCallback(() => {
    setIsMinimized(true);
  }, []);

  const maximizeChat = useCallback(() => {
    setIsMinimized(false);
  }, []);

  const clearChat = useCallback(() => {
    const welcome = getWelcomeMessage();
    setMessages([welcome]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  /* ──────────────────────────────────────────────────────────────
     QUICK SUGGESTIONS
     ────────────────────────────────────────────────────────────── */
  const quickSuggestions = [
    'Best gaming keyboard',
    'Wireless mouse under 8000',
    'Top rated headset',
    'Show me GPUs',
    'RGB mechanical keyboard',
    'Budget gaming chair',
  ];

  return {
    messages,
    isTyping,
    isOpen,
    isMinimized,
    unreadCount,
    productsLoading,
    sendMessage,
    handleAddToCart,
    handleViewProduct,
    toggleChat,
    minimizeChat,
    maximizeChat,
    clearChat,
    quickSuggestions,
  };
}
