import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Sparkles, ArrowDown, RotateCcw, History, Trash2 } from 'lucide-react';
import SelectionPanel from './SelectionPanel';
import RecommendationResults from './RecommendationResults';
import { generateRecommendation } from '../../utils/buildLogic';
import { Footer } from '../index';

const SAVED_BUILDS_KEY = 'nexus-ai-builds';

/* ───────── Animated Background Particles ───────── */
const ParticleBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(40)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-[2px] h-[2px] rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          backgroundColor: ['#00FF88', '#00E0FF', '#BD00FF'][i % 3],
          opacity: Math.random() * 0.4 + 0.1,
        }}
        animate={{
          y: [0, -30, 0],
          opacity: [0.1, 0.5, 0.1],
        }}
        transition={{
          duration: Math.random() * 4 + 3,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: Math.random() * 3,
        }}
      />
    ))}
  </div>
);

/* ───────── AI Loading Overlay ───────── */
const LoadingOverlay = ({ progress }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]/80 backdrop-blur-xl"
  >
    <div className="text-center max-w-md px-6">
      {/* Neural network animation */}
      <div className="relative w-32 h-32 mx-auto mb-8">
        {[0, 1, 2].map((ring) => (
          <motion.div
            key={ring}
            className="absolute inset-0 rounded-full border"
            style={{
              borderColor: ['#00FF88', '#00E0FF', '#BD00FF'][ring],
              opacity: 0.3,
              inset: `${ring * 12}px`,
            }}
            animate={{ rotate: ring % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 3 + ring, repeat: Infinity, ease: 'linear' }}
          />
        ))}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Cpu size={32} className="text-[#00FF88]" />
        </motion.div>
      </div>

      <motion.h3
        className="text-xl font-bold text-white mb-2"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        NEXUS AI Analyzing
      </motion.h3>

      <p className="text-sm text-white/40 mb-6">
        Processing game requirements, budget allocation, and peripheral synergy...
      </p>

      {/* Progress bar */}
      <div className="relative h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00FF88] via-[#00E0FF] to-[#BD00FF] rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Stage labels */}
      <div className="mt-4 flex justify-between text-[10px] text-white/20 uppercase tracking-widest">
        <span className={progress > 20 ? 'text-[#00FF88]/60' : ''}>Parsing</span>
        <span className={progress > 50 ? 'text-[#00E0FF]/60' : ''}>Matching</span>
        <span className={progress > 80 ? 'text-[#BD00FF]/60' : ''}>Optimizing</span>
      </div>
    </div>
  </motion.div>
);

