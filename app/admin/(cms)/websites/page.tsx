'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { Modal } from '@/components/admin/Modal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { FormField, Input, Textarea } from '@/components/admin/FormField';
import type { AdminWebsite } from '@/types/admin';
import { getClientCollection, createClientDocument, updateClientDocument, deleteClientDocument } from '@/lib/firestore-client';

const websiteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  technologies: z.string().min(1, 'Comma separated technologies are required'),
  thumbnail: z.string().min(1, 'Thumbnail URL is required'),
  image: z.string().min(1, 'Image URL is required'),
  githubUrl: z.string().optional(),
  liveUrl: z.string().optional(),
  featured: z.boolean(),
  displayOrder: z.number(),
});

type WebsiteForm = z.infer<typeof websiteSchema>;

export default function WebsitesPage() {
  const [data, setData] = useState<AdminWebsite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminWebsite | null>(null);
  const [deletingItem, setDeletingItem] = useState<AdminWebsite | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<WebsiteForm>({
    resolver: zodResolver(websiteSchema)
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const websites = await getClientCollection<AdminWebsite>('websites', 'displayOrder', 'asc');
      setData(websites);
    } catch (err) {
      console.error(err);
      toast.error('Error fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenModal = (item?: AdminWebsite) => {
    if (item) {
      setEditingItem(item);
      reset({ ...item, technologies: item.technologies.join(', ') });
    } else {
      setEditingItem(null);
      reset({ title: '', category: '', description: '', technologies: '', thumbnail: '', image: '', githubUrl: '', liveUrl: '', featured: false, displayOrder: 0 });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (formData: WebsiteForm) => {
    setIsSubmitting(true);
    try {
      const payload = { ...formData, technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean) };
      
      if (editingItem) {
        await updateClientDocument('websites', editingItem.id, payload);
      } else {
        await createClientDocument('websites', payload);
      }

      toast.success(`Website ${editingItem ? 'updated' : 'created'} successfully`);
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
      await deleteClientDocument('websites', deletingItem.id);
      toast.success('Website deleted');
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
      setDeletingItem(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Websites</h1>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg">
          <Plus className="w-4 h-4" /> Add Website
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <DataTable
          data={data}
          searchKey="title"
          columns={[
            { key: 'thumbnail', label: 'Image', render: (item) => <img src={item.thumbnail} alt={item.title} className="w-12 h-12 rounded-md object-cover bg-black/50" /> },
            { key: 'title', label: 'Title' },
            { key: 'category', label: 'Category' },
            { key: 'featured', label: 'Featured', render: (item) => item.featured ? <span className="text-blue-400">Yes</span> : <span className="text-gray-500">No</span> },
          ]}
          onEdit={handleOpenModal}
          onDelete={setDeletingItem}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => !isSubmitting && setIsModalOpen(false)} title={editingItem ? 'Edit Website' : 'Add Website'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Title" error={errors.title?.message}><Input {...register('title')} /></FormField>
            <FormField label="Category" error={errors.category?.message}><Input {...register('category')} /></FormField>
          </div>
          <FormField label="Description" error={errors.description?.message}><Textarea {...register('description')} /></FormField>
          <FormField label="Technologies (comma separated)" error={errors.technologies?.message}><Input {...register('technologies')} /></FormField>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Thumbnail URL" error={errors.thumbnail?.message}><Input {...register('thumbnail')} /></FormField>
            <FormField label="Image URL (Full)" error={errors.image?.message}><Input {...register('image')} /></FormField>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="GitHub URL" error={errors.githubUrl?.message}><Input {...register('githubUrl')} /></FormField>
            <FormField label="Live URL" error={errors.liveUrl?.message}><Input {...register('liveUrl')} /></FormField>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Display Order"><Input type="number" {...register('displayOrder', { valueAsNumber: true })} /></FormField>
            <div className="flex items-center gap-3 mt-8">
              <input type="checkbox" id="featured" {...register('featured')} className="w-5 h-5 rounded" />
              <label htmlFor="featured" className="text-sm font-medium text-gray-300">Featured</label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 rounded-lg text-gray-300 hover:bg-white/10">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">Save</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deletingItem} onClose={() => setDeletingItem(null)} onConfirm={handleDelete} title="Delete Website" message={`Delete "${deletingItem?.title}"?`} isLoading={isSubmitting} />
    </div>
  );
}
