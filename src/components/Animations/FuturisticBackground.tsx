'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface FuturisticBackgroundProps {
  type?: 'gradient' | 'particles' | 'matrix' | 'waves';
  primaryColor?: string;
  secondaryColor?: string;
  animationSpeed?: number;
}

export const FuturisticBackground: React.FC<FuturisticBackgroundProps> = ({
  type = 'gradient',
  primaryColor = '#00f0ff',
  secondaryColor = '#ff00ff',
  animationSpeed = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (type !== 'particles' && type !== 'matrix') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationFrameId: number;

    if (type === 'particles') {
      // Particles animation
      const particles: Array<{
        x: number;
        y: number;
        size: number;
        speedX: number;
        speedY: number;
        opacity: number;
      }> = [];

      for (let i = 0; i < 100; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * animationSpeed,
          speedY: (Math.random() - 0.5) * animationSpeed,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }

      const animate = () => {
        ctx.fillStyle = 'rgba(10, 10, 31, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle) => {
          particle.x += particle.speedX;
          particle.y += particle.speedY;

          if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
          if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 240, 255, ${particle.opacity})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = primaryColor;
          ctx.fill();
        });

        animationFrameId = requestAnimationFrame(animate);
      };

      animate();
    } else if (type === 'matrix') {
      // Matrix rain effect
      const fontSize = 14;
      const columns = canvas.width / fontSize;
      const drops: number[] = [];

      for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * canvas.height;
      }

      const animate = () => {
        ctx.fillStyle = 'rgba(10, 10, 31, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = primaryColor;
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
          const text = String.fromCharCode(0x30a0 + Math.random() * 96);
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);

          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }

          drops[i] += animationSpeed;
        }

        animationFrameId = requestAnimationFrame(animate);
      };

      animate();
    }

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [type, primaryColor, animationSpeed]);

  if (type === 'gradient') {
    return (
      <motion.div
        className="fixed inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background: `radial-gradient(circle at 20% 50%, ${primaryColor}22 0%, transparent 50%),
                         radial-gradient(circle at 80% 80%, ${secondaryColor}22 0%, transparent 50%),
                         linear-gradient(135deg, #0a0a1f 0%, #1a1a3f 100%)`,
          }}
        />
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20 / animationSpeed,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            backgroundImage: `radial-gradient(circle, ${primaryColor}33 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </motion.div>
    );
  }

  if (type === 'waves') {
    return (
      <div className="fixed inset-0 -z-10 bg-[#0a0a1f] overflow-hidden">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 opacity-20"
            animate={{
              y: ['-100%', '100%'],
            }}
            transition={{
              duration: (10 + i * 5) / animationSpeed,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              background: `linear-gradient(180deg, transparent 0%, ${primaryColor}44 50%, transparent 100%)`,
              height: '200%',
            }}
          />
        ))}
      </div>
    );
  }

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />;
};
