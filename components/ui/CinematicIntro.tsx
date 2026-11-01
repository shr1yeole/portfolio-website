'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface CinematicIntroProps {
  onComplete?: () => void;
}

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const topCurtainRef = useRef<HTMLDivElement>(null);
  const bottomCurtainRef = useRef<HTMLDivElement>(null);
  const seamLineRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const SESSION_KEY = 'shravan_portfolio_intro_seen';

    // 1. Accessibility: Respect prefers-reduced-motion
    try {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        onComplete?.();
        return;
      }

      // Check session storage
      const alreadySeen = sessionStorage.getItem(SESSION_KEY);
      if (alreadySeen === 'true') {
        onComplete?.();
        return;
      }

      // Set session flag immediately
      sessionStorage.setItem(SESSION_KEY, 'true');
    } catch {
      // Graceful fallback if storage is restricted
    }

    // Mount intro and prevent body scrolling
    setIsVisible(true);
    document.body.style.overflow = 'hidden';

    // 2. High-Performance Canvas Particles
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

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 25 : 55;

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    if (canvas) {
      const ctx = canvas.getContext('2d');
      handleResize();
      window.addEventListener('resize', handleResize);

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -0.2 - Math.random() * 0.4,
          radius: Math.random() * 1.4 + 0.6,
          alpha: Math.random() * 0.5 + 0.2,
          seed: Math.random() * 50,
        });
      }

      let t = 0;
      const render = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        t += 0.015;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx + Math.sin(t + p.seed) * 0.25;
          p.y += p.vy;

          if (p.y < -10) p.y = canvas.height + 10;
          if (p.x < -10) p.x = canvas.width + 10;
          if (p.x > canvas.width + 10) p.x = -10;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(214, 184, 135, ${p.alpha})`;
          ctx.shadowColor = '#D6B887';
          ctx.shadowBlur = p.radius * 2.5;
          ctx.fill();
        }

        animId = requestAnimationFrame(render);
      };

      animId = requestAnimationFrame(render);
    }

    // 3. GSAP Master Timeline (Coordinated 6.0 Seconds Duration)
    const ctxGsap = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = '';
          setIsVisible(false);
          onComplete?.();
        },
      });

      const counterState = { val: 0 };

      // ==========================================
      // PHASE 01 — INITIAL APPEARANCE (0.0s – 1.2s)
      // ==========================================
      // Light sweep reflection across monogram
      if (sweepRef.current) {
        tl.fromTo(
          sweepRef.current,
          { x: '-160%', opacity: 0 },
          { x: '260%', opacity: 0.75, duration: 1.3, ease: 'power2.inOut' },
          0.05
        );
      }

      // SY Monogram reveal (scale 0.9 -> 1.0, subtle fade-in, champagne glow)
      if (monogramBoxRef.current) {
        tl.fromTo(
          monogramBoxRef.current,
          {
            opacity: 0,
            scale: 0.9,
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

      // Soft champagne-gold glow around monogram
      if (auraGlowRef.current) {
        tl.fromTo(
          auraGlowRef.current,
          { opacity: 0, scale: 0.75 },
          { opacity: 0.65, scale: 1.0, duration: 1.3, ease: 'power2.out' },
          0.1
        );
      }

      // ==========================================
      // PHASE 02 — PERSONAL BRAND REVEAL (1.2s – 2.8s)
      // ==========================================
      // Staggered reveal of "SHRAVAN YEOLE"
      const validChars = nameCharsRef.current.filter(Boolean);
      if (validChars.length > 0) {
        tl.fromTo(
          validChars,
          {
            opacity: 0,
            y: 26,
            filter: 'blur(5px)',
          },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.75,
            stagger: 0.038,
            ease: 'power3.out',
          },
          1.15
        );
      }

      // Subtitle reveal: smooth fade & upward movement
      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          {
            opacity: 0,
            y: 12,
            letterSpacing: '0.2em',
          },
          {
            opacity: 0.85,
            y: 0,
            letterSpacing: window.innerWidth < 640 ? '0.22em' : '0.34em',
            duration: 0.95,
            ease: 'power2.out',
          },
          1.65
        );
      }

      // ==========================================
      // PROGRESS INDICATOR: 0% to 100% (0.0s – 4.65s)
      // Synchronized with timeline
      // ==========================================
      tl.to(
        counterState,
        {
          val: 100,
          duration: 4.6,
          ease: 'power1.inOut',
          onUpdate: () => {
            if (counterTextRef.current) {
              counterTextRef.current.textContent = `${Math.floor(counterState.val)}%`;
            }
          },
        },
        0.05
      );

      if (progressBarRef.current) {
        tl.to(
          progressBarRef.current,
          {
            width: '100%',
            duration: 4.6,
            ease: 'power1.inOut',
          },
          0.05
        );
      }

      // ==========================================
      // PHASE 03 — CINEMATIC VISUAL MOVEMENT (2.8s – 4.5s)
      // ==========================================
      // Gentle depth & camera drift
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

      // Subtle pulse on monogram SVG
      if (monogramSvgRef.current) {
        tl.to(
          monogramSvgRef.current,
          {
            filter: 'drop-shadow(0 0 20px rgba(214, 184, 135, 0.7))',
            duration: 1.5,
            ease: 'sine.inOut',
          },
          2.8
        );
      }

      // ==========================================
      // PHASE 04 — FINAL REVEAL (4.5s – 6.0s)
      // ==========================================
      // 4.35s: Intensify central light / bloom
      if (auraGlowRef.current) {
        tl.to(
          auraGlowRef.current,
          {
            opacity: 0.95,
            scale: 1.35,
            duration: 0.4,
            ease: 'power2.in',
          },
          4.35
        );
      }

      // 4.65s: Fade and move branding elements & bottom indicator elegantly upward
      const brandingElements = [
        monogramBoxRef.current,
        centerBoxRef.current,
        bottomBarRef.current,
      ].filter(Boolean);

      tl.to(
        brandingElements,
        {
          opacity: 0,
          y: -18,
          duration: 0.45,
          ease: 'power2.in',
        },
        4.65
      );

      // Fade out atmosphere & particles before curtains split so reveal is crystal clear
      if (atmosphereRef.current) {
        tl.to(
          atmosphereRef.current,
          {
            opacity: 0,
            duration: 0.35,
            ease: 'power2.out',
          },
          4.65
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
          4.65
        );
      }

      // 4.88s: Seam line expands and dissolves
      if (seamLineRef.current) {
        tl.to(
          seamLineRef.current,
          {
            opacity: 0,
            scaleX: 1.4,
            duration: 0.3,
            ease: 'power2.out',
          },
          4.85
        );
      }

      // 4.9s - 6.0s: Curtain vertical panel reveal
      // Top curtain moves up, bottom curtain moves down, uncovering the homepage underneath
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

      // Disable pointer events on container as curtains open so homepage is immediately interactive
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
  }, [onComplete]);

  if (!isVisible) return null;

  const brandName = 'SHRAVAN YEOLE';

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
            'radial-gradient(ellipse at 50% 48%, rgba(38, 30, 20, 0.45) 0%, rgba(12, 10, 8, 0.85) 52%, #050505 85%)',
        }}
      />

      {/* PARTICLES CANVAS */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-16 pointer-events-none opacity-80 will-change-opacity"
      />

      {/* FILM GRAIN TEXTURE OVERLAY */}
      <div
        className="absolute inset-0 pointer-events-none z-17 opacity-[0.038] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* HORIZONTAL SEAM LINE */}
      <div
        ref={seamLineRef}
        className="absolute top-1/2 left-0 w-full h-[1px] -translate-y-1/2 z-20 pointer-events-none bg-gradient-to-r from-transparent via-[#D6B887]/70 to-transparent"
      />

      {/* CENTRAL BRANDING CONTENT */}
      <div
        ref={centerBoxRef}
        className="relative z-20 flex flex-col items-center justify-center w-full h-full px-4 text-center will-change-transform"
      >
        {/* AMBIENT GLOW BEHIND MONOGRAM */}
        <div
          ref={auraGlowRef}
          className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full pointer-events-none blur-3xl opacity-0"
          style={{
            background:
              'radial-gradient(circle, rgba(214, 184, 135, 0.4) 0%, rgba(214, 184, 135, 0.1) 50%, transparent 75%)',
          }}
        />

        {/* SY MONOGRAM CONTAINER */}
        <div
          ref={monogramBoxRef}
          className="relative w-28 h-28 sm:w-36 sm:h-36 mb-6 sm:mb-8 flex items-center justify-center opacity-0 overflow-hidden"
        >
          {/* Subtle light sweep reflection */}
          <div
            ref={sweepRef}
            className="absolute -inset-y-4 -inset-x-8 w-24 bg-gradient-to-r from-transparent via-[#FFF4DE]/40 to-transparent rotate-25 pointer-events-none z-25 opacity-0 mix-blend-screen"
          />

          {/* Luxury Geometric Border Frame */}
          <div className="absolute inset-0 rounded-2xl border border-[#D6B887]/25 rotate-45 scale-80 pointer-events-none" />
          <div className="absolute inset-1 rounded-2xl border border-[#D6B887]/15 rotate-45 scale-90 pointer-events-none" />

          {/* SVG Monogram */}
          <svg
            ref={monogramSvgRef}
            viewBox="0 0 120 120"
            className="w-18 h-18 sm:w-24 sm:h-24 z-20 filter drop-shadow-[0_2px_14px_rgba(214,184,135,0.45)] transition-all"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="champagneGoldGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#FFF2D6" />
                <stop offset="35%" stopColor="#E5C795" />
                <stop offset="70%" stopColor="#D6B887" />
                <stop offset="100%" stopColor="#8C6835" />
              </linearGradient>
            </defs>

            {/* Corner diamond dots */}
            <circle cx="60" cy="10" r="1.5" fill="#D6B887" />
            <circle cx="60" cy="110" r="1.5" fill="#D6B887" />
            <circle cx="10" cy="60" r="1.5" fill="#D6B887" />
            <circle cx="110" cy="60" r="1.5" fill="#D6B887" />

            {/* Stylized 'S' */}
            <path
              d="M74 38C70 31 60 29 50 31C39 33 34 40 35 48C36 56 46 59 55 62C66 65 73 70 72 79C71 88 61 93 48 92C37 91 30 84 28 77"
              stroke="url(#champagneGoldGrad)"
              strokeWidth="4.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Stylized 'Y' */}
            <path
              d="M48 40L63 56M82 36L64 56V88"
              stroke="url(#champagneGoldGrad)"
              strokeWidth="4.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* PERSONAL BRAND NAME: "SHRAVAN YEOLE" */}
        <div className="overflow-hidden mb-3 sm:mb-4">
          <h1
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[0.22em] sm:tracking-[0.34em] text-[#F5F1E8] uppercase inline-flex items-center justify-center flex-wrap"
            style={{ fontFamily: 'var(--font-display), sans-serif' }}
          >
            {brandName.split('').map((char, index) => (
              <span
                key={index}
                ref={(el) => {
                  nameCharsRef.current[index] = el;
                }}
                className={`inline-block ${
                  char === ' ' ? 'w-3 sm:w-5' : ''
                } bg-gradient-to-b from-[#FFFFFF] via-[#F5F1E8] to-[#D6B887] bg-clip-text text-transparent`}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>
        </div>

        {/* SUBTITLE: "CREATIVE DEVELOPER | DESIGNER | DIGITAL CREATOR" */}
        <div
          ref={subtitleRef}
          className="text-[9px] sm:text-[11px] md:text-xs font-medium uppercase tracking-[0.2em] sm:tracking-[0.32em] text-[#D6B887]/85 opacity-0 max-w-xl mx-auto px-2"
          style={{ fontFamily: 'var(--font-sans), sans-serif' }}
        >
          <span>Creative Developer</span>
          <span className="mx-2 sm:mx-3 text-[#D6B887]/40">|</span>
          <span>Designer</span>
          <span className="mx-2 sm:mx-3 text-[#D6B887]/40">|</span>
          <span>Digital Creator</span>
        </div>
      </div>

      {/* MINIMAL BOTTOM LOADING INDICATOR */}
      <div
        ref={bottomBarRef}
        className="absolute bottom-8 sm:bottom-12 inset-x-0 z-20 flex flex-col items-center justify-center pointer-events-none px-4"
      >
        {/* Label */}
        <span
          className="text-[9px] sm:text-[10px] tracking-[0.28em] uppercase text-[#F5F1E8]/60 font-semibold mb-2.5"
          style={{ fontFamily: 'var(--font-sans), sans-serif' }}
        >
          Crafting Your Experience
        </span>

        {/* Thin champagne gold horizontal progress bar */}
        <div className="w-48 sm:w-64 h-[1.5px] bg-[#1a1a1a] rounded-full overflow-hidden relative mb-2">
          <div
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-[#8C6D3B] via-[#D6B887] to-[#FFF2D6] w-0 rounded-full"
          />
        </div>

        {/* Numerical percentage counter */}
        <span
          ref={counterTextRef}
          className="text-[10px] sm:text-xs font-mono tracking-widest text-[#D6B887] font-medium"
        >
          0%
        </span>
      </div>
    </div>
  );
}
