import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, Edit3, Plus, AlertTriangle, X, Filter } from 'lucide-react';
import { fetchAdminProducts, deleteProduct, clearAdminMessage } from '../../store/adminSlice';

const CATEGORY_MAP = {
  keyboards: 'Keyboard',
  mouse: 'Mouse',
  headsets: 'Headset',
  monitors: 'Monitor',
  mousepads: 'Mousepad',
  gamingchairs: 'Gaming Chair',
  controllers: 'Controller',
  webcams: 'Webcam',
  microphones: 'Microphone',
  graphicscards: 'Graphics Card',
};

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { products, loading, success, error } = useSelector((s) => s.admin);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  // Auto-clear success/error messages
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => dispatch(clearAdminMessage()), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !filterCategory || p._category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map((p) => p._category))].sort();

  const handleDelete = () => {
    if (deleteModal) {
      dispatch(deleteProduct({ category: deleteModal._category, id: deleteModal.id }));
      setDeleteModal(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-sm text-neutral-500 mt-1">{products.length} total products</p>
        </motion.div>
        <Link
          to="/admin/add-product"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00FF88] to-[#00E0FF] text-[#050505] font-bold text-sm hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {(success || error) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3 rounded-xl text-sm font-medium flex items-center justify-between ${
              success
                ? 'bg-[#00FF88]/10 border border-[#00FF88]/20 text-[#00FF88]'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}
          >
            <span>{success || error}</span>
            <button onClick={() => dispatch(clearAdminMessage())}>
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-11 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-neutral-600 text-sm outline-none focus:border-[#00FF88]/40 transition"
          />
        </div>
        <div className="relative">
          <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 pointer-events-none" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="pl-11 pr-8 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm outline-none focus:border-[#00FF88]/40 transition appearance-none cursor-pointer min-w-[160px]"
          >
            <option value="" className="bg-[#0a0a0a]">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c} className="bg-[#0a0a0a]">
                {CATEGORY_MAP[c] || c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product table */}
      {loading && products.length === 0 ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-[#00FF88]/30 border-t-[#00FF88] rounded-full animate-spin" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden"
        >
          {/* Table header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/[0.06] text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
            <span className="col-span-1">Image</span>
            <span className="col-span-3">Name</span>
            <span className="col-span-2">Category</span>
            <span className="col-span-1">Price</span>
            <span className="col-span-1">Sale</span>
            <span className="col-span-1">Stock</span>
            <span className="col-span-1">Rating</span>
            <span className="col-span-2 text-right">Actions</span>
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 text-sm">No products found</div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {filtered.map((product, i) => (
                <motion.div
                  key={`${product._category}-${product.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition"
                >
                  {/* Image */}
                  <div className="col-span-1">
                    <img
                      src={product.images?.[0] || 'https://via.placeholder.com/40'}
                      alt={product.title}
                      className="w-10 h-10 rounded-lg object-cover bg-white/5"
                    />
                  </div>

                  {/* Name */}
                  <div className="col-span-3">
                    <p className="text-sm font-medium text-white truncate">{product.title}</p>
                    <p className="text-xs text-neutral-500">{product.brand}</p>
                  </div>

                  {/* Category */}
                  <div className="col-span-2">
                    <span className="inline-block px-2 py-1 rounded-lg bg-white/5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                      {CATEGORY_MAP[product._category] || product._category}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="col-span-1 text-sm text-white font-medium">${product.price}</div>

                  {/* Sale */}
                  <div className="col-span-1 text-sm text-[#00FF88] font-medium">
                    {product.discountPrice ? `$${product.discountPrice}` : '—'}
                  </div>

                  {/* Stock */}
                  <div className="col-span-1">
                    <span
                      className={`text-sm font-medium ${
                        product.stock < 10 ? 'text-red-400' : 'text-white'
                      }`}
                    >
                      {product.stock}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="col-span-1 text-sm text-yellow-400 font-medium">
                    ★ {product.rating}
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/edit-product/${product._category}/${product.id}`}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-neutral-400 hover:text-[#00E0FF] hover:bg-[#00E0FF]/10 transition"
                      title="Edit"
                    >
                      <Edit3 size={14} />
                    </Link>
                    <button
                      onClick={() => setDeleteModal(product)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteModal(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm p-6 rounded-2xl bg-[#0f0f10] border border-white/10 shadow-2xl z-50"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Delete Product</h3>
                  <p className="text-xs text-neutral-500">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-sm text-neutral-400 mb-6">
                Are you sure you want to delete <strong className="text-white">{deleteModal.title}</strong>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 text-neutral-400 text-sm font-medium hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 text-sm font-bold hover:bg-red-500/30 transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;
