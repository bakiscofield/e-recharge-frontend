'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface NeonButtonProps {
  children: ReactNode;
  onClick?: () => void;
  color?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  onClick,
  color,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
}) => {
  const colors = {
    primary: color || '#00f0ff',
    secondary: color || '#ff00ff',
    success: color || '#00ff88',
    danger: color || '#ff0055',
  };

  const selectedColor = colors[variant];

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      className={`
        relative font-bold rounded-lg
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        overflow-hidden
      `}
      style={{
        color: '#ffffff',
        background: `linear-gradient(135deg, ${selectedColor}22 0%, ${selectedColor}44 100%)`,
        border: `2px solid ${selectedColor}`,
        boxShadow: `0 0 20px ${selectedColor}66, inset 0 0 20px ${selectedColor}22`,
      }}
      whileHover={
        !disabled
          ? {
              scale: 1.05,
              boxShadow: `0 0 30px ${selectedColor}99, inset 0 0 30px ${selectedColor}44`,
            }
          : {}
      }
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={!disabled && !loading ? onClick : undefined}
      disabled={disabled || loading}
    >
      <motion.div
        className="absolute inset-0 opacity-0"
        style={{
          background: `linear-gradient(135deg, ${selectedColor}66 0%, transparent 100%)`,
        }}
        whileHover={!disabled ? { opacity: 1 } : {}}
        transition={{ duration: 0.3 }}
      />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <motion.div
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        )}
        {children}
      </span>
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        style={{
          backgroundImage: `linear-gradient(45deg, ${selectedColor}44 25%, transparent 25%, transparent 75%, ${selectedColor}44 75%, ${selectedColor}44)`,
          backgroundSize: '20px 20px',
        }}
      />
    </motion.button>
  );
};
