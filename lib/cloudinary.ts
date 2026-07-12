/**
 * Cloudinary Centralized Configuration and Utilities
 */

export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo',
  // Base URL for Cloudinary assets
  baseUrl: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo'}`,
};

/**
 * Optimizes an image URL from Cloudinary by inserting standard optimization parameters.
 * If the URL is not a Cloudinary URL, it returns the URL unchanged.
 */
export function getOptimizedImageUrl(url: string, width?: number, height?: number): string {
  if (!url) return '';
  if (!url.includes('res.cloudinary.com')) return url;

  // Find where to insert the transformations in the Cloudinary URL (after /upload/)
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;

  const insertIndex = uploadIndex + '/upload/'.length;
  
  // Create transformations
  const transforms = ['f_auto', 'q_auto'];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  
  const transformString = transforms.join(',') + '/';
  
  return url.slice(0, insertIndex) + transformString + url.slice(insertIndex);
}

/**
 * Optimizes a video URL from Cloudinary.
 */
export function getOptimizedVideoUrl(url: string): string {
  if (!url) return '';
  if (!url.includes('res.cloudinary.com')) return url;

  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;

  const insertIndex = uploadIndex + '/upload/'.length;
  
  // Standard video optimization: auto quality, auto format (switches to webm/mp4 based on browser)
  const transformString = 'f_auto,q_auto,vc_auto/';
  
  return url.slice(0, insertIndex) + transformString + url.slice(insertIndex);
}
