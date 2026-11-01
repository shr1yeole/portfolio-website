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
  const portfolioLabelRef = useRef<HTMLDivElement>(null);
  const monogramBoxRef = useRef<HTMLDivElement>(null);
  const monogramSvgRef = useRef<SVGSVGElement>(null);
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

    // Lock body scrolling
    document.body.style.overflow = 'hidden';

    // -------------------------------------------------------------
    // Canvas Particle System with 3D Flowing Wave Meshes & Trails
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

      // Particle colors matching prompt: Indigo, Blue, Cyan, Lavender, White
      const colors = [
        'rgba(99, 102, 241, 0.7)',  // #6366F1 Indigo
        'rgba(59, 130, 246, 0.7)',  // #3B82F6 Blue
        'rgba(6, 182, 212, 0.75)',  // #06B6D4 Cyan
        'rgba(196, 181, 253, 0.6)', // #C4B5FD Pale lavender
        'rgba(255, 255, 255, 0.85)', // #FFFFFF White
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
            s % 2 === 0 ? 'rgba(6, 182, 212, 0.32)' : 'rgba(99, 102, 241, 0.28)';
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
              s % 2 === 0 ? `rgba(6, 182, 212, ${alpha})` : `rgba(99, 102, 241, ${alpha})`;
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
            s % 2 === 0 ? 'rgba(99, 102, 241, 0.28)' : 'rgba(6, 182, 212, 0.32)';
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
              s % 2 === 0 ? `rgba(99, 102, 241, ${alpha})` : `rgba(6, 182, 212, ${alpha})`;
            ctx.shadowColor = '#6366F1';
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

      // ==========================================
      // PHASE 01 — INITIAL APPEARANCE (0.0s – 1.2s)
      // ==========================================
      // 1. Top label: PORTFOLIO
      if (portfolioLabelRef.current) {
        tl.fromTo(
          portfolioLabelRef.current,
          { opacity: 0, y: -8 },
          { opacity: 0.85, y: 0, duration: 1.0, ease: 'power2.out' },
          0.05
        );
      }

      // 2. Light sweep reflection across monogram
      if (sweepRef.current) {
        tl.fromTo(
          sweepRef.current,
          { x: '-150%', opacity: 0 },
          { x: '250%', opacity: 0.85, duration: 1.3, ease: 'power2.inOut' },
          0.05
        );
      }

      // 3. SY Monogram reveal (scale 0.88 -> 1.0, opacity 0 -> 1)
      if (monogramBoxRef.current) {
        tl.fromTo(
          monogramBoxRef.current,
          {
            opacity: 0,
            scale: 0.88,
          },
          {
            opacity: 1,
            scale: 1.0,
            duration: 1.15,
            ease: 'power2.out',
          },
          0.05
        );
      }

      // 4. Soft lavender-blue glow aura around monogram
      if (auraGlowRef.current) {
        tl.fromTo(
          auraGlowRef.current,
          { opacity: 0, scale: 0.7 },
          { opacity: 0.75, scale: 1.0, duration: 1.3, ease: 'power2.out' },
          0.1
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
            y: 26,
            filter: 'blur(6px)',
          },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.75,
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
            opacity: 1,
            y: 0,
            duration: 0.95,
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
      // Subtle depth and gentle camera drift
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

      // Subtle pulse on monogram SVG glow
      if (monogramSvgRef.current) {
        tl.to(
          monogramSvgRef.current,
          {
            filter: 'drop-shadow(0 4px 22px rgba(6, 182, 212, 0.6))',
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

      // 4.7s: Fade and move branding elements & bottom indicator elegantly upward
      const brandingElements = [
        portfolioLabelRef.current,
        monogramBoxRef.current,
        centerBoxRef.current,
        bottomBarRef.current,
      ].filter(Boolean);

      tl.to(
        brandingElements,
        {
          opacity: 0,
          y: -20,
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

      // 4.9s - 6.0s: Curtain vertical panel reveal
      // Pale lavender-blue curtains split open, seamlessly unveiling the light homepage hero
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
      className="fixed inset-0 z-[9999] overflow-hidden select-none bg-transparent pointer-events-auto"
      aria-label="Cinematic entrance intro"
    >
      {/* TOP CURTAIN PANEL (Pale lavender-blue gradient matching homepage) */}
      <div
        ref={topCurtainRef}
        className="absolute top-0 left-0 w-full h-[50.5%] z-10 will-change-transform origin-top"
        style={{ background: 'linear-gradient(to bottom, #F7F9FF 0%, #EEF2FF 100%)' }}
      />

      {/* BOTTOM CURTAIN PANEL (Pale lavender-blue gradient matching homepage) */}
      <div
        ref={bottomCurtainRef}
        className="absolute bottom-0 left-0 w-full h-[50.5%] z-10 will-change-transform origin-bottom"
        style={{ background: 'linear-gradient(to top, #F7F9FF 0%, #EEF2FF 100%)' }}
      />

      {/* ATMOSPHERIC BACKGROUND GRADIENTS & GLOWS (Matching Light Theme Palette) */}
      <div
        ref={atmosphereRef}
        className="absolute inset-0 pointer-events-none z-15 will-change-opacity"
        style={{
          background: `
            radial-gradient(circle at 18% 30%, rgba(99, 102, 241, 0.16) 0%, transparent 55%),
            radial-gradient(circle at 82% 70%, rgba(6, 182, 212, 0.16) 0%, transparent 55%),
            radial-gradient(circle at 50% 50%, rgba(220, 235, 255, 0.7) 0%, rgba(240, 244, 255, 0.5) 50%, transparent 80%),
            #F7F9FF
          `,
        }}
      />

      {/* PARTICLES CANVAS (3D Wave Meshes & Luminous Particles) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-16 pointer-events-none opacity-95 will-change-opacity"
      />

      {/* CENTRAL BRANDING CONTENT */}
      <div
        ref={centerBoxRef}
        className="relative z-20 flex flex-col items-center justify-center w-full h-full px-4 text-center will-change-transform"
      >
        {/* AMBIENT GLOW BEHIND MONOGRAM */}
        <div
          ref={auraGlowRef}
          className="absolute w-80 h-80 sm:w-[440px] sm:h-[440px] rounded-full pointer-events-none blur-3xl opacity-0"
          style={{
            background:
              'radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(6, 182, 212, 0.15) 50%, transparent 75%)',
          }}
        />

        {/* TOP LABEL: PORTFOLIO */}
        <div
          ref={portfolioLabelRef}
          className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.45em] text-[#64748B] mb-5 sm:mb-6 opacity-0"
          style={{ fontFamily: 'var(--font-sans), sans-serif' }}
        >
          PORTFOLIO
        </div>

        {/* 1. LARGE CUSTOM SY MONOGRAM WITH CORNER BRACKETS & CIRCLE */}
        <div
          ref={monogramBoxRef}
          className="relative w-36 h-36 sm:w-44 sm:h-44 mb-6 sm:mb-7 flex items-center justify-center opacity-0 overflow-hidden"
        >
          {/* Subtle light sweep reflection */}
          <div
            ref={sweepRef}
            className="absolute -inset-y-4 -inset-x-8 w-28 bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent rotate-25 pointer-events-none z-25 opacity-0 mix-blend-overlay"
          />

          {/* 4 Corner Brackets (Reference Composition) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox="0 0 160 160"
            fill="none"
          >
            {/* Top Left Bracket */}
            <path
              d="M 22 42 L 22 22 L 42 22"
              stroke="rgba(99, 102, 241, 0.45)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            {/* Top Right Bracket */}
            <path
              d="M 118 22 L 138 22 L 138 42"
              stroke="rgba(99, 102, 241, 0.45)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            {/* Bottom Left Bracket */}
            <path
              d="M 22 118 L 22 138 L 42 138"
              stroke="rgba(99, 102, 241, 0.45)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            {/* Bottom Right Bracket */}
            <path
              d="M 118 138 L 138 138 L 138 118"
              stroke="rgba(99, 102, 241, 0.45)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            {/* Delicate Thin Circle Frame */}
            <circle
              cx="80"
              cy="80"
              r="52"
              stroke="rgba(99, 102, 241, 0.25)"
              strokeWidth="1.2"
            />
          </svg>

          {/* SVG Monogram (Indigo to Blue to Cyan Gradient) */}
          <svg
            ref={monogramSvgRef}
            viewBox="0 0 140 140"
            className="w-22 h-22 sm:w-28 sm:h-28 z-20 transition-all filter drop-shadow-[0_4px_18px_rgba(99,102,241,0.38)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="syLightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="45%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>

            {/* Stylized 'S' stroke */}
            <path
              d="M86 44C81 36 69 34 58 36C45 38 40 47 41 55C42 64 54 68 64 71C77 75 85 81 83 91C81 102 70 107 55 106C42 105 34 97 32 89"
              stroke="url(#syLightGrad)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Stylized 'Y' stroke slicing through */}
            <path
              d="M56 46L73 66M94 42L74 66V102"
              stroke="url(#syLightGrad)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* 2. PERSONAL BRAND NAME: "SHRAVAN YEOLE" */}
        <div className="overflow-hidden mb-2 sm:mb-2.5">
          <h1
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-[0.2em] sm:tracking-[0.34em] text-[#111827] uppercase inline-flex items-center justify-center flex-wrap gap-x-3 sm:gap-x-5"
            style={{ fontFamily: 'var(--font-display), sans-serif' }}
          >
            {/* Word 1: SHRAVAN (Dark Navy) */}
            <span className="inline-flex whitespace-nowrap">
              {wordOne.split('').map((char) => {
                const idx = charCounter++;
                return (
                  <span
                    key={idx}
                    ref={(el) => {
                      nameCharsRef.current[idx] = el;
                    }}
                    className="inline-block text-[#111827]"
                  >
                    {char}
                  </span>
                );
              })}
            </span>

            {/* Word 2: YEOLE (Indigo to Cyan Gradient) */}
            <span className="inline-flex whitespace-nowrap">
              {wordTwo.split('').map((char) => {
                const idx = charCounter++;
                return (
                  <span
                    key={idx}
                    ref={(el) => {
                      nameCharsRef.current[idx] = el;
                    }}
                    className="inline-block bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent"
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
          className="text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-[0.2em] sm:tracking-[0.32em] text-[#64748B] opacity-0 text-center max-w-xs sm:max-w-2xl px-2 leading-relaxed"
          style={{ fontFamily: 'var(--font-sans), sans-serif' }}
        >
          <span>Creative Developer</span>
          <span className="mx-2 sm:mx-3 text-[#6366F1]/40">|</span>
          <span>Designer</span>
          <span className="mx-2 sm:mx-3 text-[#6366F1]/40">|</span>
          <span>Digital Creator</span>
        </div>
      </div>

      {/* 4. PROGRESS BAR & INDICATOR (~520px Width on Desktop) */}
      <div
        ref={bottomBarRef}
        className="absolute bottom-8 sm:bottom-12 inset-x-0 z-20 flex flex-col items-center justify-center pointer-events-none px-4"
      >
        {/* Full ~520px Container */}
        <div className="w-full max-w-[520px] flex flex-col items-center">
          {/* Label on Left, Percentage on Right */}
          <div className="w-full flex items-center justify-between mb-2.5 px-0.5">
            <span
              className="text-[10px] sm:text-xs tracking-[0.28em] uppercase text-[#64748B] font-semibold"
              style={{ fontFamily: 'var(--font-sans), sans-serif' }}
            >
              Crafting Your Experience
            </span>
            <span
              ref={counterTextRef}
              className="text-xs sm:text-sm font-mono tracking-wider text-[#6366F1] font-bold tabular-nums"
            >
              0%
            </span>
          </div>

          {/* Thin Horizontal Track (~520px) */}
          <div className="w-full h-[3px] bg-[#E2E8F0] rounded-full overflow-hidden relative shadow-inner">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-[#6366F1] via-[#3B82F6] to-[#06B6D4] rounded-full relative"
              style={{
                width: '0%',
                boxShadow: '0 0 12px rgba(6, 182, 212, 0.8)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
