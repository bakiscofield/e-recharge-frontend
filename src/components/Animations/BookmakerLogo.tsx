'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface BookmakerLogoProps {
  src: string;
  alt: string;
  animationType?: 'pulse' | 'rotate' | 'glow' | 'float';
  glowColor?: string;
  size?: number;
  onClick?: () => void;
}

export const BookmakerLogo: React.FC<BookmakerLogoProps> = ({
  src,
  alt,
  animationType = 'pulse',
  glowColor = '#00f0ff',
  size = 80,
  onClick,
}) => {
  const animations = {
    pulse: {
      animate: {
        scale: [1, 1.1, 1],
        filter: [
          `drop-shadow(0 0 10px ${glowColor})`,
          `drop-shadow(0 0 20px ${glowColor})`,
          `drop-shadow(0 0 10px ${glowColor})`,
        ],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
    rotate: {
      animate: {
        rotate: [0, 360],
      },
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: 'linear',
      },
    },
    glow: {
      animate: {
        filter: [
          `drop-shadow(0 0 5px ${glowColor})`,
          `drop-shadow(0 0 25px ${glowColor})`,
          `drop-shadow(0 0 5px ${glowColor})`,
        ],
      },
      transition: {
        duration: 3,
        repeat: Infinity,
      },
    },
    float: {
      animate: {
        y: [0, -10, 0],
        rotate: [-5, 5, -5],
      },
      transition: {
        duration: 4,
        repeat: Infinity,
      },
    },
  };

  const animation = animations[animationType];

  return (
    <motion.div
      className="relative cursor-pointer"
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      {...animation}
    >
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-50"
        style={{
          background: glowColor,
        }}
      />
      <div className="relative">
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          className="rounded-lg"
          style={{
            filter: `drop-shadow(0 0 15px ${glowColor}66)`,
          }}
        />
      </div>
    </motion.div>
  );
};
