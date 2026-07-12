'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileDown, GraduationCap, Briefcase, Award } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';

const STATS = [
  { label: 'Completed Projects', value: '15+', icon: Briefcase },
  { label: 'Happy Clients',      value: '6+',  icon: Award },
  { label: 'CS Student',         value: 'B.Sc', icon: GraduationCap },
];

export function About() {
  return (
    <section id="about" className="py-16 sm:py-24 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-[30%] right-[-10%] w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="About Me" subtitle="My Story" align="center" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* Left Column: Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex justify-center"
          >
            {/* Portrait image frame with glow ring */}
            <div className="relative group w-full max-w-[240px] sm:max-w-[300px] lg:max-w-[340px] mx-auto">
              {/* Decorative gradient ring */}
              <div className="absolute -inset-[3px] rounded-[36px] bg-gradient-to-br from-primary via-secondary to-primary opacity-40 blur-sm group-hover:opacity-70 transition-opacity duration-500" />
              {/* Photo container — portrait 3:4 ratio */}
              <div className="relative rounded-[34px] overflow-hidden aspect-[3/4] border border-white/10 shadow-2xl">
                {/* Colour overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/shravan-profile.jpg"
                  alt="Shravan Yeole"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              {/* Floating name badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap glass border border-white/10 rounded-full px-4 sm:px-5 py-2 shadow-lg z-20">
                <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-gradient">Shravan Yeole</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Bio Details */}
          <div className="lg:col-span-7 flex flex-col space-y-5 sm:space-y-6 mt-6 lg:mt-0">
            <motion.h3
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-xl sm:text-2xl font-bold tracking-tight text-gradient"
            >
              Blending technology, design, and storytelling to create unforgettable digital experiences.
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-foreground/75 leading-relaxed text-sm md:text-base"
            >
              I&apos;m a Creative Developer and Computer Science student passionate about building modern websites,
              engaging visual content, motion graphics, and digital experiences. My work combines technology,
              design, and storytelling to help businesses establish a strong online presence.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-foreground/75 leading-relaxed text-sm md:text-base"
            >
              I specialise in frontend development, graphic design, video editing, branding, and motion graphics
              while continuously expanding my skills in WordPress, Meta Ads, and modern web technologies. Currently
              pursuing a B.Sc. in Computer Science at M.E.S. Abasaheb Garware College, Pune.
            </motion.p>

            {/* Education block */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="glass rounded-2xl p-4 border border-border-glow space-y-3"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-secondary">Education</p>
              <div>
                <p className="text-sm font-semibold">B.Sc. Computer Science — M.E.S. Abasaheb Garware College, Pune</p>
                <p className="text-xs text-foreground/50 mt-0.5">2024 – Present</p>
              </div>
              <div>
                <p className="text-sm font-semibold">HSC (Science) — M.I.T. Junior College, Pune</p>
                <p className="text-xs text-foreground/50 mt-0.5">2022 – 2024</p>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2">
              {STATS.map((stat, index) => {
                const StatIcon = stat.icon;
                return (
                  <Card key={index} hoverGlow={false} className="p-3 sm:p-4 flex flex-col items-center justify-center text-center">
                    <StatIcon className="w-4 h-4 sm:w-5 sm:h-5 text-secondary mb-1.5 sm:mb-2" />
                    <span className="text-lg sm:text-2xl font-bold tracking-tight text-gradient">
                      {stat.value}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-foreground/50 mt-1 uppercase font-semibold leading-tight">
                      {stat.label}
                    </span>
                  </Card>
                );
              })}
            </div>

            {/* Resume CTA */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="pt-2 flex flex-wrap gap-3"
            >
              <Button variant="outline" className="flex items-center space-x-2 min-h-[44px]">
                <FileDown className="w-4 h-4" />
                <span>Download Resume</span>
              </Button>
              <Button variant="primary" className="flex items-center space-x-2 min-h-[44px]">
                <a href="#contact">Hire Me</a>
              </Button>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
export default About;
