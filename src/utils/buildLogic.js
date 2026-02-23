// ─────────────────────────────────────────────────────────────
// AI Build Recommendation Engine — Real db.json Products
// ─────────────────────────────────────────────────────────────

const PRODUCTS = {
  gpu: [
    {
      id: 50, title: 'MSI RTX 5060 Ti Gaming', brand: 'MSI',
      price: 34999, discountPrice: 29999,
      images: ['/images/graphics-cards/graphic-card-4.png'],
      category: 'graphicscards', tier: 'mid',
      spec: '8GB GDDR6 · 3840 CUDA Cores · 170W',
      fps1080: 160, fps1440: 100, fps4k: 45,
    },
    {
      id: 49, title: 'Gigabyte RTX 5070', brand: 'Gigabyte',
      price: 52999, discountPrice: 47999,
      images: ['/images/graphics-cards/graphic-card-3.png'],
      category: 'graphicscards', tier: 'high',
      spec: '12GB GDDR7 · 5888 CUDA Cores · 250W',
      fps1080: 240, fps1440: 165, fps4k: 80,
    },
    {
      id: 48, title: 'Corsair RTX 5070 Ti', brand: 'Corsair',
      price: 74999, discountPrice: 67999,
      images: ['/images/graphics-cards/graphic-card-5.png'],
      category: 'graphicscards', tier: 'high',
      spec: '12GB GDDR7 · 6144 CUDA Cores · 280W',
      fps1080: 300, fps1440: 200, fps4k: 110,
    },
    {
      id: 47, title: 'ASUS ROG RTX 5080', brand: 'ASUS',
      price: 109999, discountPrice: 99999,
      images: ['/images/graphics-cards/graphic-card-2.png'],
      category: 'graphicscards', tier: 'ultra',
      spec: '16GB GDDR7 · 10240 CUDA Cores · 320W',
      fps1080: 400, fps1440: 280, fps4k: 160,
    },
    {
      id: 46, title: 'NVIDIA RTX 5090', brand: 'NVIDIA',
      price: 189999, discountPrice: 179999,
      images: ['/images/graphics-cards/graphic-card-1.png'],
      category: 'graphicscards', tier: 'flagship',
      spec: '32GB GDDR7 · 16384 CUDA Cores · 575W',
      fps1080: 500, fps1440: 400, fps4k: 240,
    },
  ],

  monitor: [
    {
      id: 20, title: 'Dell S2721DGF', brand: 'Dell',
      price: 27999, discountPrice: 24499,
      images: ['/images/monitors/monitor4.jpg'],
      category: 'monitors', tier: 'mid',
      spec: '27" · 1440p · 165Hz · IPS',
      refreshRate: 165, resolution: '1440p',
    },
    {
      id: 17, title: 'LG 27GP850', brand: 'LG',
      price: 34999, discountPrice: 29999,
      images: ['/images/monitors/monitor2.jpg'],
      category: 'monitors', tier: 'high',
      spec: '27" · 1440p · 165Hz · IPS · HDR',
      refreshRate: 165, resolution: '1440p',
    },
    {
      id: 19, title: 'MSI Oculux GN30SQPX', brand: 'MSI',
      price: 41999, discountPrice: 37999,
      images: ['/images/monitors/monitor5.jpg'],
      category: 'monitors', tier: 'high',
      spec: '24" · 1080p · 360Hz · TN · G-Sync',
      refreshRate: 360, resolution: '1080p',
    },
    {
      id: 18, title: 'BenQ EW2780U', brand: 'BenQ',
      price: 52999, discountPrice: 46999,
      images: ['/images/monitors/monitor3.png'],
      category: 'monitors', tier: 'ultra',
      spec: '27" · 4K UHD · 60Hz · Eye-Care',
      refreshRate: 60, resolution: '4K',
    },
    {
      id: 16, title: 'ASUS ROG Swift Pro OLED', brand: 'ASUS',
      price: 109999, discountPrice: 94999,
      images: ['/images/monitors/monitor1.jpg'],
      category: 'monitors', tier: 'flagship',
      spec: '27" · 1440p · 360Hz · OLED · 0.03ms',
      refreshRate: 360, resolution: '1440p',
    },
  ],

  keyboard: [
    {
      id: 5, title: 'Vulcan 122 AURA', brand: 'ROCCAT',
      price: 14999, discountPrice: 12999,
      images: ['/images/keyboards/roccat-vulcan-122-aura-1.png'],
      category: 'keyboards', tier: 'mid',
      spec: 'Titan Optical · Full-size · RGB · 8000Hz',
    },
    {
      id: 3, title: 'Apex Pro TKL', brand: 'SteelSeries',
      price: 22999, discountPrice: 19999,
      images: ['/images/keyboards/steelseries-apex-pro-tkl-1.png'],
      category: 'keyboards', tier: 'high',
      spec: 'OmniPoint 2.0 · TKL · OLED · 0.2mm Actuation',
    },
    {
      id: 2, title: 'K100 RGB', brand: 'Corsair',
      price: 24999, discountPrice: 21999,
      images: ['/images/keyboards/corsair-k100-rgb-1.png'],
      category: 'keyboards', tier: 'ultra',
      spec: 'OPX Optical · Full · iCUE Wheel · Aluminum',
    },
    {
      id: 1, title: 'Huntsman V3 Pro', brand: 'Razer',
      price: 27999, discountPrice: 24999,
      images: ['/images/keyboards/razer-huntsman-v3-pro-1.jpg'],
      category: 'keyboards', tier: 'ultra',
      spec: 'Analog Optical · Full · 0.1mm Actuation · 8000Hz',
    },
    {
      id: 4, title: 'G915 X Lightspeed', brand: 'Logitech',
      price: 29999, discountPrice: 26999,
      images: ['/images/keyboards/logitech-g915x-lightspeed-1.png'],
      category: 'keyboards', tier: 'flagship',
      spec: 'GL Low Profile · Wireless · 36hr Battery',
    },
  ],

  mouse: [
    {
      id: 10, title: 'EC3-C Ergo Pro', brand: 'BenQ',
      price: 5999, discountPrice: 4999,
      images: ['/images/mice/mouse5.png'],
      category: 'mouse', tier: 'mid',
      spec: '3200 DPI · Wired · Ergonomic · PixArt',
    },
    {
      id: 9, title: 'DARK CORE RGB Pro', brand: 'Corsair',
      price: 7499, discountPrice: 6499,
      images: ['/images/mice/mouse4.png'],
      category: 'mouse', tier: 'mid',
      spec: '18K DPI · Qi Charging · 89g · 50hr Battery',
    },
    {
      id: 8, title: 'Pulsar X2 Mini', brand: 'Pulsar',
      price: 8999, discountPrice: 7499,
      images: ['/images/mice/mouse3.png'],
      category: 'mouse', tier: 'high',
      spec: 'PAW3395 · 52g Ultra-Light · Wireless · 8000Hz',
    },
    {
      id: 6, title: 'DeathAdder V3 Pro', brand: 'Razer',
      price: 13999, discountPrice: 11999,
      images: ['/images/mice/mouse1.png'],
      category: 'mouse', tier: 'ultra',
      spec: 'Focus Pro 30K · 63g · Optical Gen-3 · 90hr',
    },
    {
      id: 7, title: 'G Pro X Superlight 2', brand: 'Logitech',
      price: 14999, discountPrice: 12999,
      images: ['/images/mice/mouse2.png'],
      category: 'mouse', tier: 'flagship',
      spec: 'HERO 2 · 32K DPI · 60g · LIGHTFORCE · 95hr',
    },
  ],

  headset: [
    {
      id: 12, title: 'VOID RGB Elite', brand: 'Corsair',
      price: 7999, discountPrice: 6499,
      images: ['/images/headsets/headset2.jpg'],
      category: 'headsets', tier: 'mid',
      spec: '50mm Neodymium · 7.1 · Wireless · 16hr',
    },
    {
      id: 15, title: 'ROG Strix 2', brand: 'ASUS',
      price: 9999, discountPrice: 8499,
      images: ['/images/headsets/headset5.jpg'],
      category: 'headsets', tier: 'mid',
      spec: '50mm · Dual AI Mics · Wireless · 30hr',
    },
    {
      id: 13, title: 'Cloud III Wireless', brand: 'HyperX',
      price: 12999, discountPrice: 10999,
      images: ['/images/headsets/headset3.jpg'],
      category: 'headsets', tier: 'high',
      spec: '53mm · DTS:X · 120hr Battery · Memory Foam',
    },
    {
      id: 11, title: 'Kraken V3 Pro', brand: 'Razer',
      price: 16999, discountPrice: 14999,
      images: ['/images/headsets/headset1.jpg'],
      category: 'headsets', tier: 'ultra',
      spec: '50mm TriForce · Haptic · THX Spatial · 44hr',
    },
    {
      id: 14, title: 'Arctis Nova Pro', brand: 'SteelSeries',
      price: 24999, discountPrice: 21999,
      images: ['/images/headsets/headset4.jpg'],
      category: 'headsets', tier: 'flagship',
      spec: 'Hi-Fi · ANC · Hot-Swap Battery · DAC',
    },
  ],
};

