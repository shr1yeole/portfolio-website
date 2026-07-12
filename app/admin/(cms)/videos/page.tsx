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
import type { AdminVideo } from '@/types/admin';
import { getClientCollection, createClientDocument, updateClientDocument, deleteClientDocument } from '@/lib/firestore-client';

const videoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  videoUrl: z.string().min(1, 'Video URL is required'),
  thumbnailUrl: z.string().min(1, 'Thumbnail URL is required'),
  category: z.string().min(1, 'Category is required'),
  duration: z.string().optional(),
  featured: z.boolean(),
});

type VideoForm = z.infer<typeof videoSchema>;

export default function VideosPage() {
  const [data, setData] = useState<AdminVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminVideo | null>(null);
  const [deletingItem, setDeletingItem] = useState<AdminVideo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<VideoForm>({ resolver: zodResolver(videoSchema) });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const videos = await getClientCollection<AdminVideo>('videos');
      setData(videos);
    } catch (err) {
      console.error(err);
      toast.error('Error fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenModal = (item?: AdminVideo) => {
    if (item) { setEditingItem(item); reset(item); } 
    else { setEditingItem(null); reset({ title: '', description: '', videoUrl: '', thumbnailUrl: '', category: '', duration: '', featured: false }); }
    setIsModalOpen(true);
  };

  const onSubmit = async (formData: VideoForm) => {
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await updateClientDocument('videos', editingItem.id, formData);
      } else {
        await createClientDocument('videos', formData);
      }
      toast.success(`Video ${editingItem ? 'updated' : 'created'} successfully`);
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
      await deleteClientDocument('videos', deletingItem.id);
      toast.success('Video deleted');
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
        <h1 className="text-2xl font-bold text-white">Videos</h1>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg">
          <Plus className="w-4 h-4" /> Add Video
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <DataTable
          data={data}
          searchKey="title"
          columns={[
            { key: 'thumbnailUrl', label: 'Thumbnail', render: (item) => <img src={item.thumbnailUrl} alt={item.title} className="w-16 h-10 rounded-md object-cover bg-black/50" /> },
            { key: 'title', label: 'Title' },
            { key: 'category', label: 'Category' },
            { key: 'duration', label: 'Duration' },
            { key: 'featured', label: 'Featured', render: (item) => item.featured ? <span className="text-blue-400">Yes</span> : <span className="text-gray-500">No</span> },
          ]}
          onEdit={handleOpenModal}
          onDelete={setDeletingItem}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => !isSubmitting && setIsModalOpen(false)} title={editingItem ? 'Edit Video' : 'Add Video'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Title" error={errors.title?.message}><Input {...register('title')} /></FormField>
          <FormField label="Description" error={errors.description?.message}><Textarea {...register('description')} /></FormField>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Video URL" error={errors.videoUrl?.message}><Input {...register('videoUrl')} /></FormField>
            <FormField label="Thumbnail URL" error={errors.thumbnailUrl?.message}><Input {...register('thumbnailUrl')} /></FormField>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Category" error={errors.category?.message}><Input {...register('category')} /></FormField>
            <FormField label="Duration (Optional)" error={errors.duration?.message}><Input {...register('duration')} placeholder="e.g. 2:45" /></FormField>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <input type="checkbox" id="featured" {...register('featured')} className="w-5 h-5 rounded" />
            <label htmlFor="featured" className="text-sm font-medium text-gray-300">Featured</label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 rounded-lg text-gray-300 hover:bg-white/10">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">Save</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deletingItem} onClose={() => setDeletingItem(null)} onConfirm={handleDelete} title="Delete Video" message={`Delete "${deletingItem?.title}"?`} isLoading={isSubmitting} />
    </div>
  );
}
