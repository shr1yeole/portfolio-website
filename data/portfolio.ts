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
export const WEBSITES: Project[] = [
  {
    id: 'web-1',
    title: 'Business Website Development',
    category: 'Web Development',
    description:
      'Responsive business websites built with clean HTML, CSS, and JavaScript, applying modern UI principles and smooth interactions for a premium user experience.',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    thumbnail: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80',
    image:      'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80',
    githubUrl: 'https://github.com/shravan-yeole',
    liveUrl:   '#',
    featured: true,
  },
  {
    id: 'web-2',
    title: 'Flutter Mobile UI Projects',
    category: 'Mobile Development',
    description:
      'Cross-platform mobile application UIs built with Flutter and Dart — featuring smooth navigation, adaptive layouts, and custom widget components.',
    technologies: ['Flutter', 'Dart', 'Android Studio'],
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    image:      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80',
    githubUrl: 'https://github.com/shravan-yeole',
    liveUrl:   '#',
    featured: true,
  },
  {
    id: 'web-3',
    title: 'Frontend Landing Pages',
    category: 'UI Design & Development',
    description:
      'Pixel-perfect landing pages designed for conversion — built with clean semantic HTML and modern CSS techniques including Flexbox and Grid layouts.',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    thumbnail: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&q=80',
    image:      'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=1200&q=80',
    githubUrl: 'https://github.com/shravan-yeole',
    liveUrl:   '#',
    featured: false,
  },
  {
    id: 'web-4',
    title: 'Client Business Pages',
    category: 'Freelance Web Project',
    description:
      'Custom web pages developed for real clients — focused on mobile responsiveness, accessibility, fast loading, and clean brand representation.',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    image:      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    githubUrl: 'https://github.com/shravan-yeole',
    liveUrl:   '#',
    featured: false,
  },
];

// ─── GRAPHIC DESIGN GALLERY ───────────────────────────────────────────────────
// Replace imageUrl with your Cloudinary-hosted design images when ready.
export const GRAPHIC_DESIGNS: GraphicDesignItem[] = [
  {
    id: 'gd-1',
    title: 'Event Promotion Poster',
    description: 'Bold typographic event poster with vibrant colour grading and layered visual composition.',
    imageUrl: 'https://images.unsplash.com/photo-1493421419110-74f4e85ba126?w=600&q=80',
    category: 'Poster Art',
  },
  {
    id: 'gd-2',
    title: 'Brand Identity Package',
    description: 'Complete brand identity design including logo, colour palette, typography, and usage guidelines.',
    imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80',
    category: 'Branding',
  },
  {
    id: 'gd-3',
    title: 'Restaurant Menu Design',
    description: 'Stylish and appetising restaurant menu design with premium typography and food photography placement.',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
    category: 'Print / Editorial',
  },
  {
    id: 'gd-4',
    title: 'Real Estate Brochure',
    description: 'Elegant property marketing brochure highlighting key amenities and architectural visuals.',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
    category: 'Print / Editorial',
  },
  {
    id: 'gd-5',
    title: 'Wedding Invitation Card',
    description: 'Bespoke wedding invitation design with floral motifs, gold accents, and premium print layout.',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
    category: 'Print / Editorial',
  },
  {
    id: 'gd-6',
    title: 'Social Media Campaign Kit',
    description: 'Cohesive set of social media creatives including posts, stories, and reels covers for Instagram.',
    imageUrl: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&q=80',
    category: 'Branding',
  },
  {
    id: 'gd-7',
    title: 'Product Launch Poster',
    description: 'High-impact product launch poster featuring sleek product photography and modern design language.',
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80',
    category: 'Poster Art',
  },
  {
    id: 'gd-8',
    title: 'Typography Art Series',
    description: 'Experimental typography art exploring type as a visual form — combining letterforms, texture, and negative space.',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
    category: 'Typography',
  },
  {
    id: 'gd-9',
    title: 'Cover Art Design',
    description: 'Striking cover artwork for music singles — blending photography, illustration, and typographic hierarchy.',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
    category: 'Cover Art',
  },
];

// ─── MOTION GRAPHICS SHOWCASE ─────────────────────────────────────────────────
// Replace videoUrl and thumbnailUrl with your Cloudinary-hosted files when ready.
// Using royalty-free sample MP4s from sample-videos.com as temporary placeholders.
export const MOTION_GRAPHICS: MotionGraphicItem[] = [
  {
    id: 'mg-1',
    title: 'Brand Promo Animation',
    description: 'Promotional motion graphics animation built for a client brand launch — featuring kinetic text, logo reveals, and smooth transitions.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1536240478700-b869ad10e2c2?w=800&q=80',
    technologies: ['Adobe After Effects', 'Premiere Pro'],
  },
  {
    id: 'mg-2',
    title: 'Social Media Motion Graphics',
    description: 'Eye-catching animated creatives designed for Instagram Reels and Stories — optimised for maximum engagement and shareability.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80',
    technologies: ['Adobe After Effects', 'Canva'],
  },
  {
    id: 'mg-3',
    title: 'Logo Reveal Animation',
    description: 'Premium animated logo reveal sequence crafted with particle effects, light leaks, and motion blur for a cinematic feel.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
    technologies: ['Adobe After Effects'],
  },
];

// ─── VIDEO EDITING PORTFOLIO ──────────────────────────────────────────────────
// Replace videoUrl and thumbnailUrl with your Cloudinary-hosted files when ready.
export const VIDEOS: VideoPortfolioItem[] = [
  {
    id: 'vid-1',
    title: 'Instagram Reels Edit',
    description: 'Fast-paced Instagram Reel edits with trending audio synchronization, smooth transitions, and colour grading for maximum reach.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80',
    category: 'Instagram Reels',
  },
  {
    id: 'vid-2',
    title: 'Commercial Advertisement',
    description: 'Professional commercial advertisement video featuring product showcases, voiceover integration, and broadcast-ready colour grading.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&q=80',
    category: 'Commercial Advertisements',
  },
  {
    id: 'vid-3',
    title: 'Business Promotional Video',
    description: 'Engaging promotional video for a local business — showcasing services, testimonials, and brand values with smooth cinematic cuts.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80',
    category: 'Promotional Videos',
  },
  {
    id: 'vid-4',
    title: 'Corporate Presentation Edit',
    description: 'Clean and professional corporate video edit with branded lower thirds, infographic animations, and polished audio mixing.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80',
    category: 'Corporate Videos',
  },
];

// ─── BRANDS / CLIENTS WORKED WITH ─────────────────────────────────────────────
// logoUrl is optional — a text fallback is shown if not provided.
// Replace logoUrl with your Cloudinary-hosted logo images when ready.
export const BRANDS: Brand[] = [
  { name: 'Social Sparks',                       logoUrl: '' },
  { name: 'Trendo Media',                        logoUrl: '' },
  { name: '3D Planet',                           logoUrl: '' },
  { name: 'Cocorico',                            logoUrl: '' },
  { name: 'Ujjwal Electronics',                  logoUrl: '' },
  { name: 'Sirade Infra',                        logoUrl: '' },
  { name: "Dada's IT Services & Security Solution", logoUrl: '' },
];
