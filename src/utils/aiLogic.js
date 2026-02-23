/**
 * ═══════════════════════════════════════════════════════════════
 * NEXUS AI — Rule-Based NLP Engine
 * ═══════════════════════════════════════════════════════════════
 *
 * Parses natural-language user queries, detects intent, extracts
 * category / budget / keyword filters, then returns a structured
 * response with matching products from the local product cache.
 */

import { formatPrice } from './helpers';

/* ────────────────────────────────────────────────────────────────
   1. CATEGORY MAPPING
   ──────────────────────────────────────────────────────────────── */

const CATEGORY_MAP = {
  // Keyboards
  keyboard: 'Keyboard',
  keyboards: 'Keyboard',
  'mechanical keyboard': 'Keyboard',
  keeb: 'Keyboard',
  keebs: 'Keyboard',

  // Mouse
  mouse: 'Mouse',
  mice: 'Mouse',
  'gaming mouse': 'Mouse',

  // Headsets
  headset: 'Headset',
  headsets: 'Headset',
  headphone: 'Headset',
  headphones: 'Headset',
  earphone: 'Headset',
  earphones: 'Headset',

  // Monitors
  monitor: 'Monitor',
  monitors: 'Monitor',
  display: 'Monitor',
  screen: 'Monitor',

  // Mousepads
  mousepad: 'Mousepad',
  mousepads: 'Mousepad',
  'mouse pad': 'Mousepad',
  'mouse pads': 'Mousepad',
  deskpad: 'Mousepad',
  deskmat: 'Mousepad',

  // Gaming Chairs
  chair: 'Gaming Chair',
  chairs: 'Gaming Chair',
  'gaming chair': 'Gaming Chair',
  'gaming chairs': 'Gaming Chair',

  // Controllers
  controller: 'Controller',
  controllers: 'Controller',
  gamepad: 'Controller',
  joystick: 'Controller',

  // Webcams
  webcam: 'Webcam',
  webcams: 'Webcam',
  camera: 'Webcam',

  // Microphones
  microphone: 'Microphone',
  microphones: 'Microphone',
  mic: 'Microphone',
  mics: 'Microphone',

  // Graphics Cards
  gpu: 'Graphics Card',
  gpus: 'Graphics Card',
  'graphics card': 'Graphics Card',
  'graphics cards': 'Graphics Card',
  'video card': 'Graphics Card',
};

/* ────────────────────────────────────────────────────────────────
   2. FEATURE / KEYWORD SETS
   ──────────────────────────────────────────────────────────────── */

const KEYWORD_GROUPS = {
  wireless: ['wireless', 'bluetooth', 'cordless', 'wire-free', 'bt'],
  rgb: ['rgb', 'lighting', 'backlit', 'led', 'chroma', 'lightsync'],
  mechanical: ['mechanical', 'mech', 'optical switch', 'cherry mx'],
  '4k': ['4k', 'uhd', '3840', '2160p'],
  '1440p': ['1440p', 'qhd', '2k', 'wqhd'],
  '144hz': ['144hz', '144 hz', 'high refresh'],
  '240hz': ['240hz', '240 hz'],
  '360hz': ['360hz', '360 hz'],
  ultrawide: ['ultrawide', 'ultra-wide', 'ultra wide', '21:9', '34 inch', '34"'],
  noise_cancelling: ['noise cancel', 'anc', 'noise-cancel', 'noise cancelling'],
  ergonomic: ['ergonomic', 'ergo', 'comfortable', 'comfort'],
  lightweight: ['lightweight', 'light weight', 'ultralight', 'ultra-light', 'light'],
  tkl: ['tkl', 'tenkeyless', 'compact'],
  streaming: ['streaming', 'stream', 'streamer', 'obs'],
  budget: ['budget', 'affordable', 'value', 'economical'],
  premium: ['premium', 'pro', 'flagship', 'high-end', 'high end', 'best', 'top'],
};

/* ────────────────────────────────────────────────────────────────
   3. INTENT PATTERNS
   ──────────────────────────────────────────────────────────────── */

