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

  // 3D Spatial Core & Orbital System
  const spatialCoreRef = useRef<HTMLDivElement>(null);
  const glassDiscRef = useRef<HTMLDivElement>(null);
  const lensSweepRef = useRef<HTMLDivElement>(null);
  const floatPillLeftRef = useRef<HTMLDivElement>(null);
  const floatPillRightRef = useRef<HTMLDivElement>(null);
  const monogramSvgRef = useRef<HTMLDivElement>(null);

  // Branding & Kinetic Typography
  const portfolioLabelRef = useRef<HTMLDivElement>(null);
  const typographyBoxRef = useRef<HTMLDivElement>(null);
  const nameCharsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const auraGlowRef = useRef<HTMLDivElement>(null);

  // Advanced Progress Indicator
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressCircleRef = useRef<SVGPathElement>(null);
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
    // Canvas Particle System with 3D Flowing Wave Meshes & Stardust
    // Deep Space Navy, Violet, Indigo, Blue, and Cyan palette
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
    const particleCount = isMobile ? 40 : 80;

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

      // Particle colors matching palette: Violet, Indigo, Blue, Cyan, Stardust White
      const colors = [
        'rgba(139, 92, 246, 0.80)', // #8B5CF6 Violet
        'rgba(99, 102, 241, 0.80)', // #6366F1 Indigo
        'rgba(59, 130, 246, 0.80)', // #3B82F6 Electric Blue
        'rgba(6, 182, 212, 0.85)',  // #06B6D4 Cyan
        'rgba(255, 255, 255, 0.90)', // Stardust White
      ];

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.45,
          vy: -0.35 - Math.random() * 0.55,
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
        const tlStrands = 7;
        for (let s = 0; s < tlStrands; s++) {
          const offset = s * 15;
          ctx.beginPath();
          for (let x = 0; x < w * 0.65; x += 18) {
            const normX = x / (w * 0.65);
            const y =
              h * 0.06 +
              Math.sin(normX * 3.8 + t * 0.8 + s * 0.28) * 42 +
              Math.cos(normX * 4.8 - t * 0.45) * 18 +
              offset +
              normX * h * 0.26;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle =
            s % 2 === 0 ? 'rgba(6, 182, 212, 0.35)' : 'rgba(139, 92, 246, 0.32)';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Luminous node points
          for (let x = 0; x < w * 0.65; x += 36) {
            const normX = x / (w * 0.65);
            const y =
              h * 0.06 +
              Math.sin(normX * 3.8 + t * 0.8 + s * 0.28) * 42 +
              Math.cos(normX * 4.8 - t * 0.45) * 18 +
              offset +
              normX * h * 0.26;
            const alpha = (1 - normX * 0.65) * 0.85;
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
        const brStrands = 8;
        for (let s = 0; s < brStrands; s++) {
          const offset = s * 15;
          ctx.beginPath();
          for (let x = w * 0.35; x < w + 20; x += 18) {
            const normX = (x - w * 0.35) / (w * 0.65);
            const y =
              h * 0.84 -
              Math.sin(normX * 4.2 + t * 0.75 + s * 0.25) * 48 -
              Math.cos(normX * 4.4 - t * 0.4) * 20 +
              offset -
              normX * h * 0.12;
            if (x === Math.ceil((w * 0.35) / 18) * 18) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle =
            s % 2 === 0 ? 'rgba(139, 92, 246, 0.32)' : 'rgba(6, 182, 212, 0.35)';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Luminous node points
          for (let x = w * 0.35; x < w + 20; x += 36) {
            const normX = (x - w * 0.35) / (w * 0.65);
            const y =
              h * 0.84 -
              Math.sin(normX * 4.2 + t * 0.75 + s * 0.25) * 48 -
              Math.cos(normX * 4.4 - t * 0.4) * 20 +
              offset -
              normX * h * 0.12;
            const alpha = (0.25 + normX * 0.75) * 0.85;
            ctx.beginPath();
            ctx.arc(x, y, 2.2, 0, Math.PI * 2);
            ctx.fillStyle =
              s % 2 === 0 ? `rgba(139, 92, 246, ${alpha})` : `rgba(6, 182, 212, ${alpha})`;
            ctx.shadowColor = '#8B5CF6';
            ctx.shadowBlur = 4;
            ctx.fill();
          }
        }

        // 3. AMBIENT STARDUST DRIFTING PARTICLES
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

      // 3D Continuous Gyroscope Floating hover on the suspended glass disc
      if (glassDiscRef.current) {
        gsap.to(glassDiscRef.current, {
          rotateX: 14,
          rotateY: -10,
          y: -10,
          duration: 3.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      if (floatPillLeftRef.current) {
        gsap.to(floatPillLeftRef.current, {
          y: -8,
          duration: 2.9,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
      if (floatPillRightRef.current) {
        gsap.to(floatPillRightRef.current, {
          y: 8,
          duration: 3.3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      // ==========================================
      // PHASE 01 — 3D STRUCTURE EMERGENCE (0.0s – 1.2s)
      // ==========================================
      // 1. Central 3D Spatial Core emerges with perspective
      if (spatialCoreRef.current) {
        tl.fromTo(
          spatialCoreRef.current,
          { opacity: 0, scale: 0.85, rotateX: 25 },
          { opacity: 1, scale: 1.0, rotateX: 8, duration: 1.15, ease: 'power2.out' },
          0.05
        );
      }

      // 2. Light sweep across glass lens
      if (lensSweepRef.current) {
        tl.fromTo(
          lensSweepRef.current,
          { x: '-160%', opacity: 0 },
          { x: '260%', opacity: 0.65, duration: 1.1, ease: 'power2.inOut' },
          0.15
        );
        tl.to(
          lensSweepRef.current,
          { opacity: 0, duration: 0.25 },
          1.15
        );
      }

      // 3. Top Label Reveal: PORTFOLIO / 2026
      if (portfolioLabelRef.current) {
        tl.fromTo(
          portfolioLabelRef.current,
          { opacity: 0, y: -10 },
          { opacity: 0.95, y: 0, duration: 0.9, ease: 'power2.out' },
          0.1
        );
      }

      // 4. Volumetric Light Bloom
      if (auraGlowRef.current) {
        tl.fromTo(
          auraGlowRef.current,
          { opacity: 0, scale: 0.7 },
          { opacity: 0.85, scale: 1.0, duration: 1.3, ease: 'power2.out' },
          0.1
        );
      }

      // 5. Progress Indicator Reveal
      if (bottomBarRef.current) {
        tl.fromTo(
          bottomBarRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          0.3
        );
      }

      // ==========================================
      // PHASE 02 — KINETIC TYPOGRAPHY REVEAL (1.2s – 2.8s)
      // ==========================================
      // 1. Staggered letter-by-letter reveal of "SHRAVAN YEOLE"
      const validChars = nameCharsRef.current.filter(Boolean);
      if (validChars.length > 0) {
        tl.fromTo(
          validChars,
          {
            opacity: 0,
            y: 26,
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
            opacity: 0.9,
            y: 0,
            duration: 0.9,
            ease: 'power2.out',
          },
          1.65
        );
      }

      // ==========================================
      // PROGRESS INDICATOR: 0% to 100% (0.0s – 4.75s)
      // Directly synchronized bar, circular ring, and numeric counter
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
            if (progressCircleRef.current) {
              const offset = 100 - pct;
              progressCircleRef.current.setAttribute('stroke-dashoffset', `${offset}`);
            }
          },
        },
        0.05
      );

      // ==========================================
      // PHASE 03 — CINEMATIC SPATIAL MOVEMENT (2.8s – 4.5s)
      // ==========================================
      if (centerBoxRef.current) {
        tl.to(
          centerBoxRef.current,
          {
            scale: 1.025,
            duration: 1.9,
            ease: 'sine.inOut',
          },
          2.6
        );
      }

      // Monogram glow pulsation
      if (monogramSvgRef.current) {
        tl.to(
          monogramSvgRef.current,
          {
            filter: 'drop-shadow(0 4px 32px rgba(6, 182, 212, 0.85))',
            duration: 1.5,
            ease: 'sine.inOut',
          },
          2.8
        );
      }

      // ==========================================
      // PHASE 04 — FINAL BLOOM & CURTAIN REVEAL (4.5s – 6.0s)
      // ==========================================
      // 4.35s: Central light bloom surge
      if (auraGlowRef.current) {
        tl.to(
          auraGlowRef.current,
          {
            opacity: 1,
            scale: 1.4,
            duration: 0.45,
            ease: 'power2.in',
          },
          4.35
        );
      }

      // 4.7s: Dissolve foreground 3D elements
      const exitElements = [
        spatialCoreRef.current,
        typographyBoxRef.current,
        portfolioLabelRef.current,
        bottomBarRef.current,
      ].filter(Boolean);

      tl.to(
        exitElements,
        {
          opacity: 0,
          y: -20,
          scale: 0.97,
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
      className="fixed inset-0 z-[99999] overflow-hidden select-none bg-[#050817] pointer-events-auto"
      aria-label="Cinematic entrance intro"
    >
      {/* Dynamic Keyframes for Orbital Rings and Ambient Glow */}
      <style>{`
        @keyframes orbit-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit-ccw {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-orbit-cw {
          animation: orbit-cw 22s linear infinite;
        }
        .animate-orbit-ccw {
          animation: orbit-ccw 18s linear infinite;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>

      {/* TOP CURTAIN PANEL (Deep Space Navy Gradient) */}
      <div
        ref={topCurtainRef}
        className="absolute top-0 left-0 w-full h-[50.5%] z-10 will-change-transform origin-top"
        style={{ background: 'linear-gradient(to bottom, #050817 0%, #0B1530 100%)' }}
      />

      {/* BOTTOM CURTAIN PANEL (Deep Space Navy Gradient) */}
      <div
        ref={bottomCurtainRef}
        className="absolute bottom-0 left-0 w-full h-[50.5%] z-10 will-change-transform origin-bottom"
        style={{ background: 'linear-gradient(to top, #050817 0%, #0B1530 100%)' }}
      />

      {/* LAYER 1: ATMOSPHERIC DEEP LIGHTING & VOLUMETRIC GLOWS */}
      <div
        ref={atmosphereRef}
        className="absolute inset-0 pointer-events-none z-15 will-change-opacity"
        style={{
          background: `
            radial-gradient(circle at 12% 28%, rgba(139, 92, 246, 0.40) 0%, rgba(99, 102, 241, 0.20) 30%, transparent 65%),
            radial-gradient(circle at 88% 68%, rgba(6, 182, 212, 0.35) 0%, rgba(59, 130, 246, 0.18) 35%, transparent 65%),
            radial-gradient(circle at 50% 45%, rgba(15, 23, 42, 0.95) 0%, rgba(5, 8, 23, 0.98) 70%, transparent 100%),
            #050817
          `,
        }}
      />

      {/* LAYER 2: PARTICLES CANVAS (Midground 3D Wave Meshes & Stardust) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-16 pointer-events-none opacity-95 will-change-opacity"
      />

      {/* LAYER 3: FOREGROUND 3D SPATIAL COMPOSITION */}
      <div
        ref={centerBoxRef}
        className="relative z-20 flex flex-col items-center justify-between w-full h-full px-4 py-8 sm:py-12 text-center will-change-transform"
        style={{ perspective: 1200 }}
      >
        {/* AMBIENT VOLUMETRIC LIGHT BLOOM BEHIND CORE */}
        <div
          ref={auraGlowRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] sm:w-[620px] sm:h-[620px] rounded-full pointer-events-none blur-3xl opacity-0"
          style={{
            background:
              'radial-gradient(circle, rgba(139, 92, 246, 0.32) 0%, rgba(6, 182, 212, 0.20) 45%, transparent 70%)',
          }}
        />

        {/* TOP BRAND TAG: PORTFOLIO / 2026 */}
        <div
          ref={portfolioLabelRef}
          className="opacity-0 z-30 pt-2 flex items-center gap-3 px-4 py-1.5 rounded-full"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.10)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#06B6D4]" />
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.38em] uppercase text-slate-300">
            PORTFOLIO <span className="text-violet-400/80 mx-1">/</span>{' '}
            <span className="text-cyan-300 font-mono">2026</span>
          </span>
        </div>

        {/* CENTRAL 3D FLOATING GLASS STRUCTURE WITH ORBITAL SYSTEM */}
        <div
          ref={spatialCoreRef}
          className="relative w-full max-w-[560px] flex items-center justify-center my-auto preserve-3d opacity-0"
        >
          {/* ORBITAL RING 1 (Tilted X: 64deg, Y: -18deg) */}
          <div
            className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full pointer-events-none z-10 animate-orbit-cw"
            style={{
              transform: 'rotateX(64deg) rotateY(-18deg)',
              border: '1.2px dashed rgba(6, 182, 212, 0.35)',
              boxShadow: '0 0 25px rgba(6, 182, 212, 0.15)',
            }}
          >
            {/* Traveling Luminous Satellite Node */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-300 shadow-[0_0_14px_#22D3EE,0_0_24px_#06B6D4]" />
          </div>

          {/* ORBITAL RING 2 (Counter-Tilted X: -54deg, Y: 22deg) */}
          <div
            className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full pointer-events-none z-10 animate-orbit-ccw"
            style={{
              transform: 'rotateX(-54deg) rotateY(22deg)',
              border: '1.2px solid rgba(139, 92, 246, 0.30)',
              boxShadow: '0 0 25px rgba(139, 92, 246, 0.15)',
            }}
          >
            {/* Traveling Luminous Violet Node */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 rounded-full bg-violet-400 shadow-[0_0_14px_#A78BFA,0_0_24px_#8B5CF6]" />
          </div>

          {/* FLOATING SIDE GLASS CAPSULE (LEFT) */}
          <div
            ref={floatPillLeftRef}
            className="hidden sm:flex absolute -left-16 top-1/2 -translate-y-1/2 z-30 px-3 py-1.5 rounded-xl items-center gap-2 pointer-events-none opacity-80"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_6px_#8B5CF6]" />
            <span className="text-[9px] font-mono tracking-[0.25em] text-slate-300 uppercase">
              SYS.READY
            </span>
          </div>

          {/* FLOATING SIDE GLASS CAPSULE (RIGHT) */}
          <div
            ref={floatPillRightRef}
            className="hidden sm:flex absolute -right-16 top-1/2 -translate-y-1/2 z-30 px-3 py-1.5 rounded-xl items-center gap-2 pointer-events-none opacity-80"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#06B6D4]" />
            <span className="text-[9px] font-mono tracking-[0.25em] text-slate-300 uppercase">
              3D.SPATIAL
            </span>
          </div>

          {/* SUSPENDED 3D GLASS LENS / PEDESTAL */}
          <div
            ref={glassDiscRef}
            className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-[36px] sm:rounded-[44px] p-[1.5px] z-20 flex items-center justify-center preserve-3d"
            style={{
              background:
                'linear-gradient(135deg, rgba(139, 92, 246, 0.55) 0%, rgba(255, 255, 255, 0.15) 45%, rgba(6, 182, 212, 0.55) 100%)',
              boxShadow:
                '0 25px 60px -10px rgba(0, 0, 0, 0.8), 0 0 50px rgba(99, 102, 241, 0.35)',
            }}
          >
            {/* Frosted Glass Surface */}
            <div
              className="w-full h-full rounded-[35px] sm:rounded-[43px] flex items-center justify-center relative overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                boxShadow:
                  'inset 0 1px 2px rgba(255, 255, 255, 0.35), inset 0 -1px 2px rgba(255, 255, 255, 0.06)',
              }}
            >
              {/* Radial Lens Highlight */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at 45% 25%, rgba(255, 255, 255, 0.14) 0%, transparent 60%)',
                }}
              />

              {/* Diagonal Dynamic Light Sweep */}
              <div
                ref={lensSweepRef}
                className="absolute -inset-y-10 -inset-x-20 w-32 bg-gradient-to-r from-transparent via-white/30 to-transparent rotate-25 pointer-events-none z-30 opacity-0 mix-blend-overlay"
              />

              {/* 4 Delicately Sculpted Corner Framing Brackets */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
                viewBox="0 0 160 160"
                fill="none"
              >
                <path
                  d="M 22 42 L 22 22 L 42 22"
                  stroke="rgba(139, 92, 246, 0.7)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M 118 22 L 138 22 L 138 42"
                  stroke="rgba(139, 92, 246, 0.7)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M 22 118 L 22 138 L 42 138"
                  stroke="rgba(6, 182, 212, 0.7)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M 118 138 L 138 138 L 138 118"
                  stroke="rgba(6, 182, 212, 0.7)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="52"
                  stroke="rgba(255, 255, 255, 0.18)"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                />
              </svg>

              {/* THE SUSPENDED CUSTOM SY MONOGRAM EMBLEM */}
              <div
                ref={monogramSvgRef}
                className="w-24 h-24 sm:w-32 sm:h-32 z-20 transition-all flex items-center justify-center filter drop-shadow-[0_4px_28px_rgba(6,182,212,0.65)]"
                style={{ transform: 'translateZ(25px)' }}
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
          </div>
        </div>

        {/* KINETIC TYPOGRAPHY SECTION */}
        <div
          ref={typographyBoxRef}
          className="w-full max-w-2xl flex flex-col items-center z-20 mt-3 sm:mt-5 mb-2"
        >
          {/* 1. PERSONAL BRAND NAME: "SHRAVAN YEOLE" */}
          <div className="overflow-hidden mb-2 sm:mb-2.5">
            <h1
              className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-[0.2em] sm:tracking-[0.32em] text-white uppercase inline-flex items-center justify-center flex-wrap gap-x-3 sm:gap-x-5"
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
                      className="inline-block text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
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
                      className="inline-block bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_2px_16px_rgba(99,102,241,0.5)]"
                    >
                      {char}
                    </span>
                  );
                })}
              </span>
            </h1>
          </div>

          {/* 2. SUBTITLE: "CREATIVE DEVELOPER | DESIGNER | DIGITAL CREATOR" */}
          <div
            ref={subtitleRef}
            className="text-[10px] sm:text-xs md:text-sm font-medium uppercase tracking-[0.24em] sm:tracking-[0.36em] text-slate-300/85 opacity-0 text-center max-w-xs sm:max-w-2xl px-2 leading-relaxed"
            style={{ fontFamily: 'var(--font-sans), sans-serif' }}
          >
            <span>Creative Developer</span>
            <span className="mx-2 sm:mx-3 text-violet-400/50">|</span>
            <span>Designer</span>
            <span className="mx-2 sm:mx-3 text-cyan-400/50">|</span>
            <span>Digital Creator</span>
          </div>
        </div>

        {/* ADVANCED PROGRESS INDICATOR (Horizontal Bar + Circular Ring Detail) */}
        <div
          ref={bottomBarRef}
          className="w-full max-w-[560px] flex flex-col items-center opacity-0 z-30 pb-2 sm:pb-3"
        >
          {/* Top Status Row with Circular Ring Detail */}
          <div className="w-full flex items-center justify-between mb-2.5 px-2">
            {/* Label on Left with glowing indicator */}
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#06B6D4]" />
              <span
                className="text-[10px] sm:text-xs tracking-[0.28em] uppercase text-slate-300/85 font-semibold"
                style={{ fontFamily: 'var(--font-sans), sans-serif' }}
              >
                Crafting Your Experience
              </span>
            </div>

            {/* Circular Progress Ring Detail + Numeric Counter */}
            <div className="flex items-center gap-2.5">
              <svg className="w-5 h-5 -rotate-90 pointer-events-none" viewBox="0 0 36 36">
                {/* Background Circle Track */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="3"
                />
                {/* Active Progress Circle Stroke */}
                <path
                  ref={progressCircleRef}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="url(#circleGrad)"
                  strokeWidth="3.5"
                  strokeDasharray="100, 100"
                  strokeDashoffset="100"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Numeric Counter */}
              <span
                ref={counterTextRef}
                className="text-xs sm:text-sm font-mono tracking-wider text-cyan-300 font-bold tabular-nums drop-shadow-[0_0_8px_rgba(6,182,212,0.7)]"
              >
                0%
              </span>
            </div>
          </div>

          {/* Horizontal Progress Track with Luminous Leading Edge */}
          <div className="w-full h-[3.5px] bg-white/[0.08] rounded-full overflow-hidden relative shadow-inner">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400 rounded-full relative"
              style={{
                width: '0%',
                boxShadow: '0 0 16px rgba(6, 182, 212, 0.95), 0 0 4px #06B6D4',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
