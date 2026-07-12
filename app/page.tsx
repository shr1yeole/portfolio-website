'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
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

// A nice animated section loader skeleton
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
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <>
      {/* Dynamic Animated Entry Loading Overlay */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-gray-950 text-white"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center space-y-6"
            >
              {/* Spinner logo */}
              <div className="relative w-20 h-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-4 border-t-primary border-r-secondary border-b-primary border-l-secondary"
                />
                <div className="absolute inset-2 bg-gray-950 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold tracking-widest text-gradient">PORTFOLIO</span>
                </div>
              </div>
              
              <div className="text-center">
                <motion.h2
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg font-bold tracking-widest uppercase text-white"
                >
                  Shravan Yeole
                </motion.h2>
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 0.5 }}
                  transition={{ delay: 0.4 }}
                  className="text-[10px] tracking-wider uppercase text-white/50 mt-1"
                >
                  Creative Developer & Designer
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main App Content Layout */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col min-h-screen"
        >
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
        </motion.div>
      )}
    </>
  );
}