// ─────────── Game profiles ───────────
const GAME_PROFILES = {
  valorant: {
    label: 'Valorant',
    genre: 'competitive-fps',
    gpuWeight: 0.5,
    monitorWeight: 1.0,
    peripheralWeight: 1.0,
    preferHighRefresh: true,
    preferLowLatency: true,
  },
  'counter-strike-2': {
    label: 'Counter-Strike 2',
    genre: 'competitive-fps',
    gpuWeight: 0.6,
    monitorWeight: 1.0,
    peripheralWeight: 1.0,
    preferHighRefresh: true,
    preferLowLatency: true,
  },
  'league-of-legends': {
    label: 'League of Legends',
    genre: 'moba',
    gpuWeight: 0.4,
    monitorWeight: 0.7,
    peripheralWeight: 0.8,
    preferHighRefresh: false,
    preferLowLatency: false,
  },
  'apex-legends': {
    label: 'Apex Legends',
    genre: 'battle-royale',
    gpuWeight: 0.8,
    monitorWeight: 0.9,
    peripheralWeight: 0.9,
    preferHighRefresh: true,
    preferLowLatency: true,
  },
  'cyberpunk-2077': {
    label: 'Cyberpunk 2077',
    genre: 'aaa',
    gpuWeight: 1.0,
    monitorWeight: 0.6,
    peripheralWeight: 0.4,
    preferHighRefresh: false,
    preferLowLatency: false,
  },
  'fortnite': {
    label: 'Fortnite',
    genre: 'battle-royale',
    gpuWeight: 0.6,
    monitorWeight: 0.9,
    peripheralWeight: 0.9,
    preferHighRefresh: true,
    preferLowLatency: true,
  },
};

