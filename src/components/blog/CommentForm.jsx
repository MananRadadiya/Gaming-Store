import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

const CommentForm = ({ onSubmit, placeholder = 'Write a comment...', compact = false }) => {
  const [content, setContent] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content.trim());
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        className={`relative rounded-xl border transition-all duration-300 ${
          focused
            ? 'border-[#00E0FF]/30 bg-white/[0.03] shadow-[0_0_15px_rgba(0,224,255,0.06)]'
            : 'border-white/[0.06] bg-white/[0.02]'
        }`}
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          rows={compact ? 2 : 3}
          className={`w-full bg-transparent text-sm text-white/70 placeholder-white/15 outline-none resize-none ${
            compact ? 'px-3 py-2.5' : 'px-4 py-3'
          }`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              handleSubmit(e);
            }
          }}
        />

        <div className={`flex items-center justify-between ${compact ? 'px-3 pb-2' : 'px-4 pb-3'}`}>
          <span className="text-[10px] text-white/10">
            Ctrl+Enter to send
          </span>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!content.trim()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              content.trim()
                ? 'bg-[#00E0FF]/10 border border-[#00E0FF]/20 text-[#00E0FF] hover:bg-[#00E0FF]/20'
                : 'bg-white/[0.02] border border-white/[0.04] text-white/15 cursor-not-allowed'
            }`}
          >
            <Send size={11} />
            {compact ? 'Reply' : 'Comment'}
          </motion.button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
