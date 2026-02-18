import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Heart, ShoppingCart, Zap, FileText, Trophy, 
  Search, Menu, X, ChevronDown, User, Headphones, Gamepad2, Grid3x3
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

// --- Mock Hooks (Keep your existing import path) ---
// import { useCart, useWishlist } from '../hooks'; 
const useCart = () => ({ count: 2 });
const useWishlist = () => ({ count: 5 });

// --- Configuration & Data ---
const NAV_LINKS = [
  { name: 'Store', path: '/store', hasDropdown: true },
  { name: 'Esports', path: '/esports', icon: <Trophy size={16} /> },
  { name: 'Blog', path: '/blog', icon: <FileText size={16} /> },
];

const STORE_CATEGORIES = [
  { 
    title: 'Input Devices', 
    icon: <Gamepad2 size={18} />,
    items: ['Keyboards', 'Mice', 'Mousepads', 'Controllers'] 
  },
  { 
    title: 'Audio & Video', 
    icon: <Headphones size={18} />,
    items: ['Headsets', 'Microphones', 'Webcams', 'Monitors'] 
  },
  { 
    title: 'Hardware', 
    icon: <Grid3x3 size={18} />,
    items: ['Graphics Cards', 'Gaming Chairs'] 
  },
];

export const Navbar = () => {
  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  
  // Scroll Logic
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Interaction State
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const shouldBeScrolled = latest > 50;
    if (shouldBeScrolled !== isScrolled) setIsScrolled(shouldBeScrolled);
  });

  useEffect(() => {
    setIsMobileOpen(false);
    setActiveDropdown(null);
  }, [location]);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none pt-4 md:pt-6"
      >
        <motion.nav
          layout
          initial={{ y: -100, opacity: 0 }}
          animate={{ 
            y: 0, 
            opacity: 1,
            width: isScrolled ? "fit-content" : "100%",
            maxWidth: isScrolled ? "1152px" : "100%", // 6xl
            borderRadius: isScrolled ? "9999px" : "0px",
          }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className={`
            pointer-events-auto relative px-6 md:px-8 h-16 md:h-20 flex items-center justify-between
            transition-all duration-500 ease-out
            ${isScrolled 
              ? 'bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] shadow-cyan-500/5' 
              : 'bg-transparent border-transparent'
            }
          `}
          style={{
             // Hardware acceleration hint
             willChange: "width, borderRadius, background",
          }}
        >
          {/* --- Brand / Logo --- */}
          <Link to="/" className="flex items-center gap-3 group relative z-20">
            <div className="relative w-10 h-10 flex items-center justify-center overflow-hidden rounded-xl bg-neutral-900 border border-white/10 group-hover:border-cyan-500/50 transition-colors duration-300">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Zap size={20} className="text-white relative z-10 group-hover:text-cyan-400 transition-colors" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tighter text-white leading-none">NEXUS</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-500/80 font-medium">Systems</span>
            </div>
          </Link>

          {/* --- Desktop Navigation --- */}
          <div className="hidden md:flex items-center gap-1 mx-8">
            {NAV_LINKS.map((link) => (
              <div 
                key={link.name}
                className="relative"
                onMouseEnter={() => link.hasDropdown && setActiveDropdown('Store')}
                onMouseLeave={() => link.hasDropdown && setActiveDropdown(null)}
              >
                <Link
                  to={link.path}
                  className={`
                    relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2
                    ${activeDropdown === 'Store' && link.name === 'Store' ? 'text-white bg-white/5' : 'text-neutral-400 hover:text-white hover:bg-white/5'}
                  `}
                >
                  {link.icon}
                  {link.name}
                  {link.hasDropdown && (
                    <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'Store' ? 'rotate-180 text-cyan-400' : ''}`} />
                  )}
                  
                  {/* Active Indicator Dot */}
                  {link.path === location.pathname && (
                     <motion.div layoutId="navDot" className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                  )}
                </Link>

                {/* --- Mega Menu (HUD Style) --- */}
                <AnimatePresence>
                  {link.hasDropdown && activeDropdown === 'Store' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: 8, scale: 0.98, filter: "blur(4px)" }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[700px] p-1 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)] backdrop-blur-2xl overflow-hidden"
                    >
                      <div className="bg-[#0f0f10] rounded-xl p-8 grid grid-cols-3 gap-8 relative overflow-hidden">
                        {/* Ambient Glow */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />

                        {STORE_CATEGORIES.map((cat, idx) => (
                          <div key={idx} className="relative z-10 group/col">
                            <div className="flex items-center gap-2 mb-4 text-white">
                              <span className="p-1.5 rounded-lg bg-white/5 text-cyan-400 group-hover/col:bg-cyan-500/10 transition-colors">
                                {cat.icon}
                              </span>
                              <h3 className="text-sm font-bold tracking-wide">{cat.title}</h3>
                            </div>
                            <ul className="space-y-3">
                              {cat.items.map((item) => (
                                <li key={item}>
                                  <Link 
                                    to={`/store?cat=${item}`} 
                                    className="text-sm text-neutral-500 hover:text-white transition-colors flex items-center justify-between group/item"
                                  >
                                    {item}
                                    <span className="w-1 h-1 bg-cyan-500 rounded-full opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300" />
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      
                      {/* Footer of Dropdown */}
                      <div className="px-6 py-3 bg-white/5 flex justify-between items-center text-xs text-neutral-400">
                        <div className="flex gap-4">
                          <span>🚀 Same-day Delivery</span>
                          <span>🛡️ 2-Year Warranty</span>
                        </div>
                        <Link to="/deals" className="text-white hover:text-cyan-400 transition-colors">
                          View All Offers &rarr;
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* --- Right Actions --- */}
          <div className="flex items-center gap-1.5 md:gap-3">
             {/* Desktop Search */}
            <div className="relative hidden md:flex items-center group">
              <motion.div 
                animate={{ width: isSearchOpen ? 240 : 40, backgroundColor: isSearchOpen ? "rgba(255,255,255,0.05)" : "transparent" }}
                className="h-10 rounded-full border border-transparent flex items-center overflow-hidden transition-colors border-white/0 focus-within:border-white/10"
              >
                <button 
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="w-10 h-10 flex items-center justify-center text-neutral-400 group-hover:text-white transition-colors flex-shrink-0"
                >
                  <Search size={18} />
                </button>
                <input 
                  type="text" 
                  placeholder="Search Nexus..." 
                  className={`bg-transparent border-none outline-none text-sm text-white placeholder-neutral-600 w-full pr-4 ${!isSearchOpen && 'pointer-events-none'}`}
                />
              </motion.div>
            </div>

            <div className="h-4 w-px bg-white/10 hidden md:block" />

            <NavIconBtn icon={<Heart size={18} />} link="/wishlist" count={wishlistCount} />
            <NavIconBtn icon={<ShoppingCart size={18} />} link="/cart" count={cartCount} />
            
            <div className="hidden md:block">
               <NavIconBtn icon={<User size={18} />} link="/profile" />
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full text-white hover:bg-white/10 active:scale-95 transition-all"
            >
              <Menu size={22} />
            </button>
          </div>
        </motion.nav>
      </motion.header>

      {/* --- Mobile Floating Sheet --- */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            />
            
            {/* Slide-in Sheet */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-2 bottom-2 right-2 w-[85%] max-w-sm bg-[#0a0a0a] border border-white/10 rounded-3xl z-50 flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 flex justify-between items-center border-b border-white/5">
                <span className="font-bold text-lg text-white">Menu</span>
                <button 
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 bg-white/5 rounded-full text-white hover:bg-white/10"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Links */}
              <div className="flex-1 overflow-y-auto p-6 space-y-2">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link 
                      to={link.path}
                      onClick={() => setIsMobileOpen(false)}
                      className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-cyan-500/30"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-cyan-400">{link.icon || <Monitor size={18} />}</span>
                        <span className="font-medium text-lg text-white">{link.name}</span>
                      </div>
                      <ChevronDown className="-rotate-90 text-neutral-500 group-hover:text-white transition-colors" size={16} />
                    </Link>
                  </motion.div>
                ))}

                <div className="h-px bg-white/10 my-6" />
                
                <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4">Categories</h4>
                <div className="grid grid-cols-2 gap-3">
                   {STORE_CATEGORIES.map((cat, i) => (
                      <Link 
                        key={i} 
                        to={`/store?c=${cat.title}`}
                        onClick={() => setIsMobileOpen(false)}
                        className="p-3 rounded-xl bg-neutral-900 border border-white/5 hover:border-cyan-500/50 flex flex-col items-center gap-2 text-center transition-colors"
                      >
                         <span className="text-neutral-400">{cat.icon}</span>
                         <span className="text-xs text-white font-medium">{cat.title}</span>
                      </Link>
                   ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 bg-neutral-900 border-t border-white/5 grid grid-cols-2 gap-4">
                <Link to="/profile" className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 text-white text-sm font-medium">
                  <User size={16} /> Profile
                </Link>
                <Link to="/settings" className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 text-white text-sm font-medium">
                  <Zap size={16} /> Support
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// --- Reusable Micro-Components ---

const NavIconBtn = ({ icon, link, count }) => {
  return (
    <Link to={link || '#'} className="relative group">
      <div className="w-10 h-10 flex items-center justify-center rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-all active:scale-95">
        {icon}
      </div>
      {count > 0 && (
        <span className="absolute top-1 right-1 w-4 h-4 bg-cyan-500 text-[#000] text-[10px] font-bold flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(6,182,212,0.6)]">
          {count}
        </span>
      )}
      {/* Hover Glow */}
      <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </Link>
  );
};