const INTENTS = [
  {
    name: 'recommendation',
    patterns: [
      /recommend/i,
      /suggest/i,
      /show\s*me/i,
      /what.*(?:good|best|top)/i,
      /looking\s+for/i,
      /need\s+a/i,
      /want\s+a/i,
      /any\s+good/i,
      /which\s+(?:one|is)/i,
      /find\s+(?:me|a)/i,
      /search/i,
      /have\s+(?:any|a)/i,
      /do\s+you\s+have/i,
      /got\s+any/i,
      /give\s+me/i,
    ],
  },
  {
    name: 'cheapest',
    patterns: [
      /cheap/i,
      /lowest\s*price/i,
      /most\s*affordable/i,
      /budget/i,
      /under\s*\d/i,
      /below\s*\d/i,
      /less\s+than\s*\d/i,
    ],
  },
  {
    name: 'expensive',
    patterns: [
      /expensive/i,
      /highest\s*price/i,
      /most\s*premium/i,
      /top\s*(?:tier|end)/i,
      /flagship/i,
    ],
  },
  {
    name: 'best_rated',
    patterns: [
      /best\s*rat/i,
      /highest\s*rat/i,
      /top\s*rat/i,
      /most\s*popular/i,
    ],
  },
  {
    name: 'compare',
    patterns: [
      /compare/i,
      /vs\.?/i,
      /versus/i,
      /difference/i,
      /better.*or/i,
    ],
  },
  {
    name: 'greeting',
    patterns: [
      /^hi$/i,
      /^hello$/i,
      /^hey$/i,
      /^yo$/i,
      /^sup$/i,
      /good\s*(?:morning|evening|afternoon)/i,
      /greetings/i,
    ],
  },
  {
    name: 'thanks',
    patterns: [/thank/i, /thanks/i, /thx/i, /cheers/i, /appreciate/i],
  },
  {
    name: 'help',
    patterns: [/help/i, /what\s*can\s*you/i, /how\s*do/i, /capabilities/i],
  },
  {
    name: 'cart',
    patterns: [/add.*cart/i, /cart/i, /buy/i, /purchase/i, /order/i],
  },
];

/* ────────────────────────────────────────────────────────────────
   4. EXTRACTION HELPERS
   ──────────────────────────────────────────────────────────────── */

/** Extract price/budget from the query */
const extractBudget = (text) => {
  // "under 10000", "below 15k", "less than 20000", "within 5000"
  const underMatch = text.match(
    /(?:under|below|less\s+than|within|max|upto|up\s+to|budget\s*(?:of|is)?)\s*₹?\s*([\d,]+)\s*k?/i
  );
  if (underMatch) {
    let value = parseInt(underMatch[1].replace(/,/g, ''), 10);
    if (text.match(/\d+\s*k/i)) value *= 1000;
    return { max: value };
  }

  // "above 50000", "over 30000", "more than 20000"
  const aboveMatch = text.match(
    /(?:above|over|more\s+than|min|at\s+least|starting)\s*₹?\s*([\d,]+)\s*k?/i
  );
  if (aboveMatch) {
    let value = parseInt(aboveMatch[1].replace(/,/g, ''), 10);
    if (text.match(/\d+\s*k/i)) value *= 1000;
    return { min: value };
  }

  // "between 10000 and 20000", "10000-20000"
  const rangeMatch = text.match(
    /(?:between|from)?\s*₹?\s*([\d,]+)\s*k?\s*(?:to|-|and)\s*₹?\s*([\d,]+)\s*k?/i
  );
  if (rangeMatch) {
    let low = parseInt(rangeMatch[1].replace(/,/g, ''), 10);
    let high = parseInt(rangeMatch[2].replace(/,/g, ''), 10);
    if (text.match(/\d+\s*k/i)) {
      if (low < 1000) low *= 1000;
      if (high < 1000) high *= 1000;
    }
    return { min: low, max: high };
  }

  return null;
};

/** Detect the product category the user is asking about */
const detectCategory = (text) => {
  const lower = text.toLowerCase();

  // Try longest phrases first for accuracy
  const entries = Object.entries(CATEGORY_MAP).sort(
    (a, b) => b[0].length - a[0].length
  );

  for (const [phrase, category] of entries) {
    if (lower.includes(phrase)) return category;
  }

  return null;
};

/** Extract all matching feature keywords */
const extractKeywords = (text) => {
  const lower = text.toLowerCase();
  const matched = [];

  for (const [group, words] of Object.entries(KEYWORD_GROUPS)) {
    if (words.some((w) => lower.includes(w))) {
      matched.push(group);
    }
  }

  return matched;
};