/* ───────── Main Recommender Component ───────── */
const BuildRecommender = () => {
  const [config, setConfig] = useState({
    game: '',
    budget: 80000,
    resolution: '1080p',
    playstyle: 'competitive',
  });

  const [recommendation, setRecommendation] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [savedBuilds, setSavedBuilds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SAVED_BUILDS_KEY)) || [];
    } catch {
      return [];
    }
  });
  const [showHistory, setShowHistory] = useState(false);

  const resultsRef = useRef(null);

  // Load saved builds from localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(SAVED_BUILDS_KEY));
      if (Array.isArray(stored)) setSavedBuilds(stored);
    } catch {
      /* empty */
    }
  }, []);

  const handleGenerate = useCallback(() => {
    if (!config.game || isGenerating) return;

    setIsGenerating(true);
    setLoadingProgress(0);
    setRecommendation(null);

    // Simulate AI processing with staged progress
    const stages = [15, 35, 55, 72, 88, 100];
    let stageIndex = 0;

    const progressInterval = setInterval(() => {
      if (stageIndex < stages.length) {
        setLoadingProgress(stages[stageIndex]);
        stageIndex++;
      }
    }, 400);

    // Generate after simulated delay
    setTimeout(() => {
      clearInterval(progressInterval);
      setLoadingProgress(100);

      const result = generateRecommendation(config);
      setRecommendation(result);
      setIsGenerating(false);

      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 300);
    }, 2800);
  }, [config, isGenerating]);

  const handleSaveBuild = useCallback(() => {
    if (!recommendation) return;

    const build = {
      id: Date.now(),
      config: { ...config },
      recommendation,
      savedAt: new Date().toISOString(),
    };

    const updated = [build, ...savedBuilds].slice(0, 10);
    setSavedBuilds(updated);
    localStorage.setItem(SAVED_BUILDS_KEY, JSON.stringify(updated));
  }, [recommendation, config, savedBuilds]);

  const handleDeleteBuild = (buildId) => {
    const updated = savedBuilds.filter((b) => b.id !== buildId);
    setSavedBuilds(updated);
    localStorage.setItem(SAVED_BUILDS_KEY, JSON.stringify(updated));
  };

  const handleLoadBuild = (build) => {
    setConfig(build.config);
    setRecommendation(build.recommendation);
    setShowHistory(false);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleReset = () => {
    setConfig({ game: '', budget: 80000, resolution: '1080p', playstyle: 'competitive' });
    setRecommendation(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24">
      {/* ───── AI Loading Overlay ───── */}
      <AnimatePresence>
        {isGenerating && <LoadingOverlay progress={loadingProgress} />}
      </AnimatePresence>

      {/* ───── HERO SECTION ───── */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F14] via-[#0F172A] to-[#050505]" />

        {/* Radial glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00FF88]/[0.04] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#BD00FF]/[0.04] rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00E0FF]/[0.03] rounded-full blur-[200px]" />

        <ParticleBackground />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00FF88]/[0.08] border border-[#00FF88]/20 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
            <span className="text-xs font-bold text-[#00FF88] uppercase tracking-widest">
              AI-Powered Engine
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight mb-6"
          >
            <span className="bg-gradient-to-r from-[#00FF88] via-[#00E0FF] to-[#BD00FF] bg-clip-text text-transparent">
              FIND YOUR
            </span>
            <br />
            <span className="text-white">
              PERFECT{' '}
              <span className="bg-gradient-to-r from-[#BD00FF] via-[#00E0FF] to-[#00FF88] bg-clip-text text-transparent">
                SETUP
              </span>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-white/40 text-base sm:text-lg md:text-xl max-w-xl mx-auto mb-10 font-medium"
          >
            Performance engineered for domination.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex items-center justify-center gap-4"
          >
            <motion.button
              onClick={() => {
                document.getElementById('selection-panel')?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center',
                });
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 40px rgba(0,255,136,0.3), 0 0 80px rgba(0,255,136,0.1)',
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-[#00FF88]/20 to-[#00E0FF]/20 border border-[#00FF88]/30 text-white font-bold text-sm uppercase tracking-widest overflow-hidden transition-all duration-300 hover:border-[#00FF88]/60"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00FF88]/10 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles size={18} />
                Start Building
                <ArrowDown size={14} className="animate-bounce" />
              </span>
            </motion.button>

            {savedBuilds.length > 0 && (
              <motion.button
                onClick={() => setShowHistory((prev) => !prev)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/50 font-medium text-sm hover:text-white/80 hover:border-white/15 transition-all duration-300 flex items-center gap-2"
              >
                <History size={16} />
                <span className="hidden sm:inline">History</span>
                <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded">
                  {savedBuilds.length}
                </span>
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent" />
      </section>

      {/* ───── Build History Drawer ───── */}
      <AnimatePresence>
        {showHistory && savedBuilds.length > 0 && (
          <motion.section
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <div className="max-w-5xl mx-auto px-4 pb-10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <History size={18} className="text-[#00E0FF]" />
                Saved Builds
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {savedBuilds.map((build) => (
                  <motion.div
                    key={build.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-xl bg-white/[0.03] border border-white/[0.08] p-4 hover:border-white/15 transition-all cursor-pointer group"
                    onClick={() => handleLoadBuild(build)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm font-bold text-white capitalize">
                          {build.config.game.replace(/-/g, ' ')}
                        </p>
                        <p className="text-[11px] text-white/30">
                          {build.config.resolution} · {build.config.playstyle}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBuild(build.id);
                        }}
                        className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <p className="text-lg font-black bg-gradient-to-r from-[#00FF88] to-[#00E0FF] bg-clip-text text-transparent">
                      {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0,
                      }).format(build.recommendation.totalPrice)}
                    </p>
                    <p className="text-[10px] text-white/20 mt-1">
                      {new Date(build.savedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ───── SELECTION PANEL ───── */}
      <section id="selection-panel" className="relative py-16 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <SelectionPanel
            config={config}
            setConfig={setConfig}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </div>
      </section>

      {/* ───── RESULTS SECTION ───── */}
      <AnimatePresence>
        {recommendation && (
          <motion.section
            ref={resultsRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative py-16 px-4"
          >
            {/* Section glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00FF88]/[0.03] rounded-full blur-[200px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
              {/* Section header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10"
              >
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                  Your Recommended{' '}
                  <span className="bg-gradient-to-r from-[#00FF88] to-[#00E0FF] bg-clip-text text-transparent">
                    Build
                  </span>
                </h2>
                <p className="text-sm text-white/30">
                  Curated by NEXUS AI for{' '}
                  <span className="text-white/60 capitalize">{config.game.replace(/-/g, ' ')}</span>{' '}
                  at <span className="text-white/60">{config.resolution}</span>
                </p>
              </motion.div>

              <RecommendationResults
                recommendation={recommendation}
                onSaveBuild={handleSaveBuild}
              />

              {/* Rebuild button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-center mt-10"
              >
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/40 text-sm font-medium hover:text-white/70 hover:border-white/15 transition-all duration-300"
                >
                  <RotateCcw size={14} />
                  Start Over
                </button>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ───── FOOTER ───── */}
      <Footer />
    </div>
  );
};

export default BuildRecommender;
