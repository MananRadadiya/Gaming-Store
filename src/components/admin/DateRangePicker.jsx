import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronDown } from 'lucide-react';

const PRESETS = [
  { key: '7d', label: 'Last 7 Days' },
  { key: '30d', label: 'Last 30 Days' },
  { key: '90d', label: 'Last 90 Days' },
  { key: '12m', label: 'Last 12 Months' },
  { key: 'ytd', label: 'Year to Date' },
  { key: 'all', label: 'All Time' },
];

const DateRangePicker = ({ value = '30d', onChange }) => {
  const [open, setOpen] = useState(false);

  const selected = PRESETS.find((p) => p.key === value) || PRESETS[1];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-neutral-300 hover:border-white/[0.15] hover:text-white transition-all"
      >
        <Calendar size={14} className="text-[#00E0FF]" />
        <span>{selected.label}</span>
        <ChevronDown size={12} className={`text-neutral-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-48 bg-[#0d0d0d] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {PRESETS.map((preset) => (
              <button
                key={preset.key}
                onClick={() => {
                  onChange?.(preset.key);
                  setOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-xs font-medium transition-all ${
                  value === preset.key
                    ? 'text-[#00FF88] bg-[#00FF88]/10'
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default DateRangePicker;
