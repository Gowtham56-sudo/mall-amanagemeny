import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const LiveBackground: React.FC = () => {
  const [particles, setParticles] = useState<Array<{ id: number, x: number, y: number, size: number, duration: number, delay: number }>>([]);

  useEffect(() => {
    // Generate 40 random floating particles
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-zinc-950">
      {/* Deep Premium Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-zinc-950 to-zinc-950" />
      
      {/* Live Particles / Floating Orbs */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-blue-400/40 shadow-[0_0_12px_rgba(96,165,250,0.6)]"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -800], // move upwards
            x: [0, (Math.random() - 0.5) * 200], // sway sideways
            opacity: [0, 1, 0], // fade in and out
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
        />
      ))}

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 mix-blend-overlay" />

      {/* Dynamic Aurora Waves / Ambient Glow */}
      <div className="absolute top-[-20%] -left-[10%] w-[50vw] h-[50vw] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-50 animate-blob" />
      <div className="absolute top-[-20%] -right-[10%] w-[50vw] h-[50vw] bg-cyan-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-50 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-50 animate-blob animation-delay-4000" />
    </div>
  );
};
