'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Plus, Search, Filter } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { Modal } from '@/components/admin/Modal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { FormField, Input, Textarea } from '@/components/admin/FormField';
import type { AdminProject } from '@/types/admin';
import { getClientCollection, createClientDocument, updateClientDocument, deleteClientDocument } from '@/lib/firestore-client';

const CATEGORIES = [
  'Websites',
  'Graphic Designs',
  'Motion Graphics',
  'Video Editing',
  'Branding',
  'Social Media Creatives',
  'Posters',
  'Logo Design',
  'UI/UX Design',
  'Flutter Projects',
  'Java Projects',
  'Full Stack Projects',
  'Automation Projects',
  'WordPress Websites',
  'Meta Ads',
  'Google Ads',
  'SEO',
  'Photography',
  'Other'
];

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  customCategory: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  clientName: z.string().optional(),
  technologies: z.string().optional(),
  githubUrl: z.string().optional(),
  liveUrl: z.string().optional(),
  thumbnail: z.string().min(1, 'Thumbnail URL is required'),
  image: z.string().optional(),
  videoUrl: z.string().optional(),
  projectDate: z.string().optional(),
  featured: z.boolean(),
  status: z.enum(['Published', 'Draft']),
  displayOrder: z.number(),
}).refine(data => {
  if (data.category === 'Other' && (!data.customCategory || data.customCategory.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: "Custom category is required when 'Other' is selected",
  path: ["customCategory"]
});

type ProjectForm = z.infer<typeof projectSchema>;

export function ProjectsManager({ title, defaultCategory, allowedCategories }: { title: string, defaultCategory?: string, allowedCategories?: string[] }) {
  const [data, setData] = useState<AdminProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminProject | null>(null);
  const [deletingItem, setDeletingItem] = useState<AdminProject | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Published' | 'Draft'>('All');

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema)
  });

  const selectedCategory = watch('category');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Get all projects, sorted by creation date descending
      const projects = await getClientCollection<AdminProject>('projects', 'createdAt', 'desc');
      if (allowedCategories) {
        setData(projects.filter(p => allowedCategories.includes(p.category)));
      } else if (defaultCategory) {
        setData(projects.filter(p => p.category === defaultCategory));
      } else {
        setData(projects);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item?: AdminProject) => {
    if (item) {
      setEditingItem(item);
      reset({
        ...item,
        technologies: item.technologies ? item.technologies.join(', ') : '',
        status: item.status || 'Published',
        category: CATEGORIES.includes(item.category) ? item.category : 'Other',
        customCategory: CATEGORIES.includes(item.category) ? '' : item.category,
      });
    } else {
      setEditingItem(null);
      reset({
        title: '', category: defaultCategory || 'Websites', customCategory: '', description: '', clientName: '', technologies: '',
        githubUrl: '', liveUrl: '', thumbnail: '', image: '', videoUrl: '', projectDate: '',
        featured: false, displayOrder: 0, status: 'Published'
      });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (formData: ProjectForm) => {
    setIsSubmitting(true);
    try {
      // Determine final category string
      const finalCategory = formData.category === 'Other' && formData.customCategory 
        ? formData.customCategory.trim() 
        : formData.category;

      const payload = {
        ...formData,
        category: finalCategory,
        customCategory: undefined, // Don't save this explicit field, just merge it into category
        technologies: formData.technologies ? formData.technologies.split(',').map(t => t.trim()).filter(Boolean) : [],
        updatedAt: new Date().toISOString(),
      };

      if (!editingItem) {
        // @ts-ignore
        payload.createdAt = new Date().toISOString();
      }

      if (editingItem) {
        await updateClientDocument('projects', editingItem.id, payload);
      } else {
        await createClientDocument('projects', payload);
      }

      toast.success(`Project ${editingItem ? 'updated' : 'created'} successfully`);
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setIsSubmitting(true);
    try {
      await deleteClientDocument('projects', deletingItem.id);
      toast.success('Project deleted');
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
      setDeletingItem(null);
    }
  };

  const togglePublishStatus = async (item: AdminProject) => {
    const newStatus = item.status === 'Published' ? 'Draft' : 'Published';
    try {
      await updateClientDocument('projects', item.id, { status: newStatus });
      toast.success(`Project marked as ${newStatus}`);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    }
  };

  // Filter and Search logic
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.clientName && item.clientName.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data, searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, category, client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 min-w-[200px]">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Drafts</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <DataTable
          data={filteredData}
          searchKey="title" // Disabling built-in search to use our custom one by passing filtered data
          columns={[
            {
              key: 'thumbnail',
              label: 'Image',
              render: (item) => (
                <img src={item.thumbnail} alt={item.title} className="w-12 h-12 rounded-md object-cover bg-black/50 border border-white/10" />
              )
            },
            { key: 'title', label: 'Title' },
            { 
              key: 'category', 
              label: 'Category',
              render: (item) => (
                <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-medium text-gray-300">
                  {item.category}
                </span>
              )
            },
            {
              key: 'status',
              label: 'Status',
              render: (item) => (
                <button
                  onClick={() => togglePublishStatus(item)}
                  className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                    item.status === 'Published' 
                      ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                      : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                  }`}
                >
                  {item.status || 'Published'}
                </button>
              )
            },
            { 
              key: 'createdAt', 
              label: 'Created',
              render: (item) => item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'
            },
          ]}
          onEdit={handleOpenModal}
          onDelete={setDeletingItem}
        />
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title={editingItem ? 'Edit Project' : 'Add Project'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          
          {/* Status & Featured */}
          <div className="flex items-center gap-6 p-4 bg-white/5 rounded-lg border border-white/10">
             <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-300">Status:</span>
                <select {...register('status')} className="bg-black/50 border border-white/10 rounded px-3 py-1 text-sm text-white focus:outline-none focus:border-blue-500">
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
             </div>
             <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" {...register('featured')} className="w-4 h-4 rounded border-white/10 bg-black/40 text-blue-500 focus:ring-blue-500/50" />
                <label htmlFor="featured" className="text-sm font-medium text-gray-300 cursor-pointer">Featured Project</label>
             </div>
          </div>

          <FormField label="Project Title *" error={errors.title?.message}>
            <Input {...register('title')} placeholder="Enter project title" />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Category *" error={errors.category?.message}>
              <select 
                {...register('category')} 
                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="">Select a category</option>
                {(allowedCategories || CATEGORIES).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </FormField>

            {selectedCategory === 'Other' && (
              <FormField label="Enter Custom Category *" error={errors.customCategory?.message}>
                <Input {...register('customCategory')} placeholder="e.g. 3D Modeling" />
              </FormField>
            )}
          </div>
          
          <FormField label="Short Description *" error={errors.description?.message}>
            <Textarea {...register('description')} placeholder="Summarize the project in a few sentences..." />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Client Name (Optional)" error={errors.clientName?.message}>
              <Input {...register('clientName')} placeholder="e.g. Acme Corp" />
            </FormField>
            <FormField label="Project Date (Optional)" error={errors.projectDate?.message}>
              <Input type="date" {...register('projectDate')} />
            </FormField>
          </div>

          <FormField label="Technologies Used (Comma separated)" error={errors.technologies?.message}>
            <Input {...register('technologies')} placeholder="React, Next.js, Figma, Premiere Pro..." />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Thumbnail Image URL *" error={errors.thumbnail?.message}>
              <Input {...register('thumbnail')} placeholder="Cloudinary URL (required)" />
            </FormField>
            <FormField label="Full Image URL (Optional)" error={errors.image?.message}>
              <Input {...register('image')} placeholder="Cloudinary URL (for Graphic Design Lightbox)" />
            </FormField>
          </div>

          <FormField label="Video URL (Optional)" error={errors.videoUrl?.message}>
            <Input {...register('videoUrl')} placeholder="Cloudinary Video URL (for Motion/Video Portfolio)" />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Live Website Link (Optional)" error={errors.liveUrl?.message}>
              <Input {...register('liveUrl')} placeholder="https://..." />
            </FormField>
            <FormField label="GitHub Repository Link (Optional)" error={errors.githubUrl?.message}>
              <Input {...register('githubUrl')} placeholder="https://github.com/..." />
            </FormField>
          </div>
          
          <FormField label="Display Order (Smaller numbers appear first)">
            <Input type="number" {...register('displayOrder', { valueAsNumber: true })} />
          </FormField>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10 mt-6 sticky bottom-0 bg-gray-900/90 backdrop-blur pb-2 z-10">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg font-medium text-gray-300 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${deletingItem?.title}"? This action cannot be undone.`}
        isLoading={isSubmitting}
      />
    </div>
  );
}
