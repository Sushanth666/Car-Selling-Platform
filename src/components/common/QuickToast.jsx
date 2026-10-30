import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

export default function QuickToast({ message, onClose }) {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ type: "spring", damping: 22, stiffness: 320 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="glass-panel-gold rounded-2xl px-5 py-3.5 border border-gold-400/40 shadow-2xl flex items-center gap-3 text-xs text-white">
        <Sparkles className="w-4 h-4 text-gold-400 flex-shrink-0 animate-spin" />
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white ml-2 text-xs cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
