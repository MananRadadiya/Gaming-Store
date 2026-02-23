// ─── Analytics Calculation Utilities ─────────────────────────────────

/**
 * Format currency in INR
 */
export const formatCurrency = (amount) => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount.toLocaleString('en-IN')}`;
};

/**
 * Format large numbers with K/L/Cr suffixes
 */
export const formatNumber = (num) => {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString('en-IN');
};

/**
 * Calculate percentage change
 */
export const calcGrowth = (current, previous) => {
  if (!previous) return 0;
  return ((current - previous) / previous * 100).toFixed(1);
};

/**
 * Aggregate revenue by month
 */
export const aggregateMonthly = (data) => {
  return data.reduce((acc, item) => {
    const existing = acc.find((a) => a.month === item.month);
    if (existing) {
      existing.revenue += item.revenue;
      existing.orders += item.orders;
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, []);
};

/**
 * Calculate category share percentages
 */
export const calcCategoryShares = (salesData) => {
  const total = salesData.reduce((sum, item) => sum + item.revenue, 0);
  return salesData.map((item) => ({
    ...item,
    share: ((item.revenue / total) * 100).toFixed(1),
  }));
};

/**
 * Calculate conversion rates between funnel stages
 */
export const calcFunnelRates = (conversionData) => {
  if (!conversionData) return [];
  const { visitors, productViews, addToCart, checkoutStarted, paymentCompleted } = conversionData;
  return [
    { stage: 'Visitors', value: visitors, rate: 100, color: '#00FF88' },
    { stage: 'Product Views', value: productViews, rate: ((productViews / visitors) * 100).toFixed(1), color: '#00E0FF' },
    { stage: 'Add to Cart', value: addToCart, rate: ((addToCart / visitors) * 100).toFixed(1), color: '#BD00FF' },
    { stage: 'Checkout Started', value: checkoutStarted, rate: ((checkoutStarted / visitors) * 100).toFixed(1), color: '#FFD700' },
    { stage: 'Payment Completed', value: paymentCompleted, rate: ((paymentCompleted / visitors) * 100).toFixed(1), color: '#FF4081' },
  ];
};

/**
 * Calculate KPIs for user analytics
 */
export const calcUserKPIs = (userData) => {
  if (!userData || !userData.length) return {};
  const latest = userData[userData.length - 1];
  const prev = userData[userData.length - 2] || latest;
  return {
    retentionRate: ((latest.returningUsers / latest.activeUsers) * 100).toFixed(1),
    retentionGrowth: calcGrowth(
      latest.returningUsers / latest.activeUsers,
      prev.returningUsers / prev.activeUsers
    ),
    lifetimeValue: 12450,
    avgSessionDuration: '8m 24s',
    newUserGrowth: calcGrowth(latest.newUsers, prev.newUsers),
    activeUserGrowth: calcGrowth(latest.activeUsers, prev.activeUsers),
  };
};

/**
 * Generate CSV content from analytics data
 */
export const generateCSV = (stats, topProducts, salesData) => {
  let csv = 'NEXUS Analytics Report\n\n';

  // Stats
  csv += 'Metric,Value\n';
  csv += `Total Revenue,₹${stats?.totalRevenue?.toLocaleString('en-IN')}\n`;
  csv += `Monthly Revenue,₹${stats?.monthlyRevenue?.toLocaleString('en-IN')}\n`;
  csv += `Average Order Value,₹${stats?.avgOrderValue?.toLocaleString('en-IN')}\n`;
  csv += `Conversion Rate,${stats?.conversionRate}%\n`;
  csv += `Active Users,${stats?.activeUsers}\n`;
  csv += `Total Orders,${stats?.totalOrders}\n\n`;

  // Top Products
  csv += 'Top Products\n';
  csv += 'Product,Category,Units Sold,Revenue,Growth %\n';
  topProducts?.forEach((p) => {
    csv += `${p.name},${p.category},${p.unitsSold},₹${p.revenue.toLocaleString('en-IN')},${p.growth}%\n`;
  });
  csv += '\n';

  // Category breakdown
  csv += 'Category Breakdown\n';
  csv += 'Category,Sales,Revenue\n';
  salesData?.forEach((s) => {
    csv += `${s.category},${s.sales},₹${s.revenue.toLocaleString('en-IN')}\n`;
  });

  return csv;
};

/**
 * Generate PDF-like report (returns HTML string for window.print)
 */
export const generatePDFContent = (stats, topProducts, salesData) => {
  return `
    <html>
    <head>
      <title>NEXUS Analytics Report</title>
      <style>
        body { font-family: 'Inter', sans-serif; background: #0B0F14; color: #fff; padding: 40px; }
        h1 { color: #00FF88; font-size: 28px; margin-bottom: 8px; }
        h2 { color: #00E0FF; font-size: 20px; margin-top: 32px; border-bottom: 1px solid #1a1f2e; padding-bottom: 8px; }
        .subtitle { color: #888; font-size: 12px; margin-bottom: 32px; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th { text-align: left; color: #00E0FF; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding: 10px 12px; border-bottom: 1px solid #1a1f2e; }
        td { padding: 10px 12px; border-bottom: 1px solid #0d1117; font-size: 13px; }
        tr:hover { background: rgba(0,255,136,0.03); }
        .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 16px; }
        .stat-card { background: #111; border: 1px solid #1a1f2e; border-radius: 12px; padding: 20px; }
        .stat-label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; }
        .stat-value { font-size: 24px; font-weight: 700; color: #00FF88; margin-top: 4px; }
        .positive { color: #00FF88; }
        .negative { color: #FF4444; }
        @media print { body { background: #fff; color: #000; } .stat-card { border-color: #ddd; } .stat-value { color: #00aa55; } th { color: #0088aa; } }
      </style>
    </head>
    <body>
      <h1>⚡ NEXUS Analytics Report</h1>
      <p class="subtitle">Generated on ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}</p>

      <h2>📊 Key Metrics</h2>
      <div class="stat-grid">
        <div class="stat-card"><div class="stat-label">Total Revenue</div><div class="stat-value">₹${stats?.totalRevenue?.toLocaleString('en-IN')}</div></div>
        <div class="stat-card"><div class="stat-label">Monthly Revenue</div><div class="stat-value">₹${stats?.monthlyRevenue?.toLocaleString('en-IN')}</div></div>
        <div class="stat-card"><div class="stat-label">Avg Order Value</div><div class="stat-value">₹${stats?.avgOrderValue?.toLocaleString('en-IN')}</div></div>
        <div class="stat-card"><div class="stat-label">Conversion Rate</div><div class="stat-value">${stats?.conversionRate}%</div></div>
        <div class="stat-card"><div class="stat-label">Active Users</div><div class="stat-value">${stats?.activeUsers?.toLocaleString('en-IN')}</div></div>
        <div class="stat-card"><div class="stat-label">Total Orders</div><div class="stat-value">${stats?.totalOrders?.toLocaleString('en-IN')}</div></div>
      </div>

      <h2>🏆 Top Products</h2>
      <table>
        <tr><th>Product</th><th>Category</th><th>Units Sold</th><th>Revenue</th><th>Growth</th></tr>
        ${topProducts?.map((p) => `
          <tr>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>${p.unitsSold}</td>
            <td>₹${p.revenue.toLocaleString('en-IN')}</td>
            <td class="${p.growth >= 0 ? 'positive' : 'negative'}">${p.growth >= 0 ? '+' : ''}${p.growth}%</td>
          </tr>
        `).join('')}
      </table>

      <h2>📦 Category Breakdown</h2>
      <table>
        <tr><th>Category</th><th>Sales</th><th>Revenue</th></tr>
        ${salesData?.map((s) => `
          <tr>
            <td>${s.category}</td>
            <td>${s.sales}</td>
            <td>₹${s.revenue.toLocaleString('en-IN')}</td>
          </tr>
        `).join('')}
      </table>
    </body>
    </html>
  `;
};

/**
 * Download a file with given content
 */
export const downloadFile = (content, filename, type = 'text/csv') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export as PDF (opens print dialog)
 */
export const exportPDF = (htmlContent) => {
  const win = window.open('', '_blank');
  win.document.write(htmlContent);
  win.document.close();
  setTimeout(() => win.print(), 500);
};
