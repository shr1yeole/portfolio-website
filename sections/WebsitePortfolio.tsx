'use client';

import { ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

import type { AdminProject } from '@/types/admin';

const NON_WEB_CATEGORIES = [
  'Graphic Designs', 'Branding', 'Social Media Creatives', 'Posters', 'Logo Design', 'Photography',
  'Motion Graphics', 'Video Editing', 'Meta Ads', 'Google Ads'
];

export function WebsitePortfolio({ projects }: { projects: AdminProject[] }) {
  const webProjects = projects.filter(p => !NON_WEB_CATEGORIES.includes(p.category));

  const displayProjects = webProjects.length > 0 ? webProjects : [
    { id: 'demo-web-1', title: 'E-Commerce Platform', category: 'Websites', description: 'A modern e-commerce solution with cart and checkout.', technologies: ['React', 'Next.js'], thumbnail: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=600&h=380&fit=crop', image: '', githubUrl: '#', liveUrl: '#', status: 'Published' as const, displayOrder: 0, featured: false, createdAt: '', updatedAt: '' },
    { id: 'demo-web-2', title: 'SaaS Dashboard', category: 'Full Stack Projects', description: 'Analytics dashboard with real-time data visualization.', technologies: ['React', 'Tailwind'], thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=380&fit=crop', image: '', githubUrl: '#', liveUrl: '#', status: 'Published' as const, displayOrder: 1, featured: false, createdAt: '', updatedAt: '' },
    { id: 'demo-web-3', title: 'Restaurant App', category: 'Flutter Projects', description: 'Cross-platform mobile app for food ordering.', technologies: ['Flutter', 'Firebase'], thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=380&fit=crop', image: '', githubUrl: '#', liveUrl: '#', status: 'Published' as const, displayOrder: 2, featured: false, createdAt: '', updatedAt: '' },
    { id: 'demo-web-4', title: 'Corporate Blog', category: 'WordPress Websites', description: 'SEO-optimized blog for a marketing agency.', technologies: ['WordPress', 'PHP'], thumbnail: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=600&h=380&fit=crop', image: '', githubUrl: '#', liveUrl: '#', status: 'Published' as const, displayOrder: 3, featured: false, createdAt: '', updatedAt: '' },
    { id: 'demo-web-5', title: 'Inventory System', category: 'Java Projects', description: 'Desktop application for warehouse management.', technologies: ['Java', 'MySQL'], thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c50800?w=600&h=380&fit=crop', image: '', githubUrl: '#', liveUrl: '#', status: 'Published' as const, displayOrder: 4, featured: false, createdAt: '', updatedAt: '' },
  ];

  return (
    <section id="websites" className="py-24 relative">
      <div className="absolute top-[20%] left-[-10%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Web Application Portfolio" subtitle="Websites & Apps" align="center" />

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {displayProjects.map((project) => {
            const optimizedThumbnail = getOptimizedImageUrl(project.thumbnail, 600, 380);

            return (
              <Card key={project.id} className="p-0 flex flex-col h-full border border-white/10">
                {/* Thumbnail header */}
                <div className="aspect-video relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={optimizedThumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase font-bold text-white tracking-widest border border-white/10">
                    {project.category}
                  </div>
                </div>

                {/* Content body */}
                <div className="p-4 sm:p-6 flex flex-col flex-grow space-y-4">
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-gradient">
                    {project.title}
                  </h3>
                  <p className="text-foreground/70 text-xs sm:text-sm leading-relaxed flex-grow">
                    {project.description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <Badge key={tech} className="text-[10px] px-2 py-0.5">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  {/* Footer Links */}
                  <div className="flex items-center justify-between pt-4 border-t border-border-glow">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-[11px] font-bold uppercase tracking-wider text-foreground/75 hover:text-foreground transition-colors"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span>Source Code</span>
                      </a>
                    )}

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-[11px] font-bold uppercase tracking-wider text-primary hover:text-secondary transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Site</span>
                      </a>
                    )}
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
export default WebsitePortfolio;
