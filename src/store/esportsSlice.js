import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/* ───────────────────── Mock Data ───────────────────── */

const mockTournaments = [
  {
    id: 't1',
    title: 'NEXUS Valorant Invitational',
    game: 'Valorant',
    prizePool: 4200000,
    totalSlots: 64,
    filledSlots: 51,
    startDate: '2026-03-15T18:00:00',
    status: 'live',
    image: '/images/tournaments/valo.png',
    region: 'Asia',
    format: '5v5 Single Elimination',
  },
  {
    id: 't2',
    title: 'CS2 Major Championship',
    game: 'Counter-Strike 2',
    prizePool: 8400000,
    totalSlots: 32,
    filledSlots: 28,
    startDate: '2026-04-02T14:00:00',
    status: 'upcoming',
    image: '/images/tournaments/cs2.png',
    region: 'Global',
    format: '5v5 Double Elimination',
  },
  {
    id: 't3',
    title: 'League of Legends World Cup',
    game: 'League of Legends',
    prizePool: 16800000,
    totalSlots: 24,
    filledSlots: 20,
    startDate: '2026-05-10T10:00:00',
    status: 'upcoming',
    image: '/images/tournaments/lol2.jpg',
    region: 'International',
    format: '5v5 Swiss → Playoffs',
  },
  {
    id: 't4',
    title: 'Valorant Rising Stars',
    game: 'Valorant',
    prizePool: 2100000,
    totalSlots: 128,
    filledSlots: 97,
    startDate: '2026-03-28T16:00:00',
    status: 'registration',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600',
    region: 'India',
    format: '5v5 Round Robin',
  },
  {
    id: 't5',
    title: 'CS2 Asian Open Qualifier',
    game: 'Counter-Strike 2',
    prizePool: 840000,
    totalSlots: 256,
    filledSlots: 189,
    startDate: '2026-04-15T12:00:00',
    status: 'registration',
    image: '/images/tournaments/csgo.jpg',
    region: 'Asia',
    format: '5v5 Single Elimination',
  },
  {
    id: 't6',
    title: 'LoL Champions League S4',
    game: 'League of Legends',
    prizePool: 6300000,
    totalSlots: 16,
    filledSlots: 16,
    startDate: '2026-06-01T09:00:00',
    status: 'upcoming',
    image: '/images/tournaments/lol1.jpg',
    region: 'Global',
    format: '5v5 Group Stage → Bracket',
  },
];

