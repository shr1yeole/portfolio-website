import { ProjectsManager } from '@/components/admin/ProjectsManager';

export default function MotionPage() {
  return (
    <ProjectsManager 
      title="Motion Graphics" 
      defaultCategory="Motion Graphics" 
      allowedCategories={['Motion Graphics', 'Other']} 
    />
  );
}
