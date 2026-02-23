import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../utils/analyticsCalculations';

const ITEMS_PER_PAGE = 5;

const TopProductsTable = ({ products = [] }) => {
  const [sortKey, setSortKey] = useState('revenue');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(0);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
    setPage(0);
  };

  const sorted = useMemo(() => {
    return [...products].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      return sortDir === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });
  }, [products, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const columns = [
    { key: 'name', label: 'Product', sortable: false },
    { key: 'unitsSold', label: 'Units Sold', sortable: true },
    { key: 'revenue', label: 'Revenue', sortable: true },
    { key: 'growth', label: 'Growth', sortable: true },
    { key: 'stock', label: 'Stock', sortable: true },
  ];

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ChevronUp size={10} className="text-neutral-700" />;
    return sortDir === 'asc'
      ? <ChevronUp size={10} className="text-[#00FF88]" />
      : <ChevronDown size={10} className="text-[#00FF88]" />;
  };

  const getStockStatus = (stock) => {
    if (stock <= 5) return { label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/10', glow: 'shadow-[0_0_12px_rgba(255,0,0,0.3)]' };
    if (stock <= 20) return { label: 'Low', color: 'text-amber-400', bg: 'bg-amber-500/10', glow: '' };
    return { label: 'In Stock', color: 'text-emerald-400', bg: 'bg-emerald-500/10', glow: '' };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 pb-0">
        <h3 className="text-sm font-bold text-white">Top Products</h3>
        <p className="text-[11px] text-neutral-500 mt-0.5">Best performing products by revenue</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-neutral-500 ${
                    col.sortable ? 'cursor-pointer hover:text-white transition select-none' : ''
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && <SortIcon col={col.key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="wait">
              {paginated.map((product, i) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: i * 0.05 }}
                    className={`border-b border-white/[0.03] group transition-all duration-300 hover:bg-white/[0.03] ${
                      product.stock <= 5 ? 'hover:bg-red-500/[0.04]' : ''
                    }`}
                    style={{
                      boxShadow: product.stock <= 5 ? '0 0 20px rgba(255,60,60,0.05) inset' : 'none',
                    }}
                  >
                    {/* Product Name */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center overflow-hidden flex-shrink-0">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-neutral-600 font-bold">
                              {product.name?.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white group-hover:text-[#00FF88] transition">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-neutral-600">{product.category}</p>
                        </div>
                      </div>
                    </td>

                    {/* Units Sold */}
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-semibold text-neutral-300 tabular-nums">
                        {product.unitsSold.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Revenue */}
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-bold text-[#00FF88] tabular-nums">
                        {formatCurrency(product.revenue)}
                      </span>
                    </td>

                    {/* Growth */}
                    <td className="px-5 py-3.5">
                      <div className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-lg ${
                        product.growth >= 0
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : 'text-red-400 bg-red-500/10'
                      }`}>
                        {product.growth >= 0 ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        {product.growth >= 0 ? '+' : ''}{product.growth}%
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg ${stockStatus.color} ${stockStatus.bg} ${stockStatus.glow}`}>
                          {product.stock <= 5 && <AlertTriangle size={10} />}
                          {product.stock}
                        </span>
                        <span className={`text-[10px] font-medium ${stockStatus.color}`}>
                          {stockStatus.label}
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.04]">
          <span className="text-[11px] text-neutral-500">
            Showing {page * ITEMS_PER_PAGE + 1}-{Math.min((page + 1) * ITEMS_PER_PAGE, sorted.length)} of {sorted.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-7 h-7 rounded-lg text-[11px] font-medium flex items-center justify-center transition ${
                  page === i
                    ? 'bg-[#00FF88]/15 text-[#00FF88]'
                    : 'text-neutral-500 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page === totalPages - 1}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TopProductsTable;
