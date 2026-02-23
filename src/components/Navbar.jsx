import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { showLogoutToast } from "../utils/toast";
import {
  Heart,
  ShoppingCart,
  Zap,
  FileText,
  Trophy,
  Menu,
  X,
  ChevronDown,
  User,
  Headphones,
  Gamepad2,
  Grid3x3,
  LogOut,
  Shield,
  Keyboard,
  Mouse,
  Monitor,
  Cpu,
  Armchair,
  Crosshair,
  Mic,
  Camera,
  Flame,
  Users,
  MessageSquare,
  Award,
  Radio,
  BookOpen,
  Newspaper,
  TrendingUp,
  Swords,
  Package,
  Box,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useCart, useWishlist } from "../hooks";
import { logout } from "../store/authSlice";

/* ---------------- NAV DATA ---------------- */
const NAV_LINKS = [
  { name: "Store", path: "/store", hasDropdown: true, megaType: "store" },
  { name: "3D Store", path: "/virtual-store", icon: <Box size={16} /> },
  { name: "AI Build", path: "/ai-build", icon: <Cpu size={16} /> },
  { name: "Flash Sale", path: "/flash-sale", icon: <Flame size={16} /> },
  { name: "Explore", path: "/community", hasDropdown: true, megaType: "explore", icon: <Users size={16} /> },
];

const EXPLORE_SECTIONS = [
  {
    title: "Community",
    icon: <Users size={18} />,
    items: [
      { name: "Community Hub", icon: <MessageSquare size={15} />, path: "/community", desc: "Connect with gamers" },
      { name: "Player Profiles", icon: <User size={15} />, path: "/community", desc: "Find & follow players" },
      { name: "Achievements", icon: <Award size={15} />, path: "/community", desc: "Unlock badges" },
    ],
  },
  {
    title: "Esports",
    icon: <Trophy size={18} />,
    items: [
      { name: "Tournaments", icon: <Swords size={15} />, path: "/esports", desc: "Compete & win" },
      { name: "Live Matches", icon: <Radio size={15} />, path: "/esports", desc: "Watch live action" },
      { name: "Leaderboards", icon: <TrendingUp size={15} />, path: "/esports", desc: "Global rankings" },
    ],
  },
  {
    title: "Blog",
    icon: <BookOpen size={18} />,
    items: [
      { name: "Latest Articles", icon: <Newspaper size={15} />, path: "/blog", desc: "Gaming news & guides" },
      { name: "Trending", icon: <TrendingUp size={15} />, path: "/blog", desc: "Popular this week" },
      { name: "Editorials", icon: <FileText size={15} />, path: "/blog", desc: "Expert opinions" },
    ],
  },
];

const STORE_CATEGORIES = [
  {
    title: "Input Devices",
    icon: <Gamepad2 size={18} />,
    items: [
      { name: "Keyboards", icon: <Keyboard size={15} />, slug: "keyboard" },
      { name: "Mice", icon: <Mouse size={15} />, slug: "mouse" },
      { name: "Mousepads", icon: <Crosshair size={15} />, slug: "mousepad" },
      { name: "Controllers", icon: <Gamepad2 size={15} />, slug: "controller" },
    ],
  },
  {
    title: "Audio & Video",
    icon: <Headphones size={18} />,
    items: [
      { name: "Headsets", icon: <Headphones size={15} />, slug: "headset" },
      { name: "Microphones", icon: <Mic size={15} />, slug: "microphone" },
      { name: "Webcams", icon: <Camera size={15} />, slug: "webcam" },
      { name: "Monitors", icon: <Monitor size={15} />, slug: "monitor" },
    ],
  },
  {
    title: "Hardware",
    icon: <Grid3x3 size={18} />,
    items: [
      { name: "Graphics Cards", icon: <Cpu size={15} />, slug: "graphics card" },
      { name: "Gaming Chairs", icon: <Armchair size={15} />, slug: "gaming chair" },
    ],
  },
];

