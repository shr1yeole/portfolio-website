'use client';

import React from 'react';
import { BRANDS } from '@/data/portfolio';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function Brands() {
  // Triple the list for a seamless infinite loop
  const brandsLoop = [...BRANDS, ...BRANDS, ...BRANDS];

  return (
    <section id="brands" className="py-20 relative bg-background/50 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Clients & Brands"
          subtitle="Trusted By"
          align="center"
        />

        {/* Scrolling container */}
        <div className="relative w-full flex items-center justify-center py-6">
          {/* Edge gradient masks */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          {/* Scrolling track */}
          <div className="flex w-full overflow-hidden">
            <div className="flex items-center space-x-10 animate-marquee py-4 shrink-0">
              {brandsLoop.map((brand, index) => (
                <div
                  key={`${brand.name}-${index}`}
                  className="flex flex-col items-center justify-center text-center transition-all duration-300 hover:opacity-100 opacity-50 shrink-0"
                >
                  {brand.logoUrl ? (
                    // If logo URL is provided, render the image
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={brand.logoUrl}
                      alt={`${brand.name} logo`}
                      className="h-10 md:h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                      loading="lazy"
                    />
                  ) : (
                    // Text fallback when logo is not yet uploaded
                    <span className="text-sm md:text-base font-bold tracking-wider uppercase text-foreground/60 hover:text-foreground px-6 py-2 glass rounded-full border border-border-glow whitespace-nowrap">
                      {brand.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Brands;
