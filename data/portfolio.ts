import { Project, GraphicDesignItem, MotionGraphicItem, VideoPortfolioItem, Skill, Brand } from '../types';

// ─── SKILLS ───────────────────────────────────────────────────────────────────
export const SKILLS: Skill[] = [
  // Development
  { name: 'HTML & CSS', level: 90, category: 'Development' },
  { name: 'JavaScript', level: 80, category: 'Development' },
  { name: 'Java', level: 72, category: 'Development' },
  { name: 'Flutter (Dart)', level: 75, category: 'Development' },
  { name: 'API Integration', level: 70, category: 'Development' },
  { name: 'Git & GitHub', level: 82, category: 'Development' },

  // Creative
  { name: 'Graphic Design', level: 90, category: 'Creative' },
  { name: 'Motion Graphics', level: 85, category: 'Creative' },
  { name: 'Video Editing', level: 88, category: 'Creative' },
  { name: 'UI/UX Design', level: 78, category: 'Creative' },
  { name: 'Brand Identity Design', level: 82, category: 'Creative' },
  { name: 'Social Media Creatives', level: 88, category: 'Creative' },

  // Marketing
  { name: 'Social Media Marketing', level: 78, category: 'Marketing' },
  { name: 'WordPress', level: 65, category: 'Marketing' },
  { name: 'Meta Ads', level: 65, category: 'Marketing' },

  // Tools
  { name: 'Adobe Premiere Pro', level: 88, category: 'Tools' },
  { name: 'Adobe After Effects', level: 85, category: 'Tools' },
  { name: 'DaVinci Resolve', level: 80, category: 'Tools' },
  { name: 'Canva', level: 92, category: 'Tools' },
  { name: 'Adobe Photoshop', level: 82, category: 'Tools' },
  { name: 'Visual Studio Code', level: 90, category: 'Tools' },
];

// ─── WEBSITE PORTFOLIO ────────────────────────────────────────────────────────
// Replace thumbnail/image with your Cloudinary URLs when ready.
export const WEBSITES: Project[] = [];

// ─── GRAPHIC DESIGN GALLERY ───────────────────────────────────────────────────
// Replace imageUrl with your Cloudinary-hosted design images when ready.
export const GRAPHIC_DESIGNS: GraphicDesignItem[] = [];

// ─── MOTION GRAPHICS SHOWCASE ─────────────────────────────────────────────────
// Replace videoUrl and thumbnailUrl with your Cloudinary-hosted files when ready.
// Using royalty-free sample MP4s from sample-videos.com as temporary placeholders.
export const MOTION_GRAPHICS: MotionGraphicItem[] = [];

// ─── VIDEO EDITING PORTFOLIO ──────────────────────────────────────────────────
// Replace videoUrl and thumbnailUrl with your Cloudinary-hosted files when ready.
export const VIDEOS: VideoPortfolioItem[] = [];

// ─── BRANDS / CLIENTS WORKED WITH ─────────────────────────────────────────────
// logoUrl is optional — a text fallback is shown if not provided.
// Replace logoUrl with your Cloudinary-hosted logo images when ready.
export const BRANDS: Brand[] = [
  { name: 'Sirade Infra', logoUrl: '' },
  { name: 'Ujjwal Electronics', logoUrl: '' },
  { name: 'Trendo Media', logoUrl: '' },
  { name: 'Cocorico', logoUrl: '' },
  { name: '3D Planet', logoUrl: '' },
  { name: 'Dada IT Services', logoUrl: '' },
  { name: 'Social Spark', logoUrl: '' },
  { name: 'Royalsuns', logoUrl: '' },
];
