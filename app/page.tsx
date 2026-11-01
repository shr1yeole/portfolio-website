'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CinematicIntro } from '@/components/ui/CinematicIntro';
import { getClientCollection } from '@/lib/firestore-client';
import type { AdminProject } from '@/types/admin';

// Dynamically import all sections with loading skeletons
const Hero = dynamic(() => import('@/sections/Hero'), {
  loading: () => <SectionSkeleton />,
});
const About = dynamic(() => import('@/sections/About'), {
  loading: () => <SectionSkeleton />,
});
const Skills = dynamic(() => import('@/sections/Skills'), {
  loading: () => <SectionSkeleton />,
});
const FeaturedProjects = dynamic(() => import('@/sections/FeaturedProjects'), {
  loading: () => <SectionSkeleton />,
});
const WebsitePortfolio = dynamic(() => import('@/sections/WebsitePortfolio'), {
  loading: () => <SectionSkeleton />,
});
const GraphicDesign = dynamic(() => import('@/sections/GraphicDesign'), {
  loading: () => <SectionSkeleton />,
});
const MotionGraphics = dynamic(() => import('@/sections/MotionGraphics'), {
  loading: () => <SectionSkeleton />,
});
const VideoPortfolio = dynamic(() => import('@/sections/VideoPortfolio'), {
  loading: () => <SectionSkeleton />,
});
const Brands = dynamic(() => import('@/sections/Brands'), {
  loading: () => <SectionSkeleton />,
});
const Contact = dynamic(() => import('@/sections/Contact'), {
  loading: () => <SectionSkeleton />,
});

// An animated section loader skeleton
function SectionSkeleton() {
  return (
    <div className="py-24 flex flex-col items-center justify-center space-y-4 min-h-[400px]">
      <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      <span className="text-xs font-medium tracking-widest text-foreground/45 uppercase animate-pulse">
        Loading Section...
      </span>
    </div>
  );
}

export default function Home() {
  const [projects, setProjects] = useState<AdminProject[]>([]);

  useEffect(() => {
    // Fetch projects from Firebase
    const fetchProjects = async () => {
      try {
        const data = await getClientCollection<AdminProject>('projects', 'displayOrder', 'asc');
        // Only keep published projects
        const published = data.filter(p => p.status === 'Published' || !p.status);
        setProjects(published);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    };

    fetchProjects();
  }, []);

  return (
    <>
      {/* Full-Screen Light Luxury Cinematic Intro */}
      <CinematicIntro />

      {/* Main App Content Layout */}
      <div className="flex flex-col min-h-screen">
        {/* Sticky Navigation */}
        <Navbar />

        <main className="flex-grow">
          <Hero />
          <About />
          <Skills />
          <FeaturedProjects projects={projects} />
          <WebsitePortfolio projects={projects} />
          <GraphicDesign projects={projects} />
          <MotionGraphics projects={projects} />
          <VideoPortfolio projects={projects} />
          <Brands />
          <Contact />
        </main>

        {/* Footer & Scroll indicator */}
        <Footer />
      </div>
    </>
  );
}