/** Extract brand name if mentioned */
const extractBrand = (text) => {
  const brands = [
    'razer', 'corsair', 'logitech', 'steelseries', 'hyperx',
    'asus', 'msi', 'gigabyte', 'zowie', 'benq', 'samsung',
    'lg', 'dell', 'alienware', 'cooler master', 'nzxt',
    'secretlab', 'dxracer', 'noblechairs', 'elgato', 'rode',
    'blue', 'audio-technica', 'sennheiser', 'jbl', 'astro',
    'nvidia', 'amd', 'evga', 'sapphire', 'powercolor', 'zotac',
    'pny', 'inno3d', 'galax',
  ];
  const lower = text.toLowerCase();
  return brands.find((b) => lower.includes(b)) || null;
};

/** Detect primary intent from the user's message */
const detectIntent = (text) => {
  for (const intent of INTENTS) {
    if (intent.patterns.some((p) => p.test(text))) {
      return intent.name;
    }
  }
  return 'recommendation'; // default to product search
};

/* ────────────────────────────────────────────────────────────────
   5. PRODUCT FILTERING
   ──────────────────────────────────────────────────────────────── */

const filterProducts = (products, { category, budget, keywords, brand }) => {
  let results = [...products];

  // Filter by category
  if (category) {
    results = results.filter(
      (p) => p.category?.toLowerCase() === category.toLowerCase()
    );
  }

  // Filter by brand
  if (brand) {
    results = results.filter(
      (p) => p.brand?.toLowerCase() === brand.toLowerCase()
    );
  }

  // Filter by budget
  if (budget) {
    if (budget.max) results = results.filter((p) => p.price <= budget.max);
    if (budget.min) results = results.filter((p) => p.price >= budget.min);
  }

  // Filter by keywords — score each product
  if (keywords.length > 0) {
    results = results.map((p) => {
      const searchText = [
        p.name,
        p.description,
        p.brand,
        ...(p.features || []),
        ...(p.specifications?.map((s) => `${s.label} ${s.value}`) || []),
      ]
        .join(' ')
        .toLowerCase();

      const matchCount = keywords.reduce(
        (count, kw) =>
          KEYWORD_GROUPS[kw]?.some((w) => searchText.includes(w))
            ? count + 1
            : count,
        0
      );

      return { ...p, _relevance: matchCount };
    });

    // Only keep products with at least one keyword match, if possible
    const matched = results.filter((p) => p._relevance > 0);
    if (matched.length > 0) results = matched;

    // Sort by relevance descending
    results.sort((a, b) => (b._relevance || 0) - (a._relevance || 0));
  }

  return results;
};

/* ────────────────────────────────────────────────────────────────
   6. SORT HELPERS
   ──────────────────────────────────────────────────────────────── */

const sortByPrice = (arr, dir = 'asc') =>
  [...arr].sort((a, b) => (dir === 'asc' ? a.price - b.price : b.price - a.price));

const sortByRating = (arr) =>
  [...arr].sort((a, b) => b.rating - a.rating);

/* ────────────────────────────────────────────────────────────────
   7. RESPONSE GENERATORS
   ──────────────────────────────────────────────────────────────── */

const greetings = [
  "Hey there, gamer! 🎮 How can I help you gear up today?",
  "Welcome back to NEXUS! Ready to find your next upgrade?",
  "Yo! I'm the NEXUS AI. Ask me about any gaming gear — keyboards, mice, GPUs, you name it.",
  "Hey! Looking for something specific? I've got the whole NEXUS catalog memorized. 🧠",
];

const thankResponses = [
  "Happy to help! Let me know if you need anything else. 🎯",
  "Anytime! That's what I'm here for. Game on! 🎮",
  "You're welcome! Enjoy your gaming session. ⚡",
  "No problem! Feel free to ask anything else about our gear.",
];

const helpMessage = `Here's what I can do for you:

🔍 **Product Search** — "Show me gaming keyboards"
💰 **Budget Filtering** — "Best mouse under 5000"
⭐ **Top Rated** — "Best rated headset"
🏷️ **Brand Search** — "Razer keyboards"
🎯 **Feature Search** — "Wireless RGB mouse"
📊 **Comparisons** — "Compare keyboards"
🛒 **Quick Actions** — Add products to cart

Just ask naturally — I understand gaming lingo! 🎮`;

const fallbackMessages = [
  "I'm not sure I understood that. Try asking about a specific product category like keyboards, mice, or GPUs!",
  "Hmm, I couldn't parse that one. Try something like \"best gaming mouse under 5000\" or \"show me RGB keyboards\".",
  "I'm specialized in gaming gear. Ask me about keyboards, mice, headsets, monitors, GPUs, chairs, and more!",
];

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

