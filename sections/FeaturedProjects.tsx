'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import type { AdminProject } from '@/types/admin';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

export function FeaturedProjects({ projects }: { projects: AdminProject[] }) {
  const featured = projects.filter((project) => project.featured);

  const displayFeatured = featured.length > 0 ? featured : [
    { id: 'demo-feat-1', title: 'Award-Winning Web App', category: 'Websites', description: 'A massive web application that scaled to 1M users.', technologies: ['React', 'Node.js', 'AWS'], thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop', image: '', liveUrl: '#', githubUrl: '#', status: 'Published' as const, displayOrder: 0, featured: true, createdAt: '', updatedAt: '' },
    { id: 'demo-feat-2', title: 'Global Brand Identity', category: 'Branding', description: 'Complete rebrand for an international tech firm.', technologies: ['Illustrator', 'Photoshop'], thumbnail: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=500&fit=crop', image: '', liveUrl: '#', githubUrl: '', status: 'Published' as const, displayOrder: 1, featured: true, createdAt: '', updatedAt: '' },
    { id: 'demo-feat-3', title: 'Festival Aftermovie', category: 'Video Editing', description: 'High-energy edit of a 3-day music festival.', technologies: ['Premiere Pro', 'DaVinci Resolve'], thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=500&fit=crop', image: '', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', liveUrl: '', githubUrl: '', status: 'Published' as const, displayOrder: 2, featured: true, createdAt: '', updatedAt: '' },
    { id: 'demo-feat-4', title: 'Mobile Banking App', category: 'Flutter Projects', description: 'Secure fintech application with complex animations.', technologies: ['Flutter', 'Firebase'], thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop', image: '', githubUrl: '#', liveUrl: '', status: 'Published' as const, displayOrder: 3, featured: true, createdAt: '', updatedAt: '' },
    { id: 'demo-feat-5', title: '3D Product Launch', category: 'Motion Graphics', description: 'Product launch video entirely made in 3D.', technologies: ['Cinema4D', 'Octane'], thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=500&fit=crop', image: '', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', liveUrl: '', githubUrl: '', status: 'Published' as const, displayOrder: 4, featured: true, createdAt: '', updatedAt: '' },
  ];

  return (
    <section id="featured" className="py-24 relative overflow-hidden">
      <div className="absolute top-[40%] right-[-10%] w-[350px] h-[350px] bg-secondary/5 rounded-full blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Featured Work" subtitle="Selected Projects" align="center" />

        <div className="grid grid-cols-1 gap-12">
          {displayFeatured.map((project, index) => {
            const isEven = index % 2 === 0;
            const optimizedThumbnail = getOptimizedImageUrl(project.thumbnail, 800, 500);

            return (
              <Card
                key={project.id}
                hoverGlow={true}
                className="p-0 border border-white/10 overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Thumbnail Column */}
                  <div
                    className={`lg:col-span-7 aspect-video relative overflow-hidden ${
                      isEven ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={optimizedThumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Project Details Column */}
                  <div
                    className={`lg:col-span-5 p-5 sm:p-8 flex flex-col justify-center space-y-3 sm:space-y-4 ${
                      isEven ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >
                    <span className="text-xs font-bold text-secondary uppercase tracking-widest">
                      {project.category}
                    </span>
                    <h3 className="text-2xl font-bold tracking-tight text-gradient">
                      {project.title}
                    </h3>
                    <p className="text-foreground/70 text-sm leading-relaxed">
                      {project.description}
                    </p>

                    {/* Technologies list */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.technologies.map((tech) => (
                        <Badge key={tech}>{tech}</Badge>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex items-center space-x-4 pt-4">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-xs font-bold tracking-wider uppercase text-primary hover:text-secondary transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Live Demo</span>
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-xs font-bold tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors"
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          <span>Code Repository</span>
                        </a>
                      )}
                    </div>
                  </div>


                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export default FeaturedProjects;
