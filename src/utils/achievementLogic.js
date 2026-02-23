/* ──────────────────────────────────────────────
   Achievement / Badge definitions & helpers
   ────────────────────────────────────────────── */

export const ACHIEVEMENTS = [
  {
    id: 'first_win',
    name: 'First Win',
    description: 'Win your first competitive match',
    icon: '🏆',
    color: 'from-yellow-400 to-amber-500',
    glowColor: 'rgba(251,191,36,0.5)',
    requirement: (stats) => stats.wins >= 1,
  },
  {
    id: 'ten_wins',
    name: '10 Wins',
    description: 'Accumulate 10 competitive victories',
    icon: '⚔️',
    color: 'from-cyan-400 to-blue-500',
    glowColor: 'rgba(34,211,238,0.5)',
    requirement: (stats) => stats.wins >= 10,
  },
  {
    id: 'hundred_headshots',
    name: '100 Headshots',
    description: 'Land 100 headshots across all matches',
    icon: '🎯',
    color: 'from-red-400 to-rose-600',
    glowColor: 'rgba(248,113,113,0.5)',
    requirement: (stats) => stats.headshots >= 100,
  },
  {
    id: 'tournament_champion',
    name: 'Tournament Champion',
    description: 'Win a NEXUS official tournament',
    icon: '👑',
    color: 'from-purple-400 to-violet-600',
    glowColor: 'rgba(167,139,250,0.5)',
    requirement: () => false, // manual unlock
  },
  {
    id: 'community_star',
    name: 'Community Star',
    description: 'Create 50 community posts',
    icon: '⭐',
    color: 'from-[#00FF88] to-emerald-500',
    glowColor: 'rgba(0,255,136,0.5)',
    requirement: (stats) => (stats.postCount ?? 0) >= 50,
  },
];

/** Look up a single achievement definition by id */
export const getAchievement = (id) =>
  ACHIEVEMENTS.find((a) => a.id === id) ?? null;

/** Return full achievement objects for a list of unlocked ids */
export const getUnlockedAchievements = (unlockedIds = []) =>
  unlockedIds
    .map((id) => getAchievement(id))
    .filter(Boolean);

/** Check which achievements a player *could* unlock based on stats */
export const checkNewAchievements = (stats, alreadyUnlocked = []) =>
  ACHIEVEMENTS.filter(
    (a) => !alreadyUnlocked.includes(a.id) && a.requirement(stats)
  );

/** Rank thresholds — maps rank name to min XP */
export const RANK_THRESHOLDS = [
  { rank: 'Iron', minXp: 0, color: '#8B8B8B' },
  { rank: 'Bronze', minXp: 1000, color: '#CD7F32' },
  { rank: 'Silver', minXp: 3000, color: '#C0C0C0' },
  { rank: 'Gold', minXp: 5000, color: '#FFD700' },
  { rank: 'Platinum', minXp: 8000, color: '#00E0FF' },
  { rank: 'Diamond', minXp: 12000, color: '#B9F2FF' },
  { rank: 'Ascendant', minXp: 18000, color: '#00FF88' },
  { rank: 'Immortal', minXp: 25000, color: '#BD00FF' },
  { rank: 'Radiant', minXp: 40000, color: '#FFD700' },
];

/** Get rank info for a given XP */
export const getRankForXp = (xp) => {
  let current = RANK_THRESHOLDS[0];
  for (const t of RANK_THRESHOLDS) {
    if (xp >= t.minXp) current = t;
    else break;
  }
  return current;
};

/** Get progress % toward next rank */
export const getProgressToNextRank = (xp) => {
  const currentIdx = RANK_THRESHOLDS.findIndex(
    (t, i) =>
      xp >= t.minXp &&
      (i === RANK_THRESHOLDS.length - 1 || xp < RANK_THRESHOLDS[i + 1].minXp)
  );
  if (currentIdx === RANK_THRESHOLDS.length - 1) return 100; // max rank
  const current = RANK_THRESHOLDS[currentIdx].minXp;
  const next = RANK_THRESHOLDS[currentIdx + 1].minXp;
  return Math.round(((xp - current) / (next - current)) * 100);
};

/** Next rank name (or null if max) */
export const getNextRank = (xp) => {
  const currentIdx = RANK_THRESHOLDS.findIndex(
    (t, i) =>
      xp >= t.minXp &&
      (i === RANK_THRESHOLDS.length - 1 || xp < RANK_THRESHOLDS[i + 1].minXp)
  );
  return currentIdx < RANK_THRESHOLDS.length - 1
    ? RANK_THRESHOLDS[currentIdx + 1]
    : null;
};
