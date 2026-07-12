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
import type { AdminBrand } from '@/types/admin';
import { getClientCollection, createClientDocument, updateClientDocument, deleteClientDocument } from '@/lib/firestore-client';

const brandSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  logoUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
  description: z.string().optional(),
});

type BrandForm = z.infer<typeof brandSchema>;

export default function BrandsPage() {
  const [data, setData] = useState<AdminBrand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminBrand | null>(null);
  const [deletingItem, setDeletingItem] = useState<AdminBrand | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BrandForm>({ resolver: zodResolver(brandSchema) });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const brands = await getClientCollection<AdminBrand>('brands');
      setData(brands);
    } catch (err) {
      console.error(err);
      toast.error('Error fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenModal = (item?: AdminBrand) => {
    if (item) { setEditingItem(item); reset(item); } 
    else { setEditingItem(null); reset({ name: '', logoUrl: '', websiteUrl: '', description: '' }); }
    setIsModalOpen(true);
  };

  const onSubmit = async (formData: BrandForm) => {
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await updateClientDocument('brands', editingItem.id, formData);
      } else {
        await createClientDocument('brands', formData);
      }
      toast.success(`Brand ${editingItem ? 'updated' : 'created'} successfully`);
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
      await deleteClientDocument('brands', deletingItem.id);
      toast.success('Brand deleted');
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
        <h1 className="text-2xl font-bold text-white">Brands</h1>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg">
          <Plus className="w-4 h-4" /> Add Brand
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <DataTable
          data={data}
          searchKey="name"
          columns={[
            { key: 'logoUrl', label: 'Logo', render: (item) => item.logoUrl ? <img src={item.logoUrl} alt={item.name} className="w-12 h-12 rounded-md object-contain bg-white/10 p-1" /> : <div className="w-12 h-12 rounded-md bg-white/5 flex items-center justify-center text-xs text-gray-500">No Logo</div> },
            { key: 'name', label: 'Name' },
            { key: 'websiteUrl', label: 'Website', render: (item) => item.websiteUrl ? <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Link</a> : '-' },
          ]}
          onEdit={handleOpenModal}
          onDelete={setDeletingItem}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => !isSubmitting && setIsModalOpen(false)} title={editingItem ? 'Edit Brand' : 'Add Brand'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Brand Name" error={errors.name?.message}><Input {...register('name')} /></FormField>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Logo URL (Optional)" error={errors.logoUrl?.message}><Input {...register('logoUrl')} /></FormField>
            <FormField label="Website URL (Optional)" error={errors.websiteUrl?.message}><Input {...register('websiteUrl')} /></FormField>
          </div>
          <FormField label="Description (Optional)" error={errors.description?.message}><Textarea {...register('description')} /></FormField>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 rounded-lg text-gray-300 hover:bg-white/10">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">Save</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deletingItem} onClose={() => setDeletingItem(null)} onConfirm={handleDelete} title="Delete Brand" message={`Delete "${deletingItem?.name}"?`} isLoading={isSubmitting} />
    </div>
  );
}
