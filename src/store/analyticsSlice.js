import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ─── Mock Data Generators ────────────────────────────────────────────

const generateRevenueData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, i) => ({
    month,
    revenue: Math.floor(Math.random() * 500000 + 200000 + i * 40000),
    orders: Math.floor(Math.random() * 300 + 120 + i * 20),
    profit: Math.floor(Math.random() * 200000 + 80000 + i * 15000),
  }));
};

const generateDailyRevenue = (days = 30) => {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      revenue: Math.floor(Math.random() * 35000 + 8000),
      orders: Math.floor(Math.random() * 30 + 5),
    });
  }
  return data;
};

const generateWeeklyRevenue = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day) => ({
    date: day,
    revenue: Math.floor(Math.random() * 25000 + 10000),
    orders: Math.floor(Math.random() * 20 + 5),
  }));
};

const generateSalesData = () => [
  { category: 'Keyboards', sales: Math.floor(Math.random() * 200 + 150), revenue: Math.floor(Math.random() * 600000 + 400000), color: '#00FF88' },
  { category: 'Mice', sales: Math.floor(Math.random() * 180 + 130), revenue: Math.floor(Math.random() * 400000 + 250000), color: '#00E0FF' },
  { category: 'Headsets', sales: Math.floor(Math.random() * 160 + 100), revenue: Math.floor(Math.random() * 500000 + 300000), color: '#BD00FF' },
  { category: 'Monitors', sales: Math.floor(Math.random() * 80 + 50), revenue: Math.floor(Math.random() * 900000 + 600000), color: '#FF6B35' },
  { category: 'Graphics Cards', sales: Math.floor(Math.random() * 60 + 30), revenue: Math.floor(Math.random() * 1200000 + 800000), color: '#FFD700' },
  { category: 'Chairs', sales: Math.floor(Math.random() * 90 + 60), revenue: Math.floor(Math.random() * 700000 + 400000), color: '#FF4081' },
];

const generateUserData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, i) => ({
    month,
    newUsers: Math.floor(Math.random() * 500 + 200 + i * 50),
    activeUsers: Math.floor(Math.random() * 2000 + 1000 + i * 150),
    returningUsers: Math.floor(Math.random() * 800 + 400 + i * 80),
  }));
};

const generateTopProducts = () => [
  { id: 1, name: 'Corsair K100 RGB', category: 'Keyboards', unitsSold: 342, revenue: 1539000, growth: 23.5, stock: 45, image: '/images/keyboards/corsair-k100-rgb-2.avif' },
  { id: 2, name: 'Logitech G Pro X', category: 'Mice', unitsSold: 289, revenue: 867000, growth: 18.2, stock: 12, image: '/images/mice/logitech-gpro-x.avif' },
  { id: 3, name: 'SteelSeries Arctis Nova', category: 'Headsets', unitsSold: 267, revenue: 1068000, growth: -5.3, stock: 78, image: '/images/headsets/steelseries-arctis.avif' },
  { id: 4, name: 'ASUS ROG Swift 360Hz', category: 'Monitors', unitsSold: 156, revenue: 2340000, growth: 31.8, stock: 8, image: '/images/monitors/asus-rog-swift.avif' },
  { id: 5, name: 'RTX 4090 Founders', category: 'Graphics Cards', unitsSold: 89, revenue: 8010000, growth: 45.2, stock: 3, image: '/images/graphics-cards/rtx4090.avif' },
  { id: 6, name: 'Razer DeathAdder V3', category: 'Mice', unitsSold: 312, revenue: 624000, growth: 12.7, stock: 156, image: '/images/mice/razer-deathadder.avif' },
  { id: 7, name: 'HyperX Cloud III', category: 'Headsets', unitsSold: 198, revenue: 594000, growth: 8.4, stock: 67, image: '/images/headsets/hyperx-cloud.avif' },
  { id: 8, name: 'Secretlab Titan Evo', category: 'Chairs', unitsSold: 134, revenue: 1206000, growth: 22.1, stock: 23, image: '/images/gaming-chairs/secretlab-titan.avif' },
  { id: 9, name: 'Wooting 60HE', category: 'Keyboards', unitsSold: 276, revenue: 1104000, growth: 67.3, stock: 5, image: '/images/keyboards/wooting-60he.avif' },
  { id: 10, name: 'Samsung Odyssey G9', category: 'Monitors', unitsSold: 98, revenue: 2450000, growth: 19.9, stock: 15, image: '/images/monitors/samsung-odyssey.avif' },
];

const generateConversionData = () => ({
  visitors: 48500,
  productViews: 32200,
  addToCart: 8900,
  checkoutStarted: 4200,
  paymentCompleted: 2850,
});

const generateFlashSaleData = () => ({
  totalRevenue: 1250000,
  normalRevenue: 780000,
  upliftPercent: 60.3,
  totalOrders: 456,
  avgDiscount: 32,
  topProduct: {
    name: 'Corsair K100 RGB',
    originalPrice: 24999,
    salePrice: 16999,
    unitsSold: 89,
    revenue: 1512911,
  },
  hourlyData: Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    saleRevenue: Math.floor(Math.random() * 80000 + (i >= 10 && i <= 22 ? 40000 : 5000)),
    normalRevenue: Math.floor(Math.random() * 30000 + 10000),
  })),
});

// ─── Async Thunks ────────────────────────────────────────────────────

export const fetchAnalytics = createAsyncThunk(
  'analytics/fetchAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1200));
      return {
        revenueData: generateRevenueData(),
        dailyRevenue: generateDailyRevenue(30),
        weeklyRevenue: generateWeeklyRevenue(),
        salesData: generateSalesData(),
        userData: generateUserData(),
        topProducts: generateTopProducts(),
        conversionData: generateConversionData(),
        flashSaleData: generateFlashSaleData(),
        stats: {
          totalRevenue: 12847500,
          monthlyRevenue: 1842300,
          avgOrderValue: 4510,
          conversionRate: 5.87,
          activeUsers: 8420,
          totalOrders: 2850,
          returnRate: 3.2,
          customerSatisfaction: 4.7,
        },
      };
    } catch (err) {
      return rejectWithValue('Failed to fetch analytics data');
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────────────

const initialState = {
  revenueData: [],
  dailyRevenue: [],
  weeklyRevenue: [],
  salesData: [],
  userData: [],
  topProducts: [],
  conversionData: null,
  flashSaleData: null,
  stats: null,
  dateRange: '30d',
  loading: false,
  error: null,
  autoRefresh: false,
  lastUpdated: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
    toggleAutoRefresh: (state) => {
      state.autoRefresh = !state.autoRefresh;
    },
    updateMetrics: (state, action) => {
      Object.assign(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.revenueData = action.payload.revenueData;
        state.dailyRevenue = action.payload.dailyRevenue;
        state.weeklyRevenue = action.payload.weeklyRevenue;
        state.salesData = action.payload.salesData;
        state.userData = action.payload.userData;
        state.topProducts = action.payload.topProducts;
        state.conversionData = action.payload.conversionData;
        state.flashSaleData = action.payload.flashSaleData;
        state.stats = action.payload.stats;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setDateRange, toggleAutoRefresh, updateMetrics } = analyticsSlice.actions;
export default analyticsSlice.reducer;
