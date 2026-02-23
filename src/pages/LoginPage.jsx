import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { loginUser, clearAuthError } from '../store/authSlice';
import { showLoginSuccessToast, showLoginErrorToast } from '../utils/toast';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, loading, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'admin' ? '/admin' : '/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Clear errors on unmount
  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 4) errs.password = 'Min 4 characters';
    return errs;
  };

  const fieldErrors = validate();
  const isValid = Object.keys(fieldErrors).length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (isValid) {
      const result = await dispatch(loginUser(form));
      if (loginUser.fulfilled.match(result)) {
        showLoginSuccessToast(result.payload.user?.name || result.payload.user?.email);
      } else if (loginUser.rejected.match(result)) {
        showLoginErrorToast(result.payload);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#00FF88]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#00E0FF]/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-neutral-900 border border-white/10 group-hover:border-[#00FF88]/50 transition-colors">
              <Zap size={24} className="text-white group-hover:text-[#00FF88] transition-colors" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-2xl tracking-tighter text-white leading-none">NEXUS</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#00E0FF]/80 font-medium">Systems</span>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-neutral-500 text-sm">Sign in to your NEXUS account</p>
          </div>

          {/* Server error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-3 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-2 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onBlur={() => setTouched({ ...touched, email: true })}
                  placeholder="admin@gmail.com"
                  className={`w-full pl-11 pr-4 py-3 bg-white/[0.03] border rounded-xl text-white placeholder-neutral-600 text-sm outline-none transition-all focus:bg-white/[0.05] ${
                    touched.email && fieldErrors.email
                      ? 'border-red-500/50 focus:border-red-500'
                      : 'border-white/[0.08] focus:border-[#00FF88]/50'
                  }`}
                />
              </div>
              {touched.email && fieldErrors.email && (
                <p className="text-red-400 text-xs mt-1.5 pl-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onBlur={() => setTouched({ ...touched, password: true })}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-11 py-3 bg-white/[0.03] border rounded-xl text-white placeholder-neutral-600 text-sm outline-none transition-all focus:bg-white/[0.05] ${
                    touched.password && fieldErrors.password
                      ? 'border-red-500/50 focus:border-red-500'
                      : 'border-white/[0.08] focus:border-[#00FF88]/50'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {touched.password && fieldErrors.password && (
                <p className="text-red-400 text-xs mt-1.5 pl-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-[#00FF88] to-[#00E0FF] text-[#050505] hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 pt-6 border-t border-white/[0.06]">
            <p className="text-neutral-500 text-xs mb-3 text-center uppercase tracking-wider font-medium">
              Demo Accounts
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({ email: 'admin@gmail.com', password: 'admin123' })}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#00FF88]/30 hover:bg-white/[0.05] transition text-left"
              >
                <p className="text-xs font-bold text-[#00FF88]">Admin</p>
                <p className="text-[10px] text-neutral-500 mt-0.5">admin@gmail.com</p>
              </button>
              <button
                type="button"
                onClick={() => setForm({ email: 'user@gmail.com', password: 'user123' })}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#00E0FF]/30 hover:bg-white/[0.05] transition text-left"
              >
                <p className="text-xs font-bold text-[#00E0FF]">User</p>
                <p className="text-[10px] text-neutral-500 mt-0.5">user@gmail.com</p>
              </button>
            </div>
          </div>
        </div>

        {/* Back link */}
        <p className="text-center mt-6 text-sm text-neutral-600">
          <Link to="/" className="hover:text-white transition">← Back to store</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
