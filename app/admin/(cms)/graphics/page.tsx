import { ProjectsManager } from '@/components/admin/ProjectsManager';

export default function GraphicsPage() {
  return (
    <ProjectsManager 
      title="Graphic Designs" 
      defaultCategory="Graphic Designs" 
      allowedCategories={[
        'Graphic Designs', 
        'Branding', 
        'Social Media Creatives', 
        'Posters', 
        'Logo Design', 
        'UI/UX Design',
        'Photography',
        'Other'
      ]} 
    />
  );
}
