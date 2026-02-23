import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, ChevronDown, Monitor, Crosshair, Sparkles } from 'lucide-react';
import BudgetSlider from './BudgetSlider';
import { GAMES, RESOLUTIONS, PLAYSTYLES } from '../../utils/buildLogic';

const GAME_ICONS = {
  valorant: '🎯',
  'counter-strike-2': '🔫',
  'league-of-legends': '⚔️',
  'apex-legends': '🦅',
  'cyberpunk-2077': '🌆',
  'fortnite': '🏗️',
};

const PLAYSTYLE_INFO = {
  casual: { icon: '🎮', desc: 'Weekend warrior, smooth gameplay' },
  competitive: { icon: '🏆', desc: 'Ranked grinder, high FPS focus' },
  pro: { icon: '⚡', desc: 'Tournament-ready, zero compromise' },
};

const SelectionPanel = ({ config, setConfig, onGenerate, isGenerating }) => {
  const { game, budget, resolution, playstyle } = config;

  const updateField = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative max-w-3xl mx-auto"
    >
      {/* Outer glow */}
      <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-[#00FF88]/20 via-[#00E0FF]/20 to-[#BD00FF]/20 blur-sm" />
      <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-[#00FF88]/10 via-transparent to-[#BD00FF]/10" />

      {/* Glass card */}
      <div className="relative rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-6 sm:p-8 lg:p-10 overflow-hidden">
        {/* Internal glow orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#BD00FF]/[0.05] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00FF88]/[0.05] rounded-full blur-[100px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00FF88]/20 to-[#00E0FF]/20 border border-[#00FF88]/20">
            <Sparkles size={20} className="text-[#00FF88]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Configure Your Build</h3>
            <p className="text-xs text-white/40">Powered by NEXUS AI Engine</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* ───── Game Selection ───── */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-white/80 uppercase tracking-wider flex items-center gap-2">
              <Gamepad2 size={14} className="text-[#00E0FF]" />
              Game
            </label>
            <div className="relative">
              <select
                value={game}
                onChange={(e) => updateField('game', e.target.value)}
                className="w-full appearance-none bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3.5 pr-10 text-white text-sm font-medium focus:outline-none focus:border-[#00FF88]/50 focus:ring-1 focus:ring-[#00FF88]/20 transition-all duration-300 cursor-pointer hover:bg-white/[0.06]"
              >
                <option value="" disabled className="bg-[#0B0F14] text-white/50">
                  Select a game...
                </option>
                {GAMES.map((g) => (
                  <option key={g.value} value={g.value} className="bg-[#0B0F14] text-white">
                    {GAME_ICONS[g.value] || '🎮'} {g.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
              />
            </div>
            {/* Game quickpicks */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {GAMES.map((g) => (
                <button
                  key={g.value}
                  onClick={() => updateField('game', g.value)}
                  className={`py-2 px-2 rounded-lg text-center transition-all duration-300 border text-[11px] font-semibold ${
                    game === g.value
                      ? 'bg-[#00FF88]/10 border-[#00FF88]/40 text-[#00FF88] shadow-[0_0_20px_rgba(0,255,136,0.1)]'
                      : 'bg-white/[0.02] border-white/[0.06] text-white/50 hover:text-white/80 hover:border-white/15'
                  }`}
                >
                  <span className="text-base block mb-0.5">{GAME_ICONS[g.value]}</span>
                  <span className="truncate block">{g.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ───── Budget Slider ───── */}
          <BudgetSlider value={budget} onChange={(val) => updateField('budget', val)} />

          {/* ───── Resolution Toggle ───── */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-white/80 uppercase tracking-wider flex items-center gap-2">
              <Monitor size={14} className="text-[#BD00FF]" />
              Resolution Target
            </label>
            <div className="flex gap-2">
              {RESOLUTIONS.map((res) => (
                <button
                  key={res}
                  onClick={() => updateField('resolution', res)}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 border relative overflow-hidden ${
                    resolution === res
                      ? 'bg-gradient-to-b from-[#BD00FF]/20 to-[#BD00FF]/5 border-[#BD00FF]/40 text-white shadow-[0_0_25px_rgba(189,0,255,0.15)]'
                      : 'bg-white/[0.03] border-white/[0.06] text-white/40 hover:text-white/70 hover:border-white/15'
                  }`}
                >
                  {resolution === res && (
                    <motion.div
                      layoutId="resolution-active"
                      className="absolute inset-0 bg-[#BD00FF]/10 rounded-xl"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{res}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ───── Playstyle Toggle ───── */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-white/80 uppercase tracking-wider flex items-center gap-2">
              <Crosshair size={14} className="text-[#00E0FF]" />
              Playstyle
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PLAYSTYLES.map((style) => {
                const info = PLAYSTYLE_INFO[style];
                return (
                  <button
                    key={style}
                    onClick={() => updateField('playstyle', style)}
                    className={`py-3 px-3 rounded-xl transition-all duration-300 border text-left relative overflow-hidden ${
                      playstyle === style
                        ? 'bg-gradient-to-b from-[#00E0FF]/15 to-[#00E0FF]/5 border-[#00E0FF]/40 shadow-[0_0_25px_rgba(0,224,255,0.12)]'
                        : 'bg-white/[0.03] border-white/[0.06] hover:border-white/15'
                    }`}
                  >
                    <div className="text-lg mb-1">{info.icon}</div>
                    <div
                      className={`text-sm font-bold capitalize ${
                        playstyle === style ? 'text-[#00E0FF]' : 'text-white/60'
                      }`}
                    >
                      {style}
                    </div>
                    <div className="text-[10px] text-white/30 mt-0.5 leading-tight hidden sm:block">
                      {info.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ───── Generate Button ───── */}
          <motion.button
            onClick={onGenerate}
            disabled={!game || isGenerating}
            whileHover={{ scale: game && !isGenerating ? 1.02 : 1 }}
            whileTap={{ scale: game && !isGenerating ? 0.98 : 1 }}
            className={`w-full relative group py-4 rounded-xl font-bold text-base uppercase tracking-widest transition-all duration-500 overflow-hidden ${
              !game
                ? 'bg-white/[0.06] text-white/20 cursor-not-allowed border border-white/[0.05]'
                : isGenerating
                ? 'bg-white/[0.06] text-white/50 cursor-wait border border-[#00FF88]/20'
                : 'bg-gradient-to-r from-[#00FF88]/20 via-[#00E0FF]/20 to-[#BD00FF]/20 text-white border border-[#00FF88]/30 hover:border-[#00FF88]/60 hover:shadow-[0_0_40px_rgba(0,255,136,0.2)]'
            }`}
          >
            {/* Animated gradient sweep */}
            {game && !isGenerating && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isGenerating ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-[#00FF88]/30 border-t-[#00FF88] rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                  AI Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate AI Build
                </>
              )}
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default SelectionPanel;
