import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  LogOut,
  Zap,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { logout } from '../../store/authSlice';

const SIDEBAR_LINKS = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Add Product', path: '/admin/add-product', icon: PlusCircle },
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/', { replace: true });
  };

  const isActive = (path) => location.pathname === path;

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 py-6 border-b border-white/[0.06] ${collapsed && !isMobile ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-gradient-to-br from-[#00FF88]/20 to-[#00E0FF]/20 border border-[#00FF88]/20 flex-shrink-0">
          <Zap size={18} className="text-[#00FF88]" />
        </div>
        {(!collapsed || isMobile) && (
          <div className="flex flex-col">
            <span className="font-bold text-sm text-white leading-none">NEXUS</span>
            <span className="text-[9px] uppercase tracking-[0.15em] text-[#00E0FF]/70 font-medium">Admin</span>
          </div>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {SIDEBAR_LINKS.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => isMobile && setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                active
                  ? 'bg-[#00FF88]/10 text-[#00FF88]'
                  : 'text-neutral-500 hover:text-white hover:bg-white/[0.04]'
              } ${collapsed && !isMobile ? 'justify-center' : ''}`}
              title={collapsed && !isMobile ? link.name : undefined}
            >
              {active && (
                <motion.div
                  layoutId="admin-sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-[#00FF88]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon size={18} className="flex-shrink-0" />
              {(!collapsed || isMobile) && <span>{link.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 pb-4 space-y-2 border-t border-white/[0.06] pt-4">
        {(!collapsed || isMobile) && (
          <div className="flex items-center gap-3 px-3 py-2">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-8 h-8 rounded-full border border-white/10"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-neutral-500 truncate">{user?.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all ${
            collapsed && !isMobile ? 'justify-center' : ''
          }`}
          title="Logout"
        >
          <LogOut size={18} />
          {(!collapsed || isMobile) && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden lg:flex flex-col bg-[#0a0a0a] border-r border-white/[0.06] relative flex-shrink-0"
      >
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center text-neutral-500 hover:text-white hover:border-white/20 transition z-10"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </motion.aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-[260px] bg-[#0a0a0a] border-r border-white/[0.06] z-50 lg:hidden"
            >
              <SidebarContent isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/[0.06] bg-[#0a0a0a]/50 backdrop-blur-xl flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-sm font-bold text-white capitalize">
              {location.pathname === '/admin'
                ? 'Dashboard'
                : location.pathname.split('/').pop().replace('-', ' ')}
            </h2>
          </div>
          <Link
            to="/"
            className="text-xs text-neutral-500 hover:text-[#00FF88] transition font-medium"
          >
            ← Back to Store
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