/* ────────────────────────────────────────────────────────────────
   8. MAIN AI PROCESSOR
   ──────────────────────────────────────────────────────────────── */

/**
 * Process a user message against the product catalog and
 * return a structured response.
 *
 * @param {string}  message   Raw user input
 * @param {Array}   products  Unified product array from Redux / API
 * @returns {{ type: string, text?: string, products?: Array, intent?: string }}
 */
export const processQuery = (message, products = []) => {
  if (!message || typeof message !== 'string') {
    return { type: 'text', text: randomFrom(fallbackMessages) };
  }

  const text = message.trim();
  const intent = detectIntent(text);

  // ── Greeting ──
  if (intent === 'greeting') {
    return { type: 'text', text: randomFrom(greetings), intent };
  }

  // ── Thanks ──
  if (intent === 'thanks') {
    return { type: 'text', text: randomFrom(thankResponses), intent };
  }

  // ── Help ──
  if (intent === 'help') {
    return { type: 'text', text: helpMessage, intent };
  }

  // ── Product-related intents ──
  const category = detectCategory(text);
  const budget = extractBudget(text);
  const keywords = extractKeywords(text);
  const brand = extractBrand(text);

  // If no category, brand, budget, or keywords detected → fallback
  if (!category && !budget && keywords.length === 0 && !brand) {
    // Try a loose text search on product name / description
    const looseMatches = products.filter((p) => {
      const hay = `${p.name} ${p.description} ${p.brand} ${p.category}`.toLowerCase();
      // Take significant words from the query (3+ chars)
      const words = text
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length >= 3);
      return words.some((w) => hay.includes(w));
    });

    if (looseMatches.length > 0) {
      const sorted = sortByRating(looseMatches).slice(0, 4);
      return {
        type: 'recommendation',
        text: `Here's what I found for "${text}":`,
        products: sorted,
        intent: 'recommendation',
      };
    }

    return { type: 'text', text: randomFrom(fallbackMessages), intent: 'unknown' };
  }

  // Filter the catalog
  let results = filterProducts(products, { category, budget, keywords, brand });

  // Apply intent-specific sorting
  if (intent === 'cheapest') {
    results = sortByPrice(results, 'asc');
  } else if (intent === 'expensive') {
    results = sortByPrice(results, 'desc');
  } else if (intent === 'best_rated') {
    results = sortByRating(results);
  } else {
    // Default: sort by rating then price
    results = sortByRating(results);
  }

  // Limit results (show top 4)
  const topResults = results.slice(0, 4);

  if (topResults.length === 0) {
    const categoryLabel = category || 'products';
    const budgetLabel = budget
      ? budget.max
        ? ` under ${formatPrice(budget.max)}`
        : budget.min
          ? ` above ${formatPrice(budget.min)}`
          : ''
      : '';
    return {
      type: 'text',
      text: `Sorry, I couldn't find any ${categoryLabel}${budgetLabel} matching your criteria. Try adjusting your budget or filters!`,
      intent,
    };
  }

  // Build response text
  let responseText = '';
  const catName = category || 'products';
  if (intent === 'cheapest') {
    responseText = `Here are the most affordable ${catName} I found:`;
  } else if (intent === 'expensive') {
    responseText = `Here are the premium ${catName}:`;
  } else if (intent === 'best_rated') {
    responseText = `Top rated ${catName} in our store:`;
  } else if (brand) {
    responseText = `Here are ${brand.charAt(0).toUpperCase() + brand.slice(1)} ${catName} I found:`;
  } else if (budget) {
    const range = budget.max
      ? `under ${formatPrice(budget.max)}`
      : `above ${formatPrice(budget.min)}`;
    responseText = `Here are the best ${catName} ${range}:`;
  } else {
    responseText = `Here are my top ${catName} recommendations:`;
  }

  return {
    type: 'recommendation',
    text: responseText,
    products: topResults,
    intent,
    totalFound: results.length,
  };
};

/**
 * Generate a welcome message
 */
export const getWelcomeMessage = () => ({
  id: 'welcome',
  role: 'bot',
  type: 'text',
  text: "Welcome to **NEXUS**. I'm your AI gaming gear assistant. ⚡\n\nAsk me about keyboards, mice, headsets, monitors, GPUs, and more. I can help you find the perfect gear for your setup!",
  timestamp: Date.now(),
});
