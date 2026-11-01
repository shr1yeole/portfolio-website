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
    // Canvas Particle System with Device Pixel Ratio & Light Waves
    // -------------------------------------------------------------
    const canvas = canvasRef.current;
    let animId: number;
    let particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      seed: number;
    }[] = [];

    let waves: {
      x: number;
      y: number;
      r: number;
      alpha: number;
      vx: number;
      vy: number;
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

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.45,
          vy: -0.35 - Math.random() * 0.55,
          radius: Math.random() * 2.2 + 1.2,
          alpha: Math.random() * 0.45 + 0.4,
          seed: Math.random() * 100,
        });
      }

      // Ambient glowing light streak waves
      waves = [
        {
          x: window.innerWidth * 0.25,
          y: window.innerHeight * 0.4,
          r: 90,
          alpha: 0.12,
          vx: 0.2,
          vy: -0.1,
        },
        {
          x: window.innerWidth * 0.75,
          y: window.innerHeight * 0.55,
          r: 120,
          alpha: 0.1,
          vx: -0.15,
          vy: -0.12,
        },
        {
          x: window.innerWidth * 0.5,
          y: window.innerHeight * 0.75,
          r: 80,
          alpha: 0.08,
          vx: 0.1,
          vy: -0.18,
        },
      ];

      let t = 0;
      const render = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        t += 0.016;

        // Draw ambient wave blooms
        for (let i = 0; i < waves.length; i++) {
          const w = waves[i];
          w.x += w.vx;
          w.y += w.vy;
          if (w.y < -w.r) w.y = window.innerHeight + w.r;
          if (w.x < -w.r) w.x = window.innerWidth + w.r;
          if (w.x > window.innerWidth + w.r) w.x = -w.r;

          const grad = ctx.createRadialGradient(w.x, w.y, 0, w.x, w.y, w.r);
          grad.addColorStop(0, `rgba(214, 184, 135, ${w.alpha})`);
          grad.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        // Draw ambient floating champagne particles with glowing halo
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx + Math.cos(t * 0.6 + p.seed) * 0.4;
          p.y += p.vy + Math.sin(t * 0.8 + p.seed) * 0.25;

          if (p.y < -15) p.y = window.innerHeight + 15;
          if (p.x < -15) p.x = window.innerWidth + 15;
          if (p.x > window.innerWidth + 15) p.x = -15;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(214, 184, 135, ${p.alpha})`;
          ctx.shadowColor = '#D6B887';
          ctx.shadowBlur = p.radius * 3.5;
          ctx.fill();
        }

        animId = requestAnimationFrame(render);
      };

      animId = requestAnimationFrame(render);
    }

    // -------------------------------------------------------------
    // GSAP Master Timeline (Exactly 6.0 Seconds)
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
      // 1. Light sweep reflection across monogram
      if (sweepRef.current) {
        tl.fromTo(
          sweepRef.current,
          { x: '-150%', opacity: 0 },
          { x: '250%', opacity: 0.85, duration: 1.3, ease: 'power2.inOut' },
          0.05
        );
      }

      // 2. SY Monogram reveal (scale 0.88 -> 1.0, opacity 0 -> 1)
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

      // 3. Soft champagne-gold glow aura around monogram
      if (auraGlowRef.current) {
        tl.fromTo(
          auraGlowRef.current,
          { opacity: 0, scale: 0.7 },
          { opacity: 0.7, scale: 1.0, duration: 1.3, ease: 'power2.out' },
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
            y: 28,
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

      // 2. Subtitle reveal: smooth fade & upward glide
      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          {
            opacity: 0,
            y: 14,
          },
          {
            opacity: 0.9,
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
            filter: 'drop-shadow(0 0 25px rgba(214, 184, 135, 0.75))',
            duration: 1.5,
            ease: 'sine.inOut',
          },
          2.8
        );
      }

      // ==========================================
      // PHASE 04 — FINAL REVEAL (4.5s – 6.0s)
      // ==========================================
      // 4.35s: Central light slight intensification / bloom
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
      // Top curtain moves up, bottom curtain moves down, seamlessly unveiling the homepage
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
      {/* TOP CURTAIN PANEL (covers top 50.5% to avoid sub-pixel gaps) */}
      <div
        ref={topCurtainRef}
        className="absolute top-0 left-0 w-full h-[50.5%] bg-[#050505] z-10 will-change-transform origin-top"
      />

      {/* BOTTOM CURTAIN PANEL (covers bottom 50.5% to avoid sub-pixel gaps) */}
      <div
        ref={bottomCurtainRef}
        className="absolute bottom-0 left-0 w-full h-[50.5%] bg-[#050505] z-10 will-change-transform origin-bottom"
      />

      {/* ATMOSPHERIC GRADIENTS & LIGHTING */}
      <div
        ref={atmosphereRef}
        className="absolute inset-0 pointer-events-none z-15 will-change-opacity"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, rgba(46, 36, 22, 0.6) 0%, rgba(16, 13, 9, 0.92) 50%, #050505 85%)',
        }}
      />

      {/* PARTICLES CANVAS */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-16 pointer-events-none opacity-95 will-change-opacity"
      />

      {/* FILM GRAIN TEXTURE OVERLAY */}
      <div
        className="absolute inset-0 pointer-events-none z-17 opacity-[0.045] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
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
              'radial-gradient(circle, rgba(214, 184, 135, 0.5) 0%, rgba(214, 184, 135, 0.15) 50%, transparent 75%)',
          }}
        />

        {/* 1. CUSTOM SY MONOGRAM */}
        <div
          ref={monogramBoxRef}
          className="relative w-28 h-28 sm:w-36 sm:h-36 mb-6 sm:mb-8 flex items-center justify-center opacity-0 overflow-hidden"
        >
          {/* Subtle light sweep reflection */}
          <div
            ref={sweepRef}
            className="absolute -inset-y-4 -inset-x-8 w-28 bg-gradient-to-r from-transparent via-[#FFF8E7]/50 to-transparent rotate-25 pointer-events-none z-25 opacity-0 mix-blend-screen"
          />

          {/* Luxury Geometric Border Frame */}
          <div className="absolute inset-0 rounded-2xl border border-[#D6B887]/35 rotate-45 scale-80 pointer-events-none" />
          <div className="absolute inset-1.5 rounded-2xl border border-[#D6B887]/20 rotate-45 scale-90 pointer-events-none" />

          {/* SVG Monogram */}
          <svg
            ref={monogramSvgRef}
            viewBox="0 0 140 140"
            className="w-20 h-20 sm:w-28 sm:h-28 z-20 transition-all filter drop-shadow-[0_2px_18px_rgba(214,184,135,0.6)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="syGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF8E7" />
                <stop offset="35%" stopColor="#E8CCA0" />
                <stop offset="70%" stopColor="#D6B887" />
                <stop offset="100%" stopColor="#967746" />
              </linearGradient>
            </defs>

            {/* Corner diamond dots */}
            <circle cx="70" cy="10" r="2" fill="#D6B887" />
            <circle cx="70" cy="130" r="2" fill="#D6B887" />
            <circle cx="10" cy="70" r="2" fill="#D6B887" />
            <circle cx="130" cy="70" r="2" fill="#D6B887" />

            {/* Stylized 'S' stroke */}
            <path
              d="M86 44C81 36 69 34 58 36C45 38 40 47 41 55C42 64 54 68 64 71C77 75 85 81 83 91C81 102 70 107 55 106C42 105 34 97 32 89"
              stroke="url(#syGoldGrad)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Stylized 'Y' stroke */}
            <path
              d="M56 46L73 66M94 42L74 66V102"
              stroke="url(#syGoldGrad)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* 2. PERSONAL BRAND NAME: "SHRAVAN YEOLE" */}
        <div className="overflow-hidden mb-3 sm:mb-4">
          <h1
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[0.18em] sm:tracking-[0.32em] text-[#F5F1E8] uppercase inline-flex items-center justify-center flex-wrap gap-x-3 sm:gap-x-5"
            style={{ fontFamily: 'var(--font-display), sans-serif' }}
          >
            {/* Word 1: SHRAVAN */}
            <span className="inline-flex whitespace-nowrap">
              {wordOne.split('').map((char) => {
                const idx = charCounter++;
                return (
                  <span
                    key={idx}
                    ref={(el) => {
                      nameCharsRef.current[idx] = el;
                    }}
                    className="inline-block bg-gradient-to-b from-[#FFFFFF] via-[#F5F1E8] to-[#D6B887] bg-clip-text text-transparent"
                  >
                    {char}
                  </span>
                );
              })}
            </span>

            {/* Word 2: YEOLE */}
            <span className="inline-flex whitespace-nowrap">
              {wordTwo.split('').map((char) => {
                const idx = charCounter++;
                return (
                  <span
                    key={idx}
                    ref={(el) => {
                      nameCharsRef.current[idx] = el;
                    }}
                    className="inline-block bg-gradient-to-b from-[#FFFFFF] via-[#F5F1E8] to-[#D6B887] bg-clip-text text-transparent"
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
          className="text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-[0.16em] sm:tracking-[0.32em] text-[#D6B887] opacity-0 max-w-xs sm:max-w-2xl md:max-w-3xl mx-auto px-2 text-center sm:whitespace-nowrap leading-relaxed"
          style={{ fontFamily: 'var(--font-sans), sans-serif' }}
        >
          <span>Creative Developer</span>
          <span className="mx-2 sm:mx-3 text-[#D6B887]/50">|</span>
          <span>Designer</span>
          <span className="mx-2 sm:mx-3 text-[#D6B887]/50">|</span>
          <span>Digital Creator</span>
        </div>
      </div>

      {/* 4. PROGRESS BAR & INDICATOR */}
      <div
        ref={bottomBarRef}
        className="absolute bottom-8 sm:bottom-12 inset-x-0 z-20 flex flex-col items-center justify-center pointer-events-none px-4"
      >
        {/* Label */}
        <span
          className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#F5F1E8]/70 font-semibold mb-3"
          style={{ fontFamily: 'var(--font-sans), sans-serif' }}
        >
          Crafting Your Experience
        </span>

        {/* Progress Track & Beside Percentage */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Progress Bar Track: 280–320px on desktop */}
          <div className="w-56 sm:w-72 md:w-80 h-[3.5px] bg-[#1a1a1a] rounded-full overflow-hidden relative shadow-inner">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-[#967746] via-[#D6B887] to-[#FFF7E6] rounded-full relative"
              style={{
                width: '0%',
                boxShadow: '0 0 12px rgba(214, 184, 135, 0.9)',
              }}
            />
          </div>

          {/* Numerical percentage counter */}
          <span
            ref={counterTextRef}
            className="text-xs sm:text-sm font-mono tracking-wider text-[#D6B887] font-semibold w-12 text-right tabular-nums"
          >
            0%
          </span>
        </div>
      </div>
    </div>
  );
}
