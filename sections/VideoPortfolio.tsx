'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { VideoPlayer } from '@/components/ui/VideoPlayer';

import type { AdminProject } from '@/types/admin';

const VIDEO_CATEGORIES = ['Video Editing', 'Meta Ads', 'Google Ads'];

export function VideoPortfolio({ projects }: { projects: AdminProject[] }) {
  const videoItems = projects.filter(p => VIDEO_CATEGORIES.includes(p.category));

  const displayVideoItems = videoItems.length > 0 ? videoItems : [
    { id: 'demo-vid-1', title: 'Travel Vlog Edit', category: 'Video Editing', description: 'Cinematic travel compilation.', technologies: ['Premiere Pro'], thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&h=380&fit=crop', image: '', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'Published' as const, displayOrder: 0, featured: false, createdAt: '', updatedAt: '' },
    { id: 'demo-vid-2', title: 'E-commerce Meta Ad', category: 'Meta Ads', description: 'High-converting UGC video ad.', technologies: ['CapCut'], thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=380&fit=crop', image: '', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'Published' as const, displayOrder: 1, featured: false, createdAt: '', updatedAt: '' },
    { id: 'demo-vid-3', title: 'YouTube Documentary', category: 'Video Editing', description: '20-minute long-form content edit.', technologies: ['DaVinci Resolve'], thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&h=380&fit=crop', image: '', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'Published' as const, displayOrder: 2, featured: false, createdAt: '', updatedAt: '' },
    { id: 'demo-vid-4', title: 'Real Estate Tour', category: 'Video Editing', description: 'Drone and interior shots combined.', technologies: ['Premiere Pro'], thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=380&fit=crop', image: '', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'Published' as const, displayOrder: 3, featured: false, createdAt: '', updatedAt: '' },
    { id: 'demo-vid-5', title: 'Google Ads Bumper', category: 'Google Ads', description: '6-second unskippable ad.', technologies: ['After Effects'], thumbnail: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=600&h=380&fit=crop', image: '', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'Published' as const, displayOrder: 4, featured: false, createdAt: '', updatedAt: '' },
  ];

  return (
    <section id="videos" className="py-24 relative">
      <div className="absolute top-[30%] right-[-10%] w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Video Editing Reel" subtitle="Video Portfolio" align="center" />

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {displayVideoItems.map((video) => (
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
