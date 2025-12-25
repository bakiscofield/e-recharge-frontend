'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Symbol {
  id: number;
  icon: string;
  x: number;
  duration: number;
  delay: number;
  size: number;
  opacity: number;
}

const SYMBOLS = [
  '💰', // Argent
  '💵', // Billet
  '💴', // Yen
  '💶', // Euro
  '💷', // Livre
  '💸', // Argent volant
  '🎰', // Machine à sous
  '🎲', // Dé
  '⚽', // Football
  '🏀', // Basketball
  '🎯', // Cible
  '🏆', // Trophée
  '💎', // Diamant
  '⭐', // Étoile
  '✨', // Étincelles
];

export default function FallingSymbols() {
  const [symbols, setSymbols] = useState<Symbol[]>([]);

  useEffect(() => {
    // Générer des symboles aléatoires
    const generateSymbols = () => {
      const newSymbols: Symbol[] = [];
      const count = 15; // Nombre de symboles à l'écran

      for (let i = 0; i < count; i++) {
        newSymbols.push({
          id: i,
          icon: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          x: Math.random() * 100, // Position X en pourcentage
          duration: 8 + Math.random() * 7, // Durée entre 8 et 15 secondes
          delay: Math.random() * 5, // Délai initial
          size: 20 + Math.random() * 30, // Taille entre 20 et 50px
          opacity: 0.1 + Math.random() * 0.15, // Opacité entre 0.1 et 0.25
        });
      }

      setSymbols(newSymbols);
    };

    generateSymbols();

    // Régénérer de nouveaux symboles périodiquement
    const interval = setInterval(() => {
      generateSymbols();
    }, 10000); // Toutes les 10 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {symbols.map((symbol) => (
        <motion.div
          key={`${symbol.id}-${symbol.icon}`}
          className="absolute"
          style={{
            left: `${symbol.x}%`,
            fontSize: `${symbol.size}px`,
            opacity: symbol.opacity,
          }}
          initial={{ y: -100, rotate: 0 }}
          animate={{
            y: '100vh',
            rotate: 360,
          }}
          transition={{
            duration: symbol.duration,
            delay: symbol.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {symbol.icon}
        </motion.div>
      ))}

      {/* Effet de gradient en bas pour fade out */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
}
