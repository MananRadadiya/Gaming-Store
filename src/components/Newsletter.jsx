import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section className="relative py-28 overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-radial from-[#00FF88]/[0.06] via-transparent to-transparent rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto"
        >
          {/* Glassmorphism Card */}
          <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.06] p-10 sm:p-14 text-center backdrop-blur-xl overflow-hidden">
            {/* Inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-60 h-40 bg-[#00FF88]/[0.06] rounded-full blur-[80px] pointer-events-none" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#00FF88] text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                <Sparkles size={12} />
                Stay Ahead
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
                Join the{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF88] to-[#00E0FF]">
                  NEXUS
                </span>{' '}
                Community
              </h2>

              <p className="text-white/35 text-sm sm:text-base max-w-md mx-auto mb-10 leading-relaxed">
                Get exclusive drops, early access to sales, pro-gaming tips, and insider
                news delivered straight to your inbox.
              </p>

              <form onSubmit={handleSubmit} className="relative max-w-md mx-auto">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center justify-center gap-3 py-4 text-[#00FF88]"
                    >
                      <CheckCircle size={20} />
                      <span className="font-bold text-sm">You&apos;re in! Welcome to the squad.</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative"
                    >
                      <div
                        className={`relative flex items-center rounded-2xl border transition-all duration-500 ${
                          focused
                            ? 'border-[#00FF88]/30 shadow-[0_0_30px_rgba(0,255,136,0.1)]'
                            : 'border-white/[0.08]'
                        } bg-white/[0.03]`}
                      >
                        <Mail
                          size={18}
                          className={`absolute left-4 transition-colors duration-300 ${
                            focused ? 'text-[#00FF88]' : 'text-white/20'
                          }`}
                        />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setFocused(true)}
                          onBlur={() => setFocused(false)}
                          placeholder="Enter your email"
                          className="w-full bg-transparent pl-12 pr-36 py-4 text-white text-sm placeholder-white/20 focus:outline-none"
                          required
                        />
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          type="submit"
                          className="absolute right-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00FF88] to-[#00E0FF] text-[#050505] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-shadow duration-300"
                        >
                          Subscribe
                          <ArrowRight size={13} />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="text-white/15 text-[11px] mt-4">
                  No spam ever. Unsubscribe anytime. We respect your inbox.
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
