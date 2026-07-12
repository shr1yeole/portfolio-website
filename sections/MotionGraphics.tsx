'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { VideoPlayer } from '@/components/ui/VideoPlayer';

import type { AdminProject } from '@/types/admin';

export function MotionGraphics({ projects }: { projects: AdminProject[] }) {
  const motionItems = projects.filter(p => p.category === 'Motion Graphics');
  
  const displayMotionItems = motionItems.length > 0 ? motionItems : [
    { id: 'demo-mg-1', title: 'Kinetic Typography', category: 'Motion Graphics', description: 'Fast-paced text animation.', technologies: ['After Effects'], thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=380&fit=crop', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'Published', displayOrder: 0, featured: false } as AdminProject,
    { id: 'demo-mg-2', title: '3D Product Reveal', category: 'Motion Graphics', description: 'Cinema4D product render.', technologies: ['Cinema4D', 'Redshift'], thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=380&fit=crop', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'Published', displayOrder: 1, featured: false } as AdminProject,
    { id: 'demo-mg-3', title: 'Logo Animation', category: 'Motion Graphics', description: 'Dynamic brand intro.', technologies: ['After Effects'], thumbnail: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&h=380&fit=crop', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'Published', displayOrder: 2, featured: false } as AdminProject,
    { id: 'demo-mg-4', title: 'Explainer Video', category: 'Motion Graphics', description: 'Character animation for SaaS.', technologies: ['Illustrator', 'AE'], thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&h=380&fit=crop', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'Published', displayOrder: 3, featured: false } as AdminProject,
    { id: 'demo-mg-5', title: 'UI Interaction Reel', category: 'Motion Graphics', description: 'Prototyping complex UI interactions.', technologies: ['Figma', 'Protopie'], thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=380&fit=crop', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'Published', displayOrder: 4, featured: false } as AdminProject,
  ];

  return (
    <section id="motion" className="py-24 relative">
      <div className="absolute top-[20%] left-[-10%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Motion Design & 3D" subtitle="Motion Graphics" align="center" />

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {displayMotionItems.map((item) => (
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
