import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import {
  Users,
  TrendingUp,
  Bell,
  Trophy,
  ArrowUp,
  Plus,
  Sparkles,
} from 'lucide-react';
import { fetchCommunityPosts, fetchCommunityPlayers } from '../store/communitySlice';
import CreatePost from '../components/community/CreatePost';
import CommunityFeed from '../components/community/CommunityFeed';
import PlayerCard from '../components/community/PlayerCard';
import PlayerProfile from '../components/community/PlayerProfile';
import NotificationPanel from '../components/community/NotificationPanel';
import AchievementBadge from '../components/community/AchievementBadge';
import { ACHIEVEMENTS, getUnlockedAchievements } from '../utils/achievementLogic';
import { Footer } from '../components';

const CommunityPage = () => {
  const dispatch = useDispatch();
  const { players, currentPlayer, loading } = useSelector((s) => s.community);
  const { unreadCount } = useSelector((s) => s.notifications);

  const [showGoToTop, setShowGoToTop] = useState(false);
  const [mobileCreateOpen, setMobileCreateOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(true);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setShowGoToTop(latest > 400);
  });

  useEffect(() => {
    dispatch(fetchCommunityPosts());
    dispatch(fetchCommunityPlayers());
  }, [dispatch]);

  // Sort by followers for trending
  const trendingPlayers = [...players]
    .sort((a, b) => b.followers - a.followers)
    .slice(0, 5);

  // Suggested: not trending
  const suggestedPlayers = [...players]
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 4);

  // Mock "my" achievements for sidebar
  const myAchievements = getUnlockedAchievements(['first_win', 'ten_wins', 'hundred_headshots']);
  const totalAchievements = ACHIEVEMENTS.length;

  return (
    <div className="min-h-screen bg-[#0B0F14] relative">
      {/* Background grid pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-60" />
        {/* Subtle glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/[0.02] rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/[0.02] rounded-full blur-[100px]" />
      </div>

      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 z-[60] origin-left"
        style={{
          scaleX: useScroll().scrollYProgress,
          background: 'linear-gradient(90deg, #00E0FF, #BD00FF, #00FF88)',
        }}
      />

      {/* Hero header */}
      <div className="relative z-10 pt-28 md:pt-32 pb-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.06] text-neutral-400 text-xs font-medium mb-5"
          >
            <Users size={13} className="text-cyan-400" />
            NEXUS Community Hub
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-white mb-3"
          >
            Connect with{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Gamers
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-500 text-sm md:text-base max-w-lg mx-auto"
          >
            Share your gaming moments, follow top players, earn achievements, and level up together.
          </motion.p>
          {/* Gradient separator */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-px max-w-md mx-auto mt-8 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ─── LEFT SIDEBAR (Desktop Only) ─── */}
          <aside className="hidden lg:block lg:col-span-3 space-y-5">
            {/* Trending Players */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-white/[0.06] overflow-hidden"
              style={{ background: 'rgba(15,15,20,0.8)', backdropFilter: 'blur(20px)' }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00FF88]/30 to-transparent" />
              <div className="px-5 py-4 flex items-center gap-2 border-b border-white/[0.06]">
                <TrendingUp size={15} className="text-[#00FF88]" />
                <h3 className="text-sm font-bold text-white">Trending Players</h3>
              </div>
              <div className="p-2">
                {trendingPlayers.map((p, i) => (
                  <PlayerCard key={p.id} player={p} index={i} compact />
                ))}
              </div>
            </motion.div>

            {/* Suggested Follows */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-white/[0.06] overflow-hidden"
              style={{ background: 'rgba(15,15,20,0.8)', backdropFilter: 'blur(20px)' }}
            >
              <div className="px-5 py-4 flex items-center gap-2 border-b border-white/[0.06]">
                <Sparkles size={15} className="text-purple-400" />
                <h3 className="text-sm font-bold text-white">Suggested</h3>
              </div>
              <div className="p-2">
                {suggestedPlayers.map((p, i) => (
                  <PlayerCard key={p.id} player={p} index={i} compact />
                ))}
              </div>
            </motion.div>
          </aside>

          {/* ─── CENTER FEED ─── */}
          <main className="lg:col-span-6 space-y-5">
            {/* Desktop Create Post */}
            <div className="hidden md:block">
              <CreatePost />
            </div>

            {/* Mobile Create Post button */}
            <div className="md:hidden">
              <AnimatePresence>
                {mobileCreateOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <CreatePost />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Feed */}
            <CommunityFeed />
          </main>

          {/* ─── RIGHT SIDEBAR (Desktop Only) ─── */}
          <aside className="hidden lg:block lg:col-span-3 space-y-5">
            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
            </motion.div>

            {/* Achievement Progress */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-white/[0.06] overflow-hidden"
              style={{ background: 'rgba(15,15,20,0.8)', backdropFilter: 'blur(20px)' }}
            >
              <div className="px-5 py-4 flex items-center gap-2 border-b border-white/[0.06]">
                <Trophy size={15} className="text-amber-400" />
                <h3 className="text-sm font-bold text-white">Achievements</h3>
                <span className="ml-auto text-[10px] text-neutral-600 font-medium">
                  {myAchievements.length}/{totalAchievements}
                </span>
              </div>
              <div className="p-5">
                {/* Progress bar */}
                <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(myAchievements.length / totalAchievements) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-500"
                    style={{ boxShadow: '0 0 12px rgba(251,191,36,0.4)' }}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {ACHIEVEMENTS.map((ach, i) => {
                    const unlocked = myAchievements.find((a) => a.id === ach.id);
                    return (
                      <div key={ach.id} className={unlocked ? '' : 'opacity-30 grayscale'}>
                        <AchievementBadge achievement={ach} index={i} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </aside>
        </div>
      </div>

      {/* Player Profile Modal */}
      {currentPlayer && <PlayerProfile />}

      {/* Mobile FAB */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        onClick={() => setMobileCreateOpen(!mobileCreateOpen)}
        className="md:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white flex items-center justify-center shadow-[0_0_30px_rgba(0,224,255,0.4)]"
      >
        <Plus size={24} className={`transition-transform duration-300 ${mobileCreateOpen ? 'rotate-45' : ''}`} />
      </motion.button>

      {/* Go to top */}
      <AnimatePresence>
        {showGoToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 left-6 z-50 w-11 h-11 rounded-full bg-white/[0.06] border border-white/[0.08] text-neutral-400 hover:text-white flex items-center justify-center backdrop-blur-xl hover:border-cyan-500/20 transition-all"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default CommunityPage;
