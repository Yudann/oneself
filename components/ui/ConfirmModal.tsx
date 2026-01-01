"use client";

import React, { useEffect, useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger'
}) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAnimate(true);
    } else {
      setTimeout(() => setAnimate(false), 200);
    }
  }, [isOpen]);

  if (!isOpen && !animate) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className={`
          relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 
          w-full max-w-[400px] rounded-3xl p-6 shadow-2xl transform transition-all duration-300
          ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
        `}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${variant === 'danger' ? 'bg-rose-50 text-rose-500 dark:bg-rose-900/20 dark:text-rose-400' : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800'}`}>
              <AlertTriangle size={24} />
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              {title}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`
                flex-1 py-3 px-4 rounded-xl font-semibold text-sm text-white shadow-lg shadow-rose-200 dark:shadow-rose-900/20 transition-all hover:scale-[1.02] active:scale-98
                ${variant === 'danger' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900'}
              `}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
