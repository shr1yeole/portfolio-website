'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { cn } from '@/lib/utils';
import type { AdminProject } from '@/types/admin';

const GRAPHIC_CATEGORIES = ['Graphic Designs', 'Branding', 'Social Media Creatives', 'Posters', 'Logo Design', 'Photography'];

export function GraphicDesign({ projects }: { projects: AdminProject[] }) {
  const graphicItems = projects.filter(p => GRAPHIC_CATEGORIES.includes(p.category));
  const dynamicCategories = ['All', ...Array.from(new Set(graphicItems.map(p => p.category)))];

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const filteredItems = selectedCategory === 'All'
    ? graphicItems
    : graphicItems.filter((item) => item.category === selectedCategory);

  const openLightbox = (id: string) => {
    const idx = graphicItems.findIndex((item) => item.id === id);
    if (idx !== -1) {
      setActiveImageIndex(idx);
    }
  };

  const closeLightbox = () => {
    setActiveImageIndex(null);
  };

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeImageIndex !== null) {
      setActiveImageIndex((activeImageIndex + 1) % graphicItems.length);
    }
  };

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeImageIndex !== null) {
      setActiveImageIndex((activeImageIndex - 1 + graphicItems.length) % graphicItems.length);
    }
  };

  if (graphicItems.length === 0) return null;

  return (
    <section id="graphics" className="py-24 relative bg-background">
      <div className="absolute top-[30%] right-[-10%] w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Graphic Design Showcase" subtitle="Visual Art & Print" align="center" />

        {/* Filter Tabs */}
        <div className="flex justify-center mb-8 sm:mb-12 w-full overflow-hidden">
          <div className="w-full overflow-x-auto pb-4 -mb-4 snap-x hide-scrollbar">
            <div className="w-max mx-auto glass p-1.5 rounded-full flex flex-nowrap gap-1 border border-border-glow">
              {dynamicCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer whitespace-nowrap snap-center min-h-[44px]',
                    selectedCategory === cat
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

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => {
              const optimizedUrl = getOptimizedImageUrl(item.image || item.thumbnail, 600, 600);
              
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => openLightbox(item.id)}
                  className="relative group aspect-square rounded-2xl overflow-hidden cursor-pointer border border-white/10 shadow-lg"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={optimizedUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Glass Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/20">
                      <ZoomIn className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">
                      {item.category}
                    </span>
                    <h4 className="text-white font-bold text-lg leading-tight">
                      {item.title}
                    </h4>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md cursor-zoom-out"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 rounded-full bg-black/50 sm:bg-white/10 hover:bg-white/20 text-white border border-white/10 cursor-pointer z-50 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Lightbox Content Container */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center justify-center cursor-default px-2 sm:px-12"
            >
              {/* Previous Button */}
              <button
                onClick={showPrev}
                className="absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/50 sm:bg-white/10 hover:bg-white/20 text-white border border-white/15 cursor-pointer z-10 select-none text-lg font-bold min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                ‹
              </button>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={graphicItems[activeImageIndex].image || graphicItems[activeImageIndex].thumbnail}
                alt={graphicItems[activeImageIndex].title}
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl border border-white/10"
              />

              <div className="mt-4 text-center">
                <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                  {graphicItems[activeImageIndex].category}
                </span>
                <h3 className="text-white font-bold text-xl mt-1">
                  {graphicItems[activeImageIndex].title}
                </h3>
                {graphicItems[activeImageIndex].description && (
                  <p className="text-white/60 text-xs mt-1 max-w-md mx-auto">
                    {graphicItems[activeImageIndex].description}
                  </p>
                )}
              </div>

              {/* Next Button */}
              <button
                onClick={showNext}
                className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/50 sm:bg-white/10 hover:bg-white/20 text-white border border-white/15 cursor-pointer z-10 select-none text-lg font-bold min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                ›
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
export default GraphicDesign;