const mockPlayers = [
  {
    id: 'p1', name: 'PHANTOM_ACE', team: 'NEXUS Elite', avatar: 'PA', country: '🇮🇳',
    kd: 2.84, winRate: 78.5, points: 14820, totalMatches: 342, favoriteGame: 'Valorant',
    kdHistory: [2.1, 2.3, 2.5, 2.4, 2.7, 2.6, 2.8, 2.84],
    winRateHistory: [65, 68, 71, 73, 74, 76, 77, 78.5],
    matches: [
      { opponent: 'ShadowReaper', result: 'win', kd: 3.2, duration: '34:12', map: 'Ascent' },
      { opponent: 'CyberViper_X', result: 'win', kd: 2.8, duration: '28:45', map: 'Haven' },
      { opponent: 'NeonStrike', result: 'loss', kd: 1.4, duration: '41:02', map: 'Bind' },
      { opponent: 'GhostFrame', result: 'win', kd: 3.5, duration: '22:18', map: 'Split' },
      { opponent: 'BlitzKrieg', result: 'win', kd: 2.9, duration: '36:55', map: 'Icebox' },
      { opponent: 'PixelHunter', result: 'win', kd: 2.6, duration: '30:10', map: 'Lotus' },
      { opponent: 'ZeroLatency', result: 'loss', kd: 1.8, duration: '38:42', map: 'Pearl' },
      { opponent: 'VoidWalker', result: 'win', kd: 3.1, duration: '25:33', map: 'Fracture' },
    ],
  },
  {
    id: 'p2', name: 'ShadowReaper', team: 'Void Squad', avatar: 'SR', country: '🇺🇸',
    kd: 2.61, winRate: 74.2, points: 13650, totalMatches: 310, favoriteGame: 'Counter-Strike 2',
    kdHistory: [2.0, 2.2, 2.3, 2.4, 2.5, 2.55, 2.58, 2.61],
    winRateHistory: [60, 63, 66, 68, 70, 72, 73, 74.2],
    matches: [
      { opponent: 'PHANTOM_ACE', result: 'loss', kd: 1.5, duration: '34:12', map: 'Dust II' },
      { opponent: 'CyberViper_X', result: 'win', kd: 2.4, duration: '29:30', map: 'Mirage' },
      { opponent: 'NeonStrike', result: 'win', kd: 2.7, duration: '31:00', map: 'Inferno' },
      { opponent: 'GhostFrame', result: 'win', kd: 2.3, duration: '27:15', map: 'Anubis' },
      { opponent: 'BlitzKrieg', result: 'loss', kd: 1.9, duration: '40:05', map: 'Nuke' },
      { opponent: 'PixelHunter', result: 'win', kd: 2.8, duration: '33:22', map: 'Overpass' },
    ],
  },
  {
    id: 'p3', name: 'CyberViper_X', team: 'Storm Rising', avatar: 'CV', country: '🇩🇪',
    kd: 2.47, winRate: 71.8, points: 12480, totalMatches: 295, favoriteGame: 'League of Legends',
    kdHistory: [1.9, 2.0, 2.1, 2.2, 2.3, 2.35, 2.4, 2.47],
    winRateHistory: [58, 61, 64, 66, 68, 69, 70, 71.8],
    matches: [
      { opponent: 'PHANTOM_ACE', result: 'loss', kd: 1.3, duration: '28:45', map: "Summoner's Rift" },
      { opponent: 'ShadowReaper', result: 'loss', kd: 1.6, duration: '29:30', map: "Summoner's Rift" },
      { opponent: 'NeonStrike', result: 'win', kd: 2.5, duration: '35:10', map: "Summoner's Rift" },
      { opponent: 'GhostFrame', result: 'win', kd: 2.9, duration: '24:55', map: "Summoner's Rift" },
      { opponent: 'BlitzKrieg', result: 'win', kd: 2.2, duration: '38:30', map: "Summoner's Rift" },
    ],
  },
  {
    id: 'p4', name: 'NeonStrike', team: 'Alpha Protocol', avatar: 'NS', country: '🇧🇷',
    kd: 2.33, winRate: 69.3, points: 11200, totalMatches: 278, favoriteGame: 'Valorant',
    kdHistory: [1.8, 1.9, 2.0, 2.1, 2.15, 2.2, 2.28, 2.33],
    winRateHistory: [55, 58, 61, 63, 65, 66, 68, 69.3],
    matches: [
      { opponent: 'PHANTOM_ACE', result: 'win', kd: 2.1, duration: '41:02', map: 'Bind' },
      { opponent: 'ShadowReaper', result: 'loss', kd: 1.2, duration: '31:00', map: 'Ascent' },
      { opponent: 'CyberViper_X', result: 'loss', kd: 1.5, duration: '35:10', map: 'Haven' },
      { opponent: 'GhostFrame', result: 'win', kd: 2.6, duration: '26:40', map: 'Split' },
    ],
  },
  {
    id: 'p5', name: 'GhostFrame', team: 'Dark Matter', avatar: 'GF', country: '🇯🇵',
    kd: 2.19, winRate: 67.1, points: 10840, totalMatches: 265, favoriteGame: 'Counter-Strike 2',
    kdHistory: [1.7, 1.8, 1.9, 2.0, 2.05, 2.1, 2.15, 2.19],
    winRateHistory: [53, 56, 59, 61, 63, 64, 66, 67.1],
    matches: [
      { opponent: 'PHANTOM_ACE', result: 'loss', kd: 0.9, duration: '22:18', map: 'Dust II' },
      { opponent: 'ShadowReaper', result: 'loss', kd: 1.4, duration: '27:15', map: 'Mirage' },
      { opponent: 'NeonStrike', result: 'loss', kd: 1.1, duration: '26:40', map: 'Inferno' },
      { opponent: 'PixelHunter', result: 'win', kd: 2.3, duration: '32:10', map: 'Nuke' },
    ],
  },
  {
    id: 'p6', name: 'PixelHunter', team: 'Rogue Ops', avatar: 'PH', country: '🇫🇷',
    kd: 2.08, winRate: 65.4, points: 10350, totalMatches: 252, favoriteGame: 'Valorant',
    kdHistory: [1.6, 1.7, 1.8, 1.85, 1.9, 1.95, 2.0, 2.08],
    winRateHistory: [50, 53, 56, 58, 60, 62, 64, 65.4],
    matches: [
      { opponent: 'PHANTOM_ACE', result: 'loss', kd: 1.0, duration: '30:10', map: 'Lotus' },
      { opponent: 'ShadowReaper', result: 'loss', kd: 1.2, duration: '33:22', map: 'Ascent' },
      { opponent: 'GhostFrame', result: 'loss', kd: 1.5, duration: '32:10', map: 'Haven' },
      { opponent: 'BlitzKrieg', result: 'win', kd: 2.4, duration: '29:00', map: 'Split' },
    ],
  },
  {
    id: 'p7', name: 'BlitzKrieg', team: 'Iron Forge', avatar: 'BK', country: '🇸🇪',
    kd: 1.97, winRate: 63.8, points: 9870, totalMatches: 240, favoriteGame: 'Counter-Strike 2',
    kdHistory: [1.5, 1.6, 1.65, 1.7, 1.75, 1.8, 1.9, 1.97],
    winRateHistory: [48, 51, 54, 56, 58, 60, 62, 63.8],
    matches: [
      { opponent: 'PHANTOM_ACE', result: 'loss', kd: 1.1, duration: '36:55', map: 'Overpass' },
      { opponent: 'ShadowReaper', result: 'win', kd: 2.1, duration: '40:05', map: 'Nuke' },
      { opponent: 'PixelHunter', result: 'loss', kd: 1.3, duration: '29:00', map: 'Dust II' },
      { opponent: 'ZeroLatency', result: 'win', kd: 2.0, duration: '35:10', map: 'Mirage' },
    ],
  },
  {
    id: 'p8', name: 'ZeroLatency', team: 'Quantum Edge', avatar: 'ZL', country: '🇮🇳',
    kd: 1.88, winRate: 61.2, points: 9430, totalMatches: 228, favoriteGame: 'League of Legends',
    kdHistory: [1.4, 1.5, 1.55, 1.6, 1.65, 1.7, 1.8, 1.88],
    winRateHistory: [45, 48, 51, 53, 55, 57, 59, 61.2],
    matches: [
      { opponent: 'PHANTOM_ACE', result: 'win', kd: 2.3, duration: '38:42', map: "Summoner's Rift" },
      { opponent: 'BlitzKrieg', result: 'loss', kd: 1.5, duration: '35:10', map: "Summoner's Rift" },
      { opponent: 'CyberViper_X', result: 'loss', kd: 1.2, duration: '30:00', map: "Summoner's Rift" },
    ],
  },
  {
    id: 'p9', name: 'VoidWalker', team: 'Void Squad', avatar: 'VW', country: '🇰🇷',
    kd: 1.76, winRate: 58.9, points: 8920, totalMatches: 215, favoriteGame: 'Valorant',
    kdHistory: [1.3, 1.4, 1.45, 1.5, 1.55, 1.6, 1.7, 1.76],
    winRateHistory: [42, 45, 48, 50, 53, 55, 57, 58.9],
    matches: [
      { opponent: 'PHANTOM_ACE', result: 'loss', kd: 0.8, duration: '25:33', map: 'Fracture' },
      { opponent: 'NeonStrike', result: 'win', kd: 2.0, duration: '33:10', map: 'Bind' },
    ],
  },
  {
    id: 'p10', name: 'ArcticFox', team: 'Storm Rising', avatar: 'AF', country: '🇨🇦',
    kd: 1.65, winRate: 56.3, points: 8410, totalMatches: 200, favoriteGame: 'League of Legends',
    kdHistory: [1.2, 1.3, 1.35, 1.4, 1.45, 1.5, 1.58, 1.65],
    winRateHistory: [40, 43, 46, 48, 50, 52, 54, 56.3],
    matches: [
      { opponent: 'CyberViper_X', result: 'loss', kd: 1.1, duration: '28:00', map: "Summoner's Rift" },
      { opponent: 'ZeroLatency', result: 'win', kd: 1.9, duration: '31:25', map: "Summoner's Rift" },
    ],
  },
];

