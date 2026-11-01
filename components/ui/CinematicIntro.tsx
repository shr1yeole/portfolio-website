'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface CinematicIntroProps {
  onComplete?: () => void;
}

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  // State machine: 'checking' (SSR/initial mount) -> 'running' -> 'completed'
  const [introState, setIntroState] = useState<'checking' | 'running' | 'completed'>('checking');

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const topCurtainRef = useRef<HTMLDivElement>(null);
  const bottomCurtainRef = useRef<HTMLDivElement>(null);
  const atmosphereRef = useRef<HTMLDivElement>(null);
  const centerBoxRef = useRef<HTMLDivElement>(null);

  // Glassmorphism panel & floating decorative elements
  const glassPanelRef = useRef<HTMLDivElement>(null);
  const panelSweepRef = useRef<HTMLDivElement>(null);
  const floatingOrb1Ref = useRef<HTMLDivElement>(null);
  const floatingOrb2Ref = useRef<HTMLDivElement>(null);
  const floatingCapsule1Ref = useRef<HTMLDivElement>(null);
  const floatingCapsule2Ref = useRef<HTMLDivElement>(null);

  // Central branding inside glass panel
  const portfolioLabelRef = useRef<HTMLDivElement>(null);
  const monogramBoxRef = useRef<HTMLDivElement>(null);
  const monogramSvgRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const auraGlowRef = useRef<HTMLDivElement>(null);
  const nameCharsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const counterTextRef = useRef<HTMLSpanElement>(null);

  // 1. Session check on client mount
  useEffect(() => {
    const SESSION_KEY = 'shravan_portfolio_intro_seen';

    try {
      // Respect prefers-reduced-motion
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        setIntroState('completed');
        onComplete?.();
        return;
      }

      // Check session storage
      const alreadySeen = sessionStorage.getItem(SESSION_KEY);
      if (alreadySeen === 'true') {
        setIntroState('completed');
        onComplete?.();
        return;
      }

      // First time in session: mark seen and launch intro
      sessionStorage.setItem(SESSION_KEY, 'true');
      setIntroState('running');
    } catch {
      // Storage restricted fallback
      setIntroState('completed');
      onComplete?.();
    }
  }, [onComplete]);

  // 2. Main animation and canvas lifecycle (runs once introState becomes 'running' and DOM is mounted)
  useEffect(() => {
    if (introState !== 'running') return;

    // Lock body scrolling while intro is active to prevent any underlying scroll
    document.body.style.overflow = 'hidden';

    // -------------------------------------------------------------
    // Canvas Particle System with 3D Flowing Wave Meshes & Trails
    // Deep Navy, Violet, Indigo, Blue, and Cyan palette
    // -------------------------------------------------------------
    const canvas = canvasRef.current;
    let animId: number;
    let particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      seed: number;
    }[] = [];

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 35 : 75;

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    if (canvas) {
      const ctx = canvas.getContext('2d');
      handleResize();
      window.addEventListener('resize', handleResize);

      // Particle colors matching palette: Violet, Indigo, Blue, Cyan, White
      const colors = [
        'rgba(139, 92, 246, 0.75)', // #8B5CF6 Violet
        'rgba(99, 102, 241, 0.75)', // #6366F1 Indigo
        'rgba(59, 130, 246, 0.75)', // #3B82F6 Electric Blue
        'rgba(6, 182, 212, 0.80)',  // #06B6D4 Cyan
        'rgba(255, 255, 255, 0.85)', // White
      ];

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.45,
          vy: -0.3 - Math.random() * 0.5,
          radius: Math.random() * 2.2 + 1.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          seed: Math.random() * 100,
        });
      }

      let t = 0;
      const render = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        t += 0.016;

        const w = window.innerWidth;
        const h = window.innerHeight;

        // 1. TOP-LEFT FLOWING PARTICLE WAVE MESH
        const tlStrands = 6;
        for (let s = 0; s < tlStrands; s++) {
          const offset = s * 16;
          ctx.beginPath();
          for (let x = 0; x < w * 0.58; x += 18) {
            const normX = x / (w * 0.58);
            const y =
              h * 0.08 +
              Math.sin(normX * 3.5 + t * 0.75 + s * 0.3) * 38 +
              Math.cos(normX * 5 - t * 0.45) * 18 +
              offset +
              normX * h * 0.28;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle =
            s % 2 === 0 ? 'rgba(6, 182, 212, 0.32)' : 'rgba(139, 92, 246, 0.30)';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Luminous node points
          for (let x = 0; x < w * 0.58; x += 36) {
            const normX = x / (w * 0.58);
            const y =
              h * 0.08 +
              Math.sin(normX * 3.5 + t * 0.75 + s * 0.3) * 38 +
              Math.cos(normX * 5 - t * 0.45) * 18 +
              offset +
              normX * h * 0.28;
            const alpha = (1 - normX * 0.7) * 0.8;
            ctx.beginPath();
            ctx.arc(x, y, 2.0, 0, Math.PI * 2);
            ctx.fillStyle =
              s % 2 === 0 ? `rgba(6, 182, 212, ${alpha})` : `rgba(139, 92, 246, ${alpha})`;
            ctx.shadowColor = '#06B6D4';
            ctx.shadowBlur = 4;
            ctx.fill();
          }
        }

        // 2. BOTTOM-RIGHT FLOWING PARTICLE WAVE MESH
        const brStrands = 7;
        for (let s = 0; s < brStrands; s++) {
          const offset = s * 16;
          ctx.beginPath();
          for (let x = w * 0.38; x < w + 20; x += 18) {
            const normX = (x - w * 0.38) / (w * 0.62);
            const y =
              h * 0.82 -
              Math.sin(normX * 4 + t * 0.7 + s * 0.25) * 45 -
              Math.cos(normX * 4.5 - t * 0.4) * 20 +
              offset -
              normX * h * 0.12;
            if (x === Math.ceil((w * 0.38) / 18) * 18) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle =
            s % 2 === 0 ? 'rgba(139, 92, 246, 0.30)' : 'rgba(6, 182, 212, 0.32)';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Luminous node points
          for (let x = w * 0.38; x < w + 20; x += 36) {
            const normX = (x - w * 0.38) / (w * 0.62);
            const y =
              h * 0.82 -
              Math.sin(normX * 4 + t * 0.7 + s * 0.25) * 45 -
              Math.cos(normX * 4.5 - t * 0.4) * 20 +
              offset -
              normX * h * 0.12;
            const alpha = (0.25 + normX * 0.75) * 0.8;
            ctx.beginPath();
            ctx.arc(x, y, 2.2, 0, Math.PI * 2);
            ctx.fillStyle =
              s % 2 === 0 ? `rgba(139, 92, 246, ${alpha})` : `rgba(6, 182, 212, ${alpha})`;
            ctx.shadowColor = '#8B5CF6';
            ctx.shadowBlur = 4;
            ctx.fill();
          }
        }

        // 3. AMBIENT DRIFTING PARTICLES
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx + Math.cos(t * 0.6 + p.seed) * 0.35;
          p.y += p.vy + Math.sin(t * 0.8 + p.seed) * 0.2;

          if (p.y < -15) p.y = h + 15;
          if (p.x < -15) p.x = w + 15;
          if (p.x > w + 15) p.x = -15;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = '#06B6D4';
          ctx.shadowBlur = 3;
          ctx.fill();
        }

        animId = requestAnimationFrame(render);
      };

      animId = requestAnimationFrame(render);
    }

    // -------------------------------------------------------------
    // GSAP Master Timeline (Coordinated 6.0 Seconds Duration)
    // -------------------------------------------------------------
    const ctxGsap = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = '';
          setIntroState('completed');
          onComplete?.();
        },
      });

      const counterState = { val: 0 };

      // Gentle floating animation on decorative elements
      if (floatingOrb1Ref.current) {
        gsap.to(floatingOrb1Ref.current, {
          y: -10,
          x: -6,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
      if (floatingOrb2Ref.current) {
        gsap.to(floatingOrb2Ref.current, {
          y: 12,
          x: 8,
          duration: 4.0,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
      if (floatingCapsule1Ref.current) {
        gsap.to(floatingCapsule1Ref.current, {
          y: -6,
          duration: 2.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
      if (floatingCapsule2Ref.current) {
        gsap.to(floatingCapsule2Ref.current, {
          y: 6,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      // ==========================================
      // PHASE 01 — INITIAL APPEARANCE (0.0s – 1.2s)
      // ==========================================
      // 1. Central Glassmorphism Panel reveal
      if (glassPanelRef.current) {
        tl.fromTo(
          glassPanelRef.current,
          { opacity: 0, scale: 0.94, y: 18 },
          { opacity: 1, scale: 1.0, y: 0, duration: 1.15, ease: 'power2.out' },
          0.05
        );
      }

      // 2. Glass border subtle light sweep
      if (panelSweepRef.current) {
        tl.fromTo(
          panelSweepRef.current,
          { x: '-180%', opacity: 0 },
          { x: '280%', opacity: 0.55, duration: 1.1, ease: 'power2.inOut' },
          0.15
        );
        tl.to(
          panelSweepRef.current,
          { opacity: 0, duration: 0.25 },
          1.15
        );
      }

      // 3. Top label: PORTFOLIO / 2026
      if (portfolioLabelRef.current) {
        tl.fromTo(
          portfolioLabelRef.current,
          { opacity: 0, y: -8 },
          { opacity: 0.9, y: 0, duration: 0.9, ease: 'power2.out' },
          0.1
        );
      }

      // 4. SY Monogram reveal
      if (monogramBoxRef.current) {
        tl.fromTo(
          monogramBoxRef.current,
          { opacity: 0, scale: 0.88 },
          { opacity: 1, scale: 1.0, duration: 1.1, ease: 'power2.out' },
          0.1
        );
      }

      // 5. Monogram light sweep reflection
      if (sweepRef.current) {
        tl.fromTo(
          sweepRef.current,
          { x: '-150%', opacity: 0 },
          { x: '250%', opacity: 0.65, duration: 1.1, ease: 'power2.inOut' },
          0.2
        );
        tl.to(
          sweepRef.current,
          { opacity: 0, duration: 0.25 },
          1.2
        );
      }

      // 6. Ambient glow aura
      if (auraGlowRef.current) {
        tl.fromTo(
          auraGlowRef.current,
          { opacity: 0, scale: 0.7 },
          { opacity: 0.8, scale: 1.0, duration: 1.3, ease: 'power2.out' },
          0.1
        );
      }

      // 7. Progress indicator reveal inside glass panel
      if (bottomBarRef.current) {
        tl.fromTo(
          bottomBarRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          0.3
        );
      }

      // ==========================================
      // PHASE 02 — PERSONAL BRAND REVEAL (1.2s – 2.8s)
      // ==========================================
      // 1. Staggered reveal of "SHRAVAN YEOLE"
      const validChars = nameCharsRef.current.filter(Boolean);
      if (validChars.length > 0) {
        tl.fromTo(
          validChars,
          {
            opacity: 0,
            y: 24,
            filter: 'blur(6px)',
          },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.7,
            stagger: 0.035,
            ease: 'power3.out',
          },
          1.15
        );
      }

      // 2. Subtitle reveal: "CREATIVE DEVELOPER | DESIGNER | DIGITAL CREATOR"
      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          {
            opacity: 0,
            y: 12,
          },
          {
            opacity: 0.85,
            y: 0,
            duration: 0.9,
            ease: 'power2.out',
          },
          1.65
        );
      }

      // ==========================================
      // PROGRESS INDICATOR: 0% to 100% (0.0s – 4.75s)
      // Directly synchronized counter & bar width
      // ==========================================
      tl.to(
        counterState,
        {
          val: 100,
          duration: 4.75,
          ease: 'power1.inOut',
          onUpdate: () => {
            const pct = Math.floor(counterState.val);
            if (counterTextRef.current) {
              counterTextRef.current.textContent = `${pct}%`;
            }
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${pct}%`;
            }
          },
        },
        0.05
      );

      // ==========================================
      // PHASE 03 — CINEMATIC VISUAL MOVEMENT (2.8s – 4.5s)
      // ==========================================
      if (centerBoxRef.current) {
        tl.to(
          centerBoxRef.current,
          {
            scale: 1.02,
            duration: 1.9,
            ease: 'sine.inOut',
          },
          2.6
        );
      }

      // Subtle pulse on monogram glow
      if (monogramSvgRef.current) {
        tl.to(
          monogramSvgRef.current,
          {
            filter: 'drop-shadow(0 4px 26px rgba(6, 182, 212, 0.7))',
            duration: 1.5,
            ease: 'sine.inOut',
          },
          2.8
        );
      }

      // ==========================================
      // PHASE 04 — FINAL REVEAL (4.5s – 6.0s)
      // ==========================================
      // 4.35s: Central light bloom
      if (auraGlowRef.current) {
        tl.to(
          auraGlowRef.current,
          {
            opacity: 1,
            scale: 1.35,
            duration: 0.45,
            ease: 'power2.in',
          },
          4.35
        );
      }

      // 4.7s: Fade and move glass elements elegantly upward
      const exitElements = [
        glassPanelRef.current,
        floatingOrb1Ref.current,
        floatingOrb2Ref.current,
        floatingCapsule1Ref.current,
        floatingCapsule2Ref.current,
      ].filter(Boolean);

      tl.to(
        exitElements,
        {
          opacity: 0,
          y: -20,
          scale: 0.98,
          duration: 0.45,
          ease: 'power2.in',
        },
        4.7
      );

      // Fade out atmosphere & particles before curtains split
      if (atmosphereRef.current) {
        tl.to(
          atmosphereRef.current,
          {
            opacity: 0,
            duration: 0.35,
            ease: 'power2.out',
          },
          4.7
        );
      }

      if (canvasRef.current) {
        tl.to(
          canvasRef.current,
          {
            opacity: 0,
            duration: 0.35,
            ease: 'power2.out',
          },
          4.7
        );
      }

      // 4.9s: Smooth split curtain opening reveal
      if (topCurtainRef.current) {
        tl.to(
          topCurtainRef.current,
          {
            yPercent: -100,
            duration: 1.1,
            ease: 'power3.inOut',
          },
          4.9
        );
      }

      if (bottomCurtainRef.current) {
        tl.to(
          bottomCurtainRef.current,
          {
            yPercent: 100,
            duration: 1.1,
            ease: 'power3.inOut',
          },
          4.9
        );
      }

      // Pass pointer-events through as soon as curtains begin opening
      if (containerRef.current) {
        tl.set(
          containerRef.current,
          {
            pointerEvents: 'none',
          },
          5.0
        );
      }
    }, containerRef);

    // React cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      ctxGsap.revert();
    };
  }, [introState, onComplete]);

  // If already seen or completed, render nothing
  if (introState === 'completed' || introState === 'checking') {
    return null;
  }

  const wordOne = 'SHRAVAN';
  const wordTwo = 'YEOLE';
  let charCounter = 0;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] overflow-hidden select-none bg-[#070B1B] pointer-events-auto"
      aria-label="Cinematic entrance intro"
    >
      {/* TOP CURTAIN PANEL (Deep Navy Gradient) */}
      <div
        ref={topCurtainRef}
        className="absolute top-0 left-0 w-full h-[50.5%] z-10 will-change-transform origin-top"
        style={{ background: 'linear-gradient(to bottom, #070B1B 0%, #0B1630 100%)' }}
      />

      {/* BOTTOM CURTAIN PANEL (Deep Navy Gradient) */}
      <div
        ref={bottomCurtainRef}
        className="absolute bottom-0 left-0 w-full h-[50.5%] z-10 will-change-transform origin-bottom"
        style={{ background: 'linear-gradient(to top, #070B1B 0%, #0B1630 100%)' }}
      />

      {/* ATMOSPHERIC BACKGROUND GRADIENTS & NEON LIGHT SOURCES */}
      <div
        ref={atmosphereRef}
        className="absolute inset-0 pointer-events-none z-15 will-change-opacity"
        style={{
          background: `
            radial-gradient(circle at 14% 35%, rgba(139, 92, 246, 0.35) 0%, rgba(99, 102, 241, 0.18) 35%, transparent 68%),
            radial-gradient(circle at 86% 65%, rgba(6, 182, 212, 0.30) 0%, rgba(59, 130, 246, 0.20) 35%, transparent 68%),
            radial-gradient(circle at 50% 50%, rgba(11, 22, 48, 0.90) 0%, rgba(7, 11, 27, 0.95) 70%, transparent 100%),
            #070B1B
          `,
        }}
      />

      {/* PARTICLES CANVAS (3D Wave Meshes & Luminous Particles) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-16 pointer-events-none opacity-95 will-change-opacity"
      />

      {/* CENTRAL GLASSMORPHISM PANEL & BRANDING */}
      <div
        ref={centerBoxRef}
        className="relative z-20 flex flex-col items-center justify-center w-full h-full px-4 text-center will-change-transform"
      >
        {/* AMBIENT GLOW BEHIND PANEL */}
        <div
          ref={auraGlowRef}
          className="absolute w-[500px] h-[380px] sm:w-[720px] sm:h-[480px] rounded-full pointer-events-none blur-3xl opacity-0"
          style={{
            background:
              'radial-gradient(circle, rgba(139, 92, 246, 0.28) 0%, rgba(6, 182, 212, 0.18) 50%, transparent 75%)',
          }}
        />

        {/* GLASS PANEL WRAPPER WITH FLOATING ELEMENTS */}
        <div className="relative w-full max-w-[820px] flex items-center justify-center">

          {/* Floating Glass Orb Top-Left */}
          <div
            ref={floatingOrb1Ref}
            className="absolute -top-8 -left-6 sm:-top-12 sm:-left-12 w-28 h-28 sm:w-36 sm:h-36 rounded-full pointer-events-none z-10 opacity-70"
            style={{
              background:
                'radial-gradient(circle at 35% 35%, rgba(139, 92, 246, 0.45) 0%, rgba(99, 102, 241, 0.15) 60%, transparent 80%)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              boxShadow:
                '0 0 35px rgba(139, 92, 246, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          />

          {/* Floating Glass Orb Bottom-Right */}
          <div
            ref={floatingOrb2Ref}
            className="absolute -bottom-8 -right-6 sm:-bottom-12 sm:-right-12 w-32 h-32 sm:w-40 sm:h-40 rounded-full pointer-events-none z-10 opacity-70"
            style={{
              background:
                'radial-gradient(circle at 65% 65%, rgba(6, 182, 212, 0.40) 0%, rgba(59, 130, 246, 0.15) 60%, transparent 80%)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              boxShadow:
                '0 0 35px rgba(6, 182, 212, 0.30), inset 0 -1px 2px rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          />

          {/* Floating Capsule Top-Right */}
          <div
            ref={floatingCapsule1Ref}
            className="hidden sm:flex absolute -top-4 right-10 z-30 px-3.5 py-1.5 rounded-full items-center gap-2 pointer-events-none opacity-85"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow:
                '0 8px 24px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06B6D4]" />
            <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-200/90 uppercase font-semibold">
              SYS.ONLINE
            </span>
          </div>

          {/* Floating Capsule Bottom-Left */}
          <div
            ref={floatingCapsule2Ref}
            className="hidden sm:flex absolute -bottom-4 left-10 z-30 px-3.5 py-1.5 rounded-full items-center gap-2 pointer-events-none opacity-85"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow:
                '0 8px 24px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_#8B5CF6]" />
            <span className="text-[10px] font-mono tracking-[0.25em] text-violet-200/90 uppercase font-semibold">
              2026 // PRO
            </span>
          </div>

          {/* CENTRAL FROSTED GLASS PANEL */}
          <div
            ref={glassPanelRef}
            className="relative w-full max-w-[820px] rounded-[30px] sm:rounded-[36px] p-[1.5px] z-20 overflow-hidden opacity-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(139, 92, 246, 0.50) 0%, rgba(255, 255, 255, 0.12) 40%, rgba(6, 182, 212, 0.50) 100%)',
              boxShadow:
                '0 30px 80px -15px rgba(0, 0, 0, 0.75), 0 0 50px -10px rgba(99, 102, 241, 0.28)',
            }}
          >
            {/* Inner Glass Surface */}
            <div
              className="w-full h-full rounded-[29px] sm:rounded-[35px] px-6 sm:px-12 py-8 sm:py-10 flex flex-col items-center justify-between relative overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                boxShadow:
                  'inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 1.5px 0 rgba(255, 255, 255, 0.05)',
              }}
            >
              {/* Glass Interior Radial Sheen */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at 50% 15%, rgba(255, 255, 255, 0.07) 0%, transparent 60%)',
                }}
              />

              {/* Diagonal Light Sweep across Glass Panel */}
              <div
                ref={panelSweepRef}
                className="absolute -inset-y-10 -inset-x-20 w-36 bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-25 pointer-events-none z-30 opacity-0 mix-blend-overlay"
              />

              {/* TOP LABEL: PORTFOLIO / 2026 */}
              <div
                ref={portfolioLabelRef}
                className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.42em] text-slate-300/85 mb-4 sm:mb-5 opacity-0 flex items-center gap-2"
                style={{ fontFamily: 'var(--font-sans), sans-serif' }}
              >
                <span>PORTFOLIO</span>
                <span className="text-violet-400/80">/</span>
                <span className="text-cyan-300 font-mono">2026</span>
              </div>

              {/* 1. CUSTOM SY MONOGRAM WITH CORNER BRACKETS & GLASS MEDALLION */}
              <div
                ref={monogramBoxRef}
                className="relative w-32 h-32 sm:w-36 sm:h-36 mb-4 sm:mb-5 flex items-center justify-center opacity-0"
              >
                {/* Frosted Glass Monogram Medallion */}
                <div
                  className="absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow:
                      '0 10px 30px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.25), 0 0 25px rgba(99, 102, 241, 0.25)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                  }}
                />

                {/* 4 Corner Brackets */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-10"
                  viewBox="0 0 144 144"
                  fill="none"
                >
                  {/* Top Left Bracket */}
                  <path
                    d="M 16 34 L 16 16 L 34 16"
                    stroke="rgba(139, 92, 246, 0.6)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  {/* Top Right Bracket */}
                  <path
                    d="M 110 16 L 128 16 L 128 34"
                    stroke="rgba(139, 92, 246, 0.6)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  {/* Bottom Left Bracket */}
                  <path
                    d="M 16 110 L 16 128 L 34 128"
                    stroke="rgba(6, 182, 212, 0.6)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  {/* Bottom Right Bracket */}
                  <path
                    d="M 110 128 L 128 128 L 128 110"
                    stroke="rgba(6, 182, 212, 0.6)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />

                  {/* Thin Delicate Circle Frame */}
                  <circle
                    cx="72"
                    cy="72"
                    r="46"
                    stroke="rgba(255, 255, 255, 0.18)"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                  />
                </svg>

                {/* Subtle light sweep reflection */}
                <div
                  ref={sweepRef}
                  className="absolute -inset-y-4 -inset-x-8 w-24 bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent rotate-25 pointer-events-none z-25 opacity-0 mix-blend-overlay"
                />

                {/* Custom SY Monogram (Reference Logo with Theme Gradient) */}
                <div
                  ref={monogramSvgRef}
                  className="w-20 h-20 sm:w-22 sm:h-22 z-20 transition-all flex items-center justify-center filter drop-shadow-[0_4px_22px_rgba(99,102,241,0.55)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/sy-logo-gradient.png"
                    alt="SY Monogram"
                    className="w-full h-full object-contain pointer-events-none select-none"
                    draggable={false}
                  />
                </div>
              </div>

              {/* 2. PERSONAL BRAND NAME: "SHRAVAN YEOLE" */}
              <div className="overflow-hidden mb-2 sm:mb-2.5">
                <h1
                  className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-[0.2em] sm:tracking-[0.32em] text-white uppercase inline-flex items-center justify-center flex-wrap gap-x-2.5 sm:gap-x-4"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}
                >
                  {/* Word 1: SHRAVAN (Crisp White with drop shadow) */}
                  <span className="inline-flex whitespace-nowrap">
                    {wordOne.split('').map((char) => {
                      const idx = charCounter++;
                      return (
                        <span
                          key={idx}
                          ref={(el) => {
                            nameCharsRef.current[idx] = el;
                          }}
                          className="inline-block text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
                        >
                          {char}
                        </span>
                      );
                    })}
                  </span>

                  {/* Word 2: YEOLE (Violet to Electric Blue to Cyan Gradient) */}
                  <span className="inline-flex whitespace-nowrap">
                    {wordTwo.split('').map((char) => {
                      const idx = charCounter++;
                      return (
                        <span
                          key={idx}
                          ref={(el) => {
                            nameCharsRef.current[idx] = el;
                          }}
                          className="inline-block bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(99,102,241,0.4)]"
                        >
                          {char}
                        </span>
                      );
                    })}
                  </span>
                </h1>
              </div>

              {/* 3. SUBTITLE: "CREATIVE DEVELOPER | DESIGNER | DIGITAL CREATOR" */}
              <div
                ref={subtitleRef}
                className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.22em] sm:tracking-[0.32em] text-slate-300/80 opacity-0 text-center max-w-xs sm:max-w-2xl px-2 mb-6 sm:mb-7 leading-relaxed"
                style={{ fontFamily: 'var(--font-sans), sans-serif' }}
              >
                <span>Creative Developer</span>
                <span className="mx-2 sm:mx-3 text-violet-400/50">|</span>
                <span>Designer</span>
                <span className="mx-2 sm:mx-3 text-cyan-400/50">|</span>
                <span>Digital Creator</span>
              </div>

              {/* 4. PROGRESS BAR & INDICATOR (Integrated inside the glass panel) */}
              <div
                ref={bottomBarRef}
                className="w-full max-w-[500px] flex flex-col items-center opacity-0 mt-auto pt-2"
              >
                {/* Label on Left, Percentage on Right */}
                <div className="w-full flex items-center justify-between mb-2 px-1">
                  <span
                    className="text-[9.5px] sm:text-[11px] tracking-[0.26em] uppercase text-slate-300/80 font-semibold"
                    style={{ fontFamily: 'var(--font-sans), sans-serif' }}
                  >
                    Crafting Your Experience
                  </span>
                  <span
                    ref={counterTextRef}
                    className="text-xs sm:text-sm font-mono tracking-wider text-cyan-300 font-bold tabular-nums drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                  >
                    0%
                  </span>
                </div>

                {/* Thin Translucent Track */}
                <div className="w-full h-[3.5px] bg-white/[0.08] rounded-full overflow-hidden relative shadow-inner">
                  <div
                    ref={progressBarRef}
                    className="h-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400 rounded-full relative"
                    style={{
                      width: '0%',
                      boxShadow: '0 0 14px rgba(6, 182, 212, 0.9), 0 0 4px #06B6D4',
                    }}
                  />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
