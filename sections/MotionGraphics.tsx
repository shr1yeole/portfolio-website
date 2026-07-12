'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { VideoPlayer } from '@/components/ui/VideoPlayer';

import type { AdminProject } from '@/types/admin';

export function MotionGraphics({ projects }: { projects: AdminProject[] }) {
  const motionItems = projects.filter(p => p.category === 'Motion Graphics');

  if (motionItems.length === 0) return null;
  return (
    <section id="motion" className="py-24 relative bg-background/50">
      <div className="absolute top-[20%] left-[-10%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Motion Design & 3D" subtitle="Motion Graphics" align="center" />

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {motionItems.map((item) => (
            <Card key={item.id} className="p-0 border border-white/10 flex flex-col h-full overflow-hidden">
              
              {/* Video Player wrapper (Autoplays on Hover, muted) */}
              <div className="relative">
                <VideoPlayer
                  src={item.videoUrl || ''}
                  poster={item.thumbnail}
                  autoplayOnHover={true}
                  className="rounded-t-2xl rounded-b-none"
                />
              </div>

              {/* Content Info */}
              <div className="p-4 sm:p-6 flex flex-col flex-grow space-y-3">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-gradient">
                  {item.title}
                </h3>
                <p className="text-foreground/70 text-xs sm:text-sm leading-relaxed flex-grow line-clamp-3 sm:line-clamp-none">
                  {item.description}
                </p>

                {/* Software tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {item.technologies.map((tech) => (
                    <Badge key={tech} className="text-[10px] bg-secondary/5 text-secondary border-secondary/20">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
export default MotionGraphics;
