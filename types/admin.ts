// ─── Admin Firestore Document Types ───────────────────────────────────────────

export interface AdminProject {
  id: string;
  title: string;
  category: string;
  customCategory?: string;
  description: string;
  clientName?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  thumbnail: string;
  image: string;
  videoUrl?: string;
  projectDate?: string;
  featured: boolean;
  status: 'Published' | 'Draft';
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminWebsite {
  id: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  thumbnail: string;
  image: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminGraphic {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  category: string;
  duration?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminMotion {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  technologies: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminBrand {
  id: string;
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type RequirementStatus = 'New' | 'In Progress' | 'Completed';

export interface AdminRequirement {
  id: string;
  clientName: string;
  companyName?: string;
  phone?: string;
  email?: string;
  projectType: string;
  budget?: string;
  deadline?: string;
  description: string;
  status: RequirementStatus;
  source: 'contact_form' | 'inquiry_form' | 'manual';
  submittedAt: string;
  updatedAt: string;
}

export interface AdminSettings {
  id: string;
  // Portfolio Info
  bio: string;
  tagline: string;
  // Social Links
  socialLinks: {
    github: string;
    linkedin: string;
    instagram: string;
  };
  resumeUrl: string;
  // Admin credentials are in env vars (not stored in DB)
  updatedAt: string;
}

export interface SessionPayload {
  username: string;
  role: 'admin';
  iat?: number;
  exp?: number;
}

export interface DashboardStats {
  projects: number;
  websites: number;
  graphics: number;
  videos: number;
  motion: number;
  brands: number;
  requirements: number;
  newRequirements: number;
}
