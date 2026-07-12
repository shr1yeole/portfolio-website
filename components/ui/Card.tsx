'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLMotionProps<'div'> {
  hoverGlow?: boolean;
}


export function Card({ className, children, hoverGlow = true, ...props }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={hoverGlow ? { y: -6, boxShadow: '0 12px 40px 0 rgba(139, 92, 246, 0.12)' } : undefined}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'glass glass-glow rounded-3xl overflow-hidden p-6 transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
export default Card;
