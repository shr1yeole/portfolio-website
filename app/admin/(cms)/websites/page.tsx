import { ProjectsManager } from '@/components/admin/ProjectsManager';

export default function WebsitesPage() {
  return (
    <ProjectsManager 
      title="Websites" 
      defaultCategory="Websites" 
      allowedCategories={[
        'Websites', 
        'WordPress Websites', 
        'Full Stack Projects', 
        'Flutter Projects', 
        'Java Projects', 
        'Automation Projects',
        'Other'
      ]} 
    />
  );
}
