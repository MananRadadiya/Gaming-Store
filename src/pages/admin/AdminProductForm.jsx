import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Loader2, ImagePlus, X } from 'lucide-react';
import { addProduct, updateProduct, clearAdminMessage } from '../../store/adminSlice';
import axios from 'axios';

const CATEGORIES = [
  { value: 'keyboards', label: 'Keyboard' },
  { value: 'mouse', label: 'Mouse' },
  { value: 'headsets', label: 'Headset' },
  { value: 'monitors', label: 'Monitor' },
  { value: 'mousepads', label: 'Mousepad' },
  { value: 'gamingchairs', label: 'Gaming Chair' },
  { value: 'controllers', label: 'Controller' },
  { value: 'webcams', label: 'Webcam' },
  { value: 'microphones', label: 'Microphone' },
  { value: 'graphicscards', label: 'Graphics Card' },
];

const INITIAL_FORM = {
  title: '',
  brand: '',
  price: '',
  discountPrice: '',
  rating: '4.5',
  stock: '',
  category: 'keyboards',
  badge: '',
  description: '',
  images: [''],
  features: [''],
};

const AdminProductForm = () => {
  const { category: editCategory, id: editId } = useParams();
  const isEditMode = !!editId;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success } = useSelector((s) => s.admin);

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [fetchingProduct, setFetchingProduct] = useState(false);

  // If editing, fetch the product data
  useEffect(() => {
    if (isEditMode && editCategory && editId) {
      setFetchingProduct(true);
      axios
        .get(`http://localhost:3001/${editCategory}/${editId}`)
        .then(({ data }) => {
          setForm({
            title: data.title || '',
            brand: data.brand || '',
            price: String(data.price || ''),
            discountPrice: String(data.discountPrice || ''),
            rating: String(data.rating || '4.5'),
            stock: String(data.stock || ''),
            category: editCategory,
            badge: data.badge || '',
            description: data.description || '',
            images: data.images?.length ? data.images : [''],
            features: data.features?.length ? data.features : [''],
          });
        })
        .catch(() => navigate('/admin/products'))
        .finally(() => setFetchingProduct(false));
    }
  }, [isEditMode, editCategory, editId, navigate]);

  // Navigate away on success
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearAdminMessage());
        navigate('/admin/products');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch, navigate]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Required';
    if (!form.brand.trim()) errs.brand = 'Required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) errs.price = 'Valid price required';
    if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0) errs.stock = 'Valid stock required';
    if (!form.description.trim()) errs.description = 'Required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const productData = {
      title: form.title.trim(),
      brand: form.brand.trim(),
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : Number(form.price),
      rating: Number(form.rating),
      stock: Number(form.stock),
      category: form.category,
      badge: form.badge.trim() || null,
      description: form.description.trim(),
      images: form.images.filter((img) => img.trim()),
      features: form.features.filter((f) => f.trim()),
    };

    if (isEditMode) {
      dispatch(updateProduct({ category: editCategory, id: Number(editId), product: productData }));
    } else {
      dispatch(addProduct({ category: form.category, product: productData }));
    }
  };

  const updateField = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };

  // Array field helpers
  const addArrayItem = (field) => setForm({ ...form, [field]: [...form[field], ''] });
  const removeArrayItem = (field, idx) =>
    setForm({ ...form, [field]: form[field].filter((_, i) => i !== idx) });
  const updateArrayItem = (field, idx, value) => {
    const updated = [...form[field]];
    updated[idx] = value;
    setForm({ ...form, [field]: updated });
  };

  if (fetchingProduct) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#00FF88]/30 border-t-[#00FF88] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/products')}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition"
        >
          <ArrowLeft size={18} />
        </button>
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-2xl font-bold text-white">
            {isEditMode ? 'Edit Product' : 'Add Product'}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {isEditMode ? 'Update product details' : 'Add a new gaming product'}
          </p>
        </motion.div>
      </div>

      {/* Success toast */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-[#00FF88]/10 border border-[#00FF88]/20 text-[#00FF88] text-sm font-medium"
        >
          {success}
        </motion.div>
      )}

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Basic info card */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 space-y-5">
          <h3 className="text-sm font-bold text-white mb-4">Basic Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputField label="Title" value={form.title} onChange={(v) => updateField('title', v)} error={errors.title} />
            <InputField label="Brand" value={form.brand} onChange={(v) => updateField('brand', v)} error={errors.brand} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <InputField label="Price ($)" type="number" value={form.price} onChange={(v) => updateField('price', v)} error={errors.price} />
            <InputField label="Sale Price ($)" type="number" value={form.discountPrice} onChange={(v) => updateField('discountPrice', v)} placeholder="Optional" />
            <InputField label="Stock" type="number" value={form.stock} onChange={(v) => updateField('stock', v)} error={errors.stock} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Category select */}
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-2 uppercase tracking-wider">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
                disabled={isEditMode}
                className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm outline-none focus:border-[#00FF88]/40 transition appearance-none disabled:opacity-50"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value} className="bg-[#0a0a0a]">
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <InputField label="Badge" value={form.badge} onChange={(v) => updateField('badge', v)} placeholder="e.g. New, Pro" />
            <InputField label="Rating" type="number" value={form.rating} onChange={(v) => updateField('rating', v)} />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-2 uppercase tracking-wider">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={3}
              className={`w-full px-4 py-2.5 bg-white/[0.03] border rounded-xl text-white placeholder-neutral-600 text-sm outline-none resize-none transition ${
                errors.description ? 'border-red-500/50' : 'border-white/[0.08] focus:border-[#00FF88]/40'
              }`}
              placeholder="Product description…"
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
          </div>
        </div>

        {/* Images */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Images</h3>
            <button
              type="button"
              onClick={() => addArrayItem('images')}
              className="text-xs text-[#00E0FF] hover:text-[#00FF88] transition font-medium flex items-center gap-1"
            >
              <ImagePlus size={14} /> Add URL
            </button>
          </div>
          {form.images.map((img, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={img}
                onChange={(e) => updateArrayItem('images', idx, e.target.value)}
                placeholder="https://images.unsplash.com/…"
                className="flex-1 px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-neutral-600 text-sm outline-none focus:border-[#00FF88]/40 transition"
              />
              {form.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('images', idx)}
                  className="w-10 flex items-center justify-center rounded-xl bg-white/5 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Features</h3>
            <button
              type="button"
              onClick={() => addArrayItem('features')}
              className="text-xs text-[#00E0FF] hover:text-[#00FF88] transition font-medium"
            >
              + Add Feature
            </button>
          </div>
          {form.features.map((feat, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={feat}
                onChange={(e) => updateArrayItem('features', idx, e.target.value)}
                placeholder="e.g. Per-Key RGB"
                className="flex-1 px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-neutral-600 text-sm outline-none focus:border-[#00FF88]/40 transition"
              />
              {form.features.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('features', idx)}
                  className="w-10 flex items-center justify-center rounded-xl bg-white/5 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-2.5 rounded-xl bg-white/5 text-neutral-400 text-sm font-medium hover:bg-white/10 transition"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00FF88] to-[#00E0FF] text-[#050505] font-bold text-sm flex items-center gap-2 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save size={16} />
                {isEditMode ? 'Update Product' : 'Add Product'}
              </>
            )}
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
};

// ---------- Reusable input ----------

const InputField = ({ label, value, onChange, error, type = 'text', placeholder }) => (
  <div>
    <label className="block text-xs font-medium text-neutral-400 mb-2 uppercase tracking-wider">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      step={type === 'number' ? 'any' : undefined}
      className={`w-full px-4 py-2.5 bg-white/[0.03] border rounded-xl text-white placeholder-neutral-600 text-sm outline-none transition ${
        error ? 'border-red-500/50' : 'border-white/[0.08] focus:border-[#00FF88]/40'
      }`}
    />
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

export default AdminProductForm;
