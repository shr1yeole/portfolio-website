import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-primary/20 bg-primary/5 text-primary backdrop-blur-sm',
        className
      )}
    >
      {children}
    </span>
  );
}
export default Badge;
