'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getOptimizedVideoUrl } from '@/lib/cloudinary';

interface VideoPlayerProps {
  src: string;
  poster: string;
  autoplayOnHover?: boolean;
  className?: string;
}

export function VideoPlayer({
  src,
  poster,
  autoplayOnHover = false,
  className,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);

  // Lazy loading using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (!entry.isIntersecting && videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Handle hover play (e.g. for Motion Graphics section)
  useEffect(() => {
    if (!autoplayOnHover || !videoRef.current || !isIntersecting) return;

    if (isHovered) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay failed or was interrupted (e.g. browser permissions)
          });
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isHovered, autoplayOnHover, isIntersecting]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    if (duration > 0) {
      setProgress((current / duration) * 100);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * videoRef.current.duration;
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen().catch(() => {});
    }
  };

  const optimizedSrc = getOptimizedVideoUrl(src);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={togglePlay}
      className={cn(
        'relative aspect-video rounded-2xl overflow-hidden cursor-pointer group glass border border-white/15 shadow-2xl',
        className
      )}
    >
      {/* Video Source */}
      {isIntersecting && (
        <video
          ref={videoRef}
          src={optimizedSrc}
          poster={poster}
          loop
          muted={autoplayOnHover || isMuted}
          playsInline
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}

      {/* Poster image placeholder during lazy loading */}
      {!isIntersecting && poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt="Video thumbnail"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}

      {/* Gradient Overlay for Controls */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 transition-opacity duration-300',
          isHovered || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Play/Pause Giant Center Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/80 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg shadow-primary/40 transform scale-100 hover:scale-110 active:scale-95 transition-all duration-300">
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </div>
          </div>
        )}

        {/* Custom Progress Bar */}
        <div
          onClick={handleProgressClick}
          className="h-1.5 w-full bg-white/30 rounded-full mb-4 cursor-pointer relative overflow-hidden group/bar"
        >
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Bottom controls panel */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-white text-white" />
              ) : (
                <Play className="w-5 h-5 fill-white text-white" />
              )}
            </button>

            <button
              onClick={toggleMute}
              className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
            >
              {isMuted || autoplayOnHover ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </button>
          </div>

          <button
            onClick={handleFullscreen}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <Maximize className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
export default VideoPlayer;
