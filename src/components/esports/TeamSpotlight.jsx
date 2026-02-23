import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Twitter, Youtube, Twitch, Trophy, Target } from 'lucide-react';

const teams = [
  {
    name: 'NEXUS Elite',
    tagline: 'Precision is our weapon.',
    logo: 'NE',
    gradient: 'from-[#00FF88] to-[#00E0FF]',
    winRatio: '82%',
    titles: 12,
    games: ['Valorant', 'CS2'],
  },
  {
    name: 'Void Squad',
    tagline: 'Born from the shadows.',
    logo: 'VS',
    gradient: 'from-[#BD00FF] to-[#7C3AED]',
    winRatio: '76%',
    titles: 8,
    games: ['Apex Legends', 'Valorant'],
  },
  {
    name: 'Storm Rising',
    tagline: 'Unleash the thunder.',
    logo: 'SR',
    gradient: 'from-[#00E0FF] to-[#0EA5E9]',
    winRatio: '73%',
    titles: 6,
    games: ['League of Legends'],
  },
  {
    name: 'Iron Forge',
    tagline: 'Forged in fire, tempered in war.',
    logo: 'IF',
    gradient: 'from-orange-500 to-red-500',
    winRatio: '70%',
    titles: 5,
    games: ['CS2', 'Valorant'],
  },
  {
    name: 'Dark Matter',
    tagline: 'Invisible. Unstoppable.',
    logo: 'DM',
    gradient: 'from-pink-500 to-rose-500',
    winRatio: '68%',
    titles: 4,
    games: ['Apex Legends'],
  },
  {
    name: 'Quantum Edge',
    tagline: 'Beyond the limit.',
    logo: 'QE',
    gradient: 'from-emerald-400 to-teal-500',
    winRatio: '65%',
    titles: 3,
    games: ['League of Legends', 'Valorant'],
  },
];

const TeamCard = ({ team }) => {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouse = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="flex-shrink-0 w-[300px] sm:w-[340px] snap-center group"
    >
      <div className="relative rounded-2xl border border-white/[0.06] bg-[#0a0c10]/90 backdrop-blur-md p-6 h-full overflow-hidden transition-shadow duration-500 hover:shadow-xl">
        {/* Ambient glow */}
        <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${team.gradient} opacity-0 group-hover:opacity-[0.08] blur-[60px] transition-opacity duration-500`} />

        {/* Logo */}
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${team.gradient} flex items-center justify-center mb-5 shadow-lg`}>
          <span className="text-lg font-black text-white">{team.logo}</span>
        </div>

        {/* Info */}
        <h3 className="text-xl font-bold text-white mb-1">{team.name}</h3>
        <p className="text-sm text-white/30 italic mb-5">"{team.tagline}"</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
            <Target size={13} className="text-[#00FF88]" />
            <div>
              <div className="text-xs font-bold text-white">{team.winRatio}</div>
              <div className="text-[9px] text-white/25 uppercase">Win Rate</div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
            <Trophy size={13} className="text-amber-400" />
            <div>
              <div className="text-xs font-bold text-white">{team.titles}</div>
              <div className="text-[9px] text-white/25 uppercase">Titles</div>
            </div>
          </div>
        </div>

        {/* Games */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {team.games.map((g) => (
            <span key={g} className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-white/[0.04] border border-white/[0.06] text-white/40">
              {g}
            </span>
          ))}
        </div>

        {/* Socials */}
        <div className="flex gap-2">
          {[Twitter, Youtube, Twitch].map((Icon, idx) => (
            <button key={idx} className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/25 hover:text-white/60 hover:border-white/15 transition-all">
              <Icon size={13} />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const TeamSpotlight = () => {
  const scrollRef = useRef(null);

  return (
    <section className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 max-w-[40px] bg-gradient-to-r from-[#BD00FF] to-transparent" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#BD00FF]">Pro Organizations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Team Spotlight</h2>
          <p className="text-white/30 text-sm mt-2">Meet the elite organizations dominating the NEXUS arena.</p>
        </motion.div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto px-4 pb-6 snap-x snap-mandatory scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex-shrink-0 w-4 sm:w-[calc((100vw-1280px)/2)]" />
        {teams.map((team) => (
          <TeamCard key={team.name} team={team} />
        ))}
        <div className="flex-shrink-0 w-4 sm:w-[calc((100vw-1280px)/2)]" />
      </div>

      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </section>
  );
};

export default TeamSpotlight;