/* ───────────────────── Async Thunks ───────────────────── */

export const fetchTournaments = createAsyncThunk(
  'esports/fetchTournaments',
  async () => {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));
    return mockTournaments;
  }
);

export const fetchPlayers = createAsyncThunk(
  'esports/fetchPlayers',
  async () => {
    await new Promise((r) => setTimeout(r, 600));
    return mockPlayers;
  }
);

/* ───────────────────── Slice ───────────────────── */

const esportsSlice = createSlice({
  name: 'esports',
  initialState: {
    tournaments: [],
    players: [],
    leaderboard: [],
    selectedPlayer: null,
    loading: false,
  },
  reducers: {
    selectPlayer(state, action) {
      state.selectedPlayer = state.players.find((p) => p.id === action.payload) || null;
    },
    clearSelectedPlayer(state) {
      state.selectedPlayer = null;
    },
    updateLeaderboard(state) {
      state.leaderboard = [...state.players].sort((a, b) => b.points - a.points);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTournaments.pending, (state) => { state.loading = true; })
      .addCase(fetchTournaments.fulfilled, (state, action) => {
        state.tournaments = action.payload;
        state.loading = false;
      })
      .addCase(fetchTournaments.rejected, (state) => { state.loading = false; })
      .addCase(fetchPlayers.pending, (state) => { state.loading = true; })
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        state.players = action.payload;
        state.leaderboard = [...action.payload].sort((a, b) => b.points - a.points);
        state.loading = false;
      })
      .addCase(fetchPlayers.rejected, (state) => { state.loading = false; });
  },
});

export const { selectPlayer, clearSelectedPlayer, updateLeaderboard } = esportsSlice.actions;
export default esportsSlice.reducer;