// ─────────── Tier scoring ───────────
const TIER_SCORES = { mid: 1, high: 2, ultra: 3, flagship: 4 };

function getTierFromBudget(budget, playstyle) {
  const boost = playstyle === 'pro' ? 1 : playstyle === 'competitive' ? 0.5 : 0;

  if (budget < 60000) return 'mid';
  if (budget < 100000) return boost >= 1 ? 'high' : 'mid';
  if (budget < 150000) return boost >= 0.5 ? 'ultra' : 'high';
  if (budget < 200000) return boost >= 1 ? 'flagship' : 'ultra';
  return 'flagship';
}

function selectProduct(category, targetTier, budget, weights = {}) {
  const items = PRODUCTS[category];
  const tierScore = TIER_SCORES[targetTier] || 2;

  // Score each candidate
  const scored = items.map((item) => {
    const itemTierScore = TIER_SCORES[item.tier] || 2;
    const tierDiff = Math.abs(itemTierScore - tierScore);
    const budgetFit = item.discountPrice <= budget * 0.35 ? 1 : item.discountPrice <= budget * 0.5 ? 0.5 : 0;
    const weight = weights[category] || 1;

    return {
      ...item,
      score: (4 - tierDiff) * weight + budgetFit,
    };
  });

  scored.sort((a, b) => b.score - a.score);

  // Filter items that fit within budget
  const affordable = scored.filter((i) => i.discountPrice <= budget * 0.55);
  return affordable.length > 0 ? affordable[0] : scored[scored.length - 1];
}

