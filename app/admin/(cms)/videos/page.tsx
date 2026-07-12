import { ProjectsManager } from '@/components/admin/ProjectsManager';

export default function VideosPage() {
  return (
    <ProjectsManager 
      title="Video Editing" 
      defaultCategory="Video Editing" 
      allowedCategories={['Video Editing', 'Other']} 
    />
  );
}
