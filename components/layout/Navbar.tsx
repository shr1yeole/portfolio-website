'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useActiveSection } from '@/hooks/useActiveSection';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '../ui/ThemeToggle';

const NAV_ITEMS = [
  { label: 'Hero',     href: '#hero' },
  { label: 'About',   href: '#about' },
  { label: 'Skills',  href: '#skills' },
  { label: 'Featured', href: '#featured' },
  { label: 'Websites', href: '#websites' },
  { label: 'Graphics', href: '#graphics' },
  { label: 'Motion',  href: '#motion' },
  { label: 'Videos',  href: '#videos' },
  { label: 'Brands',  href: '#brands' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const scrollCompletion = useScrollProgress();
  const activeSection = useActiveSection(
    NAV_ITEMS.map((item) => item.href.substring(1)),
    0.2
  );
  const drawerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    return () => document.body.classList.remove('menu-open');
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Scroll Progress Indicator Bar */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-white/10 z-55">
        <div
          className="h-full bg-gradient-to-r from-primary via-secondary to-primary transition-all duration-100"
          style={{ width: `${scrollCompletion}%` }}
        />
      </div>

      {/* Main Glass Nav */}
      <div className="mx-auto max-w-7xl px-3 sm:px-4 sm:px-6 lg:px-8 mt-3 sm:mt-4">
        <nav className="glass rounded-full px-4 sm:px-6 py-3 flex items-center justify-between shadow-lg shadow-black/5 dark:shadow-black/20 border border-border-glow">
          {/* Logo / Name */}
          <a
            href="#hero"
            className="flex items-center space-x-2 font-bold text-base sm:text-lg tracking-wider text-gradient select-none cursor-pointer"
          >
            <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <span>SHRAVAN.DEV</span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {NAV_ITEMS.map((item) => {
              const isSectionActive = activeSection === item.href.substring(1);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors duration-300 cursor-pointer',
                    isSectionActive ? 'text-primary' : 'text-foreground/75 hover:text-foreground'
                  )}
                >
                  {isSectionActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-primary/10 rounded-full z-[-1]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* Theme & Menu Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <ThemeToggle />

            {/* Mobile Hamburger Toggle — 44px touch target */}
            <button
              onClick={toggleMenu}
              className="lg:hidden w-11 h-11 rounded-full flex items-center justify-center cursor-pointer glass hover:bg-foreground/5 border border-border-glow text-foreground transition-colors"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile — Full-screen backdrop + Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dimmed backdrop — click to close */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={closeMenu}
              aria-hidden="true"
            />

            {/* Slide-in Drawer */}
            <motion.div
              key="drawer"
              ref={drawerRef}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed inset-x-3 sm:inset-x-4 top-[68px] sm:top-[76px] z-40 lg:hidden"
            >
              <div className="glass rounded-3xl p-4 sm:p-6 shadow-2xl border border-border-glow flex flex-col gap-1">
                {NAV_ITEMS.map((item, idx) => {
                  const isSectionActive = activeSection === item.href.substring(1);
                  return (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.025 }}
                      className={cn(
                        // Minimum 44px touch target
                        'min-h-[44px] px-4 py-3 rounded-xl text-sm font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center',
                        isSectionActive
                          ? 'bg-primary/15 text-primary border-l-4 border-primary pl-3'
                          : 'text-foreground/75 hover:bg-foreground/5 hover:text-foreground'
                      )}
                    >
                      {item.label}
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
export default Navbar;