// ─────────── Resolution adjustments ───────────
function adjustForResolution(resolution, selections) {
  if (resolution === '4K') {
    // Upgrade GPU if possible
    const current = TIER_SCORES[selections.gpu.tier] || 2;
    const better = PRODUCTS.gpu.find((g) => TIER_SCORES[g.tier] > current);
    if (better) selections.gpu = better;
    // Match monitor resolution
    const mon4k = PRODUCTS.monitor.find((m) => m.resolution === '4K');
    if (mon4k) selections.monitor = mon4k;
  } else if (resolution === '1080p') {
    // Prioritize high refresh rate monitor
    const fastMon = [...PRODUCTS.monitor]
      .filter((m) => m.resolution === '1080p')
      .sort((a, b) => b.refreshRate - a.refreshRate)[0];
    if (fastMon) selections.monitor = fastMon;
  }
  return selections;
}

// ─────────── Main engine ───────────
export function generateRecommendation({ game, budget, resolution, playstyle }) {
  const profile = GAME_PROFILES[game] || GAME_PROFILES['valorant'];
  const targetTier = getTierFromBudget(budget, playstyle);

  const weights = {
    gpu: profile.gpuWeight,
    monitor: profile.monitorWeight,
    keyboard: profile.peripheralWeight,
    mouse: profile.peripheralWeight,
    headset: profile.peripheralWeight * 0.8,
  };

  let selections = {
    gpu: selectProduct('gpu', targetTier, budget, weights),
    monitor: selectProduct('monitor', targetTier, budget, weights),
    keyboard: selectProduct('keyboard', targetTier, budget, weights),
    mouse: selectProduct('mouse', targetTier, budget, weights),
    headset: selectProduct('headset', targetTier, budget, weights),
  };

  // Resolution-specific adjustments
  selections = adjustForResolution(resolution, selections);

  // Competitive FPS tweaks
  if (profile.preferHighRefresh && playstyle !== 'casual') {
    const bestRefreshMon = [...PRODUCTS.monitor]
      .filter((m) => m.discountPrice <= budget * 0.3)
      .sort((a, b) => b.refreshRate - a.refreshRate)[0];
    if (bestRefreshMon && bestRefreshMon.refreshRate > (selections.monitor.refreshRate || 0)) {
      selections.monitor = bestRefreshMon;
    }
  }

  if (profile.preferLowLatency && playstyle === 'pro') {
    // Pro-level peripherals
    const proMouse = PRODUCTS.mouse.find((m) => m.tier === 'ultra' || m.tier === 'flagship');
    const proKb = PRODUCTS.keyboard.find((k) => k.tier === 'ultra' || k.tier === 'flagship');
    if (proMouse) selections.mouse = proMouse;
    if (proKb) selections.keyboard = proKb;
  }

  const totalPrice = Object.values(selections).reduce((sum, item) => sum + item.discountPrice, 0);

  // Performance summary
  const performanceSummary = {
    overallTier: targetTier,
    estimatedFps: getEstimatedFps(selections.gpu, resolution),
    refreshRate: selections.monitor.refreshRate || 144,
    competitiveReady: profile.preferHighRefresh && (selections.monitor.refreshRate || 144) >= 144,
    rayTracingCapable: TIER_SCORES[selections.gpu.tier] >= 3,
    budgetUtilization: Math.round((totalPrice / budget) * 100),
  };

  return {
    items: selections,
    totalPrice,
    performance: performanceSummary,
    gameProfile: profile,
    tier: targetTier,
  };
}

function getEstimatedFps(gpu, resolution) {
  if (resolution === '4K') return gpu.fps4k || 60;
  if (resolution === '1440p') return gpu.fps1440 || 100;
  return gpu.fps1080 || 144;
}

export const GAMES = Object.entries(GAME_PROFILES).map(([key, val]) => ({
  value: key,
  label: val.label,
  genre: val.genre,
}));

export const RESOLUTIONS = ['1080p', '1440p', '4K'];
export const PLAYSTYLES = ['casual', 'competitive', 'pro'];
