'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlowingCardProps {
  children: ReactNode;
  glowColor?: string;
  glowIntensity?: number;
  className?: string;
  onClick?: () => void;
}

export const GlowingCard: React.FC<GlowingCardProps> = ({
  children,
  glowColor = '#00f0ff',
  glowIntensity = 0.8,
  className = '',
  onClick,
}) => {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div
        className="absolute inset-0 rounded-lg blur-xl opacity-50"
        style={{
          background: glowColor,
          opacity: glowIntensity * 0.5,
        }}
      />
      <div
        className="relative bg-gradient-to-br from-[#1a1a3f] to-[#0a0a1f] rounded-lg border"
        style={{
          borderColor: `${glowColor}66`,
          boxShadow: `0 0 20px ${glowColor}${Math.round(glowIntensity * 128).toString(16)}`,
        }}
      >
        {children}
      </div>
    </motion.div>
  );
};
