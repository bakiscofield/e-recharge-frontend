'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface MoneyAnimationProps {
  type?: 'rain' | 'sparkle' | 'flow' | 'pulse';
  color?: string;
  glow?: boolean;
  amount?: string;
}

export const MoneyAnimation: React.FC<MoneyAnimationProps> = ({
  type = 'pulse',
  color = '#ffd700',
  glow = true,
  amount,
}) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number }>>([]);

  useEffect(() => {
    if (type === 'rain') {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
      }));
      setParticles(newParticles);
    }
  }, [type]);

  if (type === 'rain') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute text-2xl"
            style={{
              left: `${particle.x}%`,
              color: color,
              filter: glow ? `drop-shadow(0 0 8px ${color})` : 'none',
            }}
            initial={{ y: '-10%', opacity: 0 }}
            animate={{
              y: '110%',
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'linear',
            }}
          >
            💰
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === 'sparkle') {
    return (
      <div className="relative inline-block">
        {amount && (
          <motion.span
            className="text-4xl font-bold"
            style={{
              color: color,
              textShadow: glow ? `0 0 20px ${color}` : 'none',
            }}
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            {amount}
          </motion.span>
        )}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: color,
              boxShadow: glow ? `0 0 10px ${color}` : 'none',
              left: '50%',
              top: '50%',
            }}
            animate={{
              x: [0, Math.cos((i * Math.PI * 2) / 8) * 40],
              y: [0, Math.sin((i * Math.PI * 2) / 8) * 40],
              opacity: [1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    );
  }

  if (type === 'flow') {
    return (
      <div className="relative inline-flex items-center gap-2">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="text-2xl"
            style={{
              color: color,
              filter: glow ? `drop-shadow(0 0 8px ${color})` : 'none',
            }}
            animate={{
              x: [-20, 20],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          >
            💰
          </motion.div>
        ))}
        {amount && (
          <span
            className="text-3xl font-bold ml-4"
            style={{
              color: color,
              textShadow: glow ? `0 0 20px ${color}` : 'none',
            }}
          >
            {amount}
          </span>
        )}
      </div>
    );
  }

  // Default: pulse
  return (
    <motion.div
      className="inline-flex items-center gap-3"
      animate={{
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
      }}
    >
      <motion.div
        className="text-3xl"
        animate={{
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        style={{
          filter: glow ? `drop-shadow(0 0 10px ${color})` : 'none',
        }}
      >
        💰
      </motion.div>
      {amount && (
        <span
          className="text-4xl font-bold"
          style={{
            color: color,
            textShadow: glow ? `0 0 20px ${color}` : 'none',
          }}
        >
          {amount}
        </span>
      )}
    </motion.div>
  );
};
