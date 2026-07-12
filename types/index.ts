export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  thumbnail: string; // Cloudinary URL
  image: string; // Cloudinary URL
  videoUrl?: string; // Cloudinary URL (optional)
  githubUrl?: string;
  liveUrl?: string;
  caseStudyUrl?: string;
  featured?: boolean;
}

export interface GraphicDesignItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string; // Cloudinary URL
  category: string;
}

export interface MotionGraphicItem {
  id: string;
  title: string;
  description: string;
  videoUrl: string; // Cloudinary URL
  thumbnailUrl: string; // Cloudinary URL
  technologies: string[];
}

export interface VideoPortfolioItem {
  id: string;
  title: string;
  description: string;
  videoUrl: string; // Cloudinary URL
  thumbnailUrl: string; // Cloudinary URL
  category: string;
}

export interface Skill {
  name: string;
  level: number; // 0 to 100
  category: 'Development' | 'Creative' | 'Marketing' | 'Tools';
  icon?: string;
}

export interface Brand {
  name: string;
  logoUrl?: string; // Cloudinary URL (optional – falls back to text)
}

export interface NavItem {
  label: string;
  href: string;
}