export const Navbar = () => {
  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();

  /* -------- SCROLL DETECTION -------- */
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 60);
  });

  useEffect(() => {
    setIsMobileOpen(false);
    setActiveDropdown(null);
    setMobileDropdown(null);
    setUserMenuOpen(false);
  }, [location]);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    showLogoutToast();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <motion.header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 pointer-events-none">
        {/* OUTER CONTAINER */}
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="w-full flex justify-center pointer-events-auto"
        >
          {/* ACTUAL NAV */}
          <motion.nav
            animate={{
              scale: isScrolled ? 0.94 : 1,
              borderRadius: isScrolled ? 9999 : 0,
              y: isScrolled ? 6 : 0,
            }}
            transition={{ type: "spring", stiffness: 220, damping: 28 }}
            className={`
              relative w-full max-w-[1300px]
              px-6 md:px-8
              h-16 md:h-20
              flex items-center justify-between
              transition-colors duration-500
              ${
                isScrolled
                  ? "bg-[#0a0a0a]/85 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
                  : "bg-transparent border border-transparent"
              }
            `}
          >
            {/* LOGO */}
            <Link
              to="/"
              className="flex items-center gap-3 group relative z-20"
            >
              <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-900 border border-white/10 group-hover:border-cyan-500/50 transition-colors duration-300">
                <Zap
                  size={20}
                  className="text-white group-hover:text-cyan-400 transition-colors"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tighter text-white leading-none">
                  NEXUS
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-500/80 font-medium">
                  Systems
                </span>
              </div>
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() =>
                    link.hasDropdown && setActiveDropdown(link.name)
                  }
                  onMouseLeave={() =>
                    link.hasDropdown && setActiveDropdown(null)
                  }
                >
                  <Link
                    to={link.path}
                    className={`
                      relative px-5 py-2.5 rounded-full text-sm font-medium
                      transition-all duration-300 flex items-center gap-2
                      ${
                        activeDropdown === link.name
                          ? "text-white bg-white/5"
                          : "text-neutral-400 hover:text-white hover:bg-white/5"
                      }
                    `}
                  >
                    {link.icon}
                    {link.name}
                    {link.hasDropdown && (
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-300 ${
                          activeDropdown === link.name
                            ? "rotate-180 text-cyan-400"
                            : ""
                        }`}
                      />
                    )}
                  </Link>

                  {/* MEGA MENU – PREMIUM GLASSMORPHISM */}
                  <AnimatePresence>
                    {link.hasDropdown &&
                      activeDropdown === link.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ type: "spring", stiffness: 300, damping: 28 }}
                          className={`absolute top-full mt-4 w-[820px] rounded-2xl border border-white/[0.08] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.8)] z-[60] ${
                            link.megaType === "explore"
                              ? "right-0"
                              : "left-1/2 -translate-x-1/2"
                          }`}
                          style={{ background: "rgba(10,10,12,0.95)", backdropFilter: "blur(24px) saturate(1.4)" }}
                        >
                          {/* Top accent line */}
                          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00E0FF]/40 to-transparent" />

                          <div className="p-7">
                            {/* STORE MEGA MENU */}
                            {link.megaType === "store" && (
                              <>
                                <div className="grid grid-cols-3 gap-8">
                                  {STORE_CATEGORIES.map((cat, idx) => (
                                    <div key={idx}>
                                      <div className="flex items-center gap-2.5 mb-4">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#00E0FF]/10 to-[#BD00FF]/10 text-[#00E0FF]">
                                          {cat.icon}
                                        </span>
                                        <h3 className="text-[13px] font-bold text-white tracking-wide uppercase">
                                          {cat.title}
                                        </h3>
                                      </div>
                                      <ul className="space-y-1">
                                        {cat.items.map((item) => (
                                          <li key={item.slug}>
                                            <Link
                                              to={`/store?category=${encodeURIComponent(item.slug)}`}
                                              onClick={() => setActiveDropdown(null)}
                                              className="group flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-white/[0.04] transition-all duration-200"
                                            >
                                              <span className="text-neutral-500 group-hover:text-[#00E0FF] transition-colors">
                                                {item.icon}
                                              </span>
                                              {item.name}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between">
                                  <Link
                                    to="/store"
                                    onClick={() => setActiveDropdown(null)}
                                    className="text-sm font-semibold text-[#00E0FF] hover:text-white transition-colors flex items-center gap-1.5"
                                  >
                                    Browse All Products
                                    <ChevronDown size={14} className="-rotate-90" />
                                  </Link>
                                  <Link
                                    to="/flash-sale"
                                    onClick={() => setActiveDropdown(null)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#00FF88]/10 to-[#00E0FF]/10 border border-[#00FF88]/20 text-[#00FF88] text-sm font-semibold hover:border-[#00FF88]/40 transition-all"
                                  >
                                    <Flame size={14} />
                                    Flash Sale Live
                                  </Link>
                                </div>
                              </>
                            )}

                            {/* EXPLORE MEGA MENU (Blog, Esports, Community) */}
                            {link.megaType === "explore" && (
                              <>
                                <div className="grid grid-cols-3 gap-8">
                                  {EXPLORE_SECTIONS.map((section, idx) => (
                                    <div key={idx}>
                                      <div className="flex items-center gap-2.5 mb-4">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#BD00FF]/10 to-[#00E0FF]/10 text-[#BD00FF]">
                                          {section.icon}
                                        </span>
                                        <h3 className="text-[13px] font-bold text-white tracking-wide uppercase">
                                          {section.title}
                                        </h3>
                                      </div>
                                      <ul className="space-y-1">
                                        {section.items.map((item) => (
                                          <li key={item.name}>
                                            <Link
                                              to={item.path}
                                              onClick={() => setActiveDropdown(null)}
                                              className="group flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-white/[0.04] transition-all duration-200"
                                            >
                                              <span className="text-neutral-500 group-hover:text-[#BD00FF] transition-colors mt-0.5">
                                                {item.icon}
                                              </span>
                                              <div>
                                                <span className="block font-medium">{item.name}</span>
                                                <span className="block text-[11px] text-neutral-600 mt-0.5">{item.desc}</span>
                                              </div>
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between">
                                  <Link
                                    to="/community"
                                    onClick={() => setActiveDropdown(null)}
                                    className="text-sm font-semibold text-[#BD00FF] hover:text-white transition-colors flex items-center gap-1.5"
                                  >
                                    Open Community Hub
                                    <ChevronDown size={14} className="-rotate-90" />
                                  </Link>
                                  <Link
                                    to="/esports"
                                    onClick={() => setActiveDropdown(null)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#BD00FF]/10 to-[#00E0FF]/10 border border-[#BD00FF]/20 text-[#BD00FF] text-sm font-semibold hover:border-[#BD00FF]/40 transition-all"
                                  >
                                    <Trophy size={14} />
                                    Live Tournaments
                                  </Link>
                                </div>
                              </>
                            )}
                          </div>
                        </motion.div>
                      )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-3">
              <NavIconBtn
                icon={<Package size={18} />}
                link="/orders"
                label="Orders"
              />
              <NavIconBtn
                icon={<Heart size={18} />}
                link="/wishlist"
                count={wishlistCount}
                label="Wishlist"
              />
              <NavIconBtn
                icon={<ShoppingCart size={18} />}
                link="/cart"
                count={cartCount}
                label="Cart"
              />
              {/* User / Auth button */}
              <div className="relative" ref={userMenuRef}>
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="relative group w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-white/5"
                      title={user?.name}
                    >
                      <img
                        src={user?.avatar}
                        alt={user?.name}
                        className="w-8 h-8 rounded-full border-2 border-transparent group-hover:border-cyan-500/50 transition-colors"
                      />
                    </button>
                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-3 w-56 rounded-2xl bg-[#0f0f10] border border-white/10 shadow-2xl backdrop-blur-xl p-2 z-50"
                        >
                          <div className="px-3 py-3 border-b border-white/[0.06] mb-1">
                            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                            <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                          </div>
                          {user?.role === 'admin' && (
                            <Link
                              to="/admin"
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-neutral-400 hover:text-[#00FF88] hover:bg-white/5 transition font-medium"
                            >
                              <Shield size={16} />
                              Admin Panel
                            </Link>
                          )}
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition font-medium"
                          >
                            <LogOut size={16} />
                            Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-all duration-300"
                  >
                    <User size={16} />
                    Sign In
                  </Link>
                )}
              </div>

              <button
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors"
              >
                <Menu size={22} />
              </button>
            </div>
          </motion.nav>
        </motion.div>
      </motion.header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-2 bottom-2 right-2 w-[85%] max-w-sm bg-[#0a0a0a] border border-white/10 rounded-3xl z-50 flex flex-col"
            >
              <div className="p-6 flex justify-between items-center border-b border-white/5">
                <span className="font-bold text-lg text-white">Menu</span>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 bg-white/5 rounded-full text-white hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {NAV_LINKS.map((link) => (
                  <div key={link.name}>
                    <button
                      onClick={() => {
                        if (link.hasDropdown) {
                          setMobileDropdown(
                            mobileDropdown === link.name ? null : link.name
                          );
                        } else {
                          setIsMobileOpen(false);
                        }
                      }}
                      className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {link.icon}
                        {link.name}
                      </div>
                      {link.hasDropdown && (
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${
                            mobileDropdown === link.name ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>

                    {/* MOBILE DROPDOWN */}
                    <AnimatePresence>
                      {link.hasDropdown &&
                        mobileDropdown === link.name && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-2 ml-4 space-y-2"
                          >
                            {link.megaType === "store" && STORE_CATEGORIES.map((cat) => (
                              <div key={cat.title}>
                                <h4 className="text-xs font-bold text-cyan-400 uppercase px-2 py-1">
                                  {cat.title}
                                </h4>
                                <div className="space-y-1">
                                  {cat.items.map((item) => (
                                    <Link
                                      key={item.slug}
                                      to={`/store?category=${encodeURIComponent(item.slug)}`}
                                      onClick={() => setIsMobileOpen(false)}
                                      className="flex items-center gap-2.5 p-2 pl-6 text-sm text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                    >
                                      <span className="text-neutral-500">{item.icon}</span>
                                      {item.name}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                            {link.megaType === "explore" && EXPLORE_SECTIONS.map((section) => (
                              <div key={section.title}>
                                <h4 className="text-xs font-bold text-purple-400 uppercase px-2 py-1">
                                  {section.title}
                                </h4>
                                <div className="space-y-1">
                                  {section.items.map((item) => (
                                    <Link
                                      key={item.name}
                                      to={item.path}
                                      onClick={() => setIsMobileOpen(false)}
                                      className="flex items-center gap-2.5 p-2 pl-6 text-sm text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                    >
                                      <span className="text-neutral-500">{item.icon}</span>
                                      <div>
                                        <span className="block">{item.name}</span>
                                        <span className="block text-[10px] text-neutral-600">{item.desc}</span>
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* MOBILE FOOTER */}
              <div className="p-6 border-t border-white/5 space-y-3">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 px-2 mb-3">
                      <img src={user?.avatar} alt={user?.name} className="w-9 h-9 rounded-full border border-white/10" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                        <p className="text-[10px] text-neutral-500 truncate">{user?.email}</p>
                      </div>
                    </div>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMobileOpen(false)}
                        className="block w-full py-3 rounded-xl bg-[#00FF88]/10 text-[#00FF88] font-bold text-sm text-center hover:bg-[#00FF88]/20 transition-colors"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => { handleLogout(); setIsMobileOpen(false); }}
                      className="block w-full py-3 rounded-xl bg-red-500/10 text-red-400 font-bold text-sm text-center hover:bg-red-500/20 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileOpen(false)}
                    className="block w-full py-3 rounded-xl bg-cyan-500 text-black font-bold text-sm hover:bg-cyan-400 transition-colors text-center"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

/* ---------------- ICON BUTTON COMPONENT ---------------- */
const NavIconBtn = ({ icon, link, count, label }) => {
  // FIX: Make sure this evaluates to a strict boolean so React doesn't render "0"
  const hasItems = Number(count) > 0;
  
  return (
    <Link
      to={link || "#"}
      className="relative group"
      title={label}
    >
      <div className="w-10 h-10 flex items-center justify-center rounded-full text-neutral-400 hover:text-cyan-400 hover:bg-white/5 transition-all duration-300">
        {icon}
      </div>
      {hasItems && (
        <span className="absolute top-0 right-0 w-5 h-5 bg-cyan-500 text-black text-[10px] font-bold flex items-center justify-center rounded-full">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
};

export default Navbar;