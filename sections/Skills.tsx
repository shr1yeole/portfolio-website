'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SKILLS } from '@/data/portfolio';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/utils';

const CATEGORIES: ('Development' | 'Creative' | 'Marketing' | 'Tools')[] = [
  'Development',
  'Creative',
  'Marketing',
  'Tools',
];

export function Skills() {
  const [activeCategory, setActiveCategory] = useState<'Development' | 'Creative' | 'Marketing' | 'Tools'>('Development');

  const filteredSkills = SKILLS.filter((skill) => skill.category === activeCategory);

  return (
    <section id="skills" className="py-24 relative">
      <div className="absolute top-[20%] left-[-10%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="My Skill Set" subtitle="What I Bring to the Table" align="center" />

        {/* Tab Controls */}
        <div className="flex justify-center mb-8 sm:mb-12 w-full overflow-hidden">
          <div className="w-full overflow-x-auto pb-4 -mb-4 snap-x hide-scrollbar">
            <div className="w-max mx-auto glass p-1.5 rounded-full flex flex-nowrap gap-1 border border-border-glow">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer whitespace-nowrap snap-center min-h-[44px]',
                    activeCategory === cat
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                      : 'text-foreground/70 hover:text-foreground'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Skill Bars */}
        <motion.div
          layout
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 gap-3 sm:gap-6"
        >
          {filteredSkills.map((skill, index) => (
            <Card key={skill.name} hoverGlow={false} className="p-3 sm:p-6 flex flex-col justify-center">
              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <span className="font-semibold text-xs sm:text-sm tracking-wide truncate pr-2">{skill.name}</span>
                <span className="text-[10px] sm:text-xs font-bold text-secondary">{skill.level}%</span>
              </div>

              {/* Progress track */}
              <div className="h-2 w-full bg-foreground/10 dark:bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: index * 0.05, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                />
              </div>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
export default Skills;
