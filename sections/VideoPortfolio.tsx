'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { VideoPlayer } from '@/components/ui/VideoPlayer';

import type { AdminProject } from '@/types/admin';

const VIDEO_CATEGORIES = ['Video Editing', 'Meta Ads', 'Google Ads'];

export function VideoPortfolio({ projects }: { projects: AdminProject[] }) {
  const videoItems = projects.filter(p => VIDEO_CATEGORIES.includes(p.category));

  if (videoItems.length === 0) return null;
  return (
    <section id="videos" className="py-24 relative bg-background">
      <div className="absolute top-[30%] right-[-10%] w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Video Editing Reel" subtitle="Video Portfolio" align="center" />

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {videoItems.map((video) => (
            <Card key={video.id} className="p-0 border border-white/10 flex flex-col h-full overflow-hidden">
              
              {/* Interactive Player */}
              <div className="relative">
                <VideoPlayer
                  src={video.videoUrl || ''}
                  poster={video.thumbnail}
                  autoplayOnHover={false}
                  className="rounded-t-2xl rounded-b-none"
                />
              </div>

              {/* Text Meta Info */}
              <div className="p-4 flex flex-col flex-grow space-y-1.5">
                <span className="text-[9px] font-bold text-secondary uppercase tracking-widest">
                  {video.category}
                </span>
                <h3 className="text-base font-bold tracking-tight text-gradient leading-snug">
                  {video.title}
                </h3>
                <p className="text-foreground/75 text-xs leading-relaxed line-clamp-3">
                  {video.description}
                </p>
              </div>

            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
export default VideoPortfolio;
