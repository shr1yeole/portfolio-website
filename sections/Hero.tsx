'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Code, Palette, Video, Film } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const ROLES = [
  { text: 'Creative Developer',    icon: Code,    color: 'text-indigo-400' },
  { text: 'Graphic Designer',      icon: Palette, color: 'text-pink-400' },
  { text: 'Motion Graphics Artist', icon: Film,   color: 'text-purple-400' },
  { text: 'Video Editor',          icon: Video,   color: 'text-cyan-400' },
];

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = ROLES[roleIndex].icon;

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden pt-20"
    >
      {/* Decorative Floating Background Orbs — hidden on very small screens */}
      <div className="hidden sm:block absolute top-[20%] left-[15%] w-48 sm:w-72 h-48 sm:h-72 rounded-full bg-primary/10 blur-[100px] animate-pulse-slow" />
      <div className="hidden sm:block absolute bottom-[20%] right-[15%] w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-secondary/10 blur-[120px] animate-pulse-slow" />

      {/* Floating geometric elements — hidden on mobile to prevent overflow */}
      <div className="hidden md:block absolute top-[30%] right-[25%] animate-float pointer-events-none opacity-20 dark:opacity-30">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary rotate-12 blur-sm" />
      </div>
      <div className="hidden md:block absolute bottom-[30%] left-[20%] animate-float pointer-events-none opacity-20 dark:opacity-30" style={{ animationDelay: '2s' }}>
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-secondary to-cyan-500 -rotate-45 blur-sm" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center z-10 w-full">
        {/* Tagline badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] sm:text-xs uppercase tracking-widest font-bold mb-5 sm:mb-6 backdrop-blur-sm max-w-[90vw] text-center"
        >
          <span className="leading-snug">Building Digital Experiences Through Creativity &amp; Technology</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-8xl font-extrabold tracking-tight mb-5 sm:mb-6 leading-tight"
        >
          Hi, I&apos;m <span className="text-gradient">Shravan Yeole</span>
        </motion.h1>

        {/* Animating Roles — tighter on mobile */}
        <div className="h-10 sm:h-16 flex items-center justify-center mb-8 sm:mb-10 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={roleIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="flex items-center space-x-2 sm:space-x-3 text-lg sm:text-3xl font-semibold text-foreground/80"
            >
              <CurrentIcon className={`w-5 h-5 sm:w-8 sm:h-8 shrink-0 ${ROLES[roleIndex].color}`} />
              <span className={ROLES[roleIndex].color}>{ROLES[roleIndex].text}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <Button variant="primary" size="lg" className="w-full sm:w-auto min-h-[44px]">
            <a href="#contact" className="w-full h-full block">Let&apos;s Work Together</a>
          </Button>
          <Button variant="secondary" size="lg" className="w-full sm:w-auto min-h-[44px]">
            <a href="#featured" className="w-full h-full block">View My Work</a>
          </Button>
        </motion.div>
      </div>

      {/* Down arrow indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer"
      >
        <a href="#about" aria-label="Scroll down">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="p-2 rounded-full border border-foreground/10 hover:border-foreground/30 glass transition-colors"
          >
            <ArrowDown className="w-5 h-5 text-foreground/60" />
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
}
export default Hero;
