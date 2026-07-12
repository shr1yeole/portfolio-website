'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { DataTable } from '@/components/admin/DataTable';
import { Modal } from '@/components/admin/Modal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { FormField, Select } from '@/components/admin/FormField';
import { StatusBadge } from '@/components/admin/StatusBadge';
import type { AdminRequirement, RequirementStatus } from '@/types/admin';
import { getClientCollection, updateClientDocument, deleteClientDocument } from '@/lib/firestore-client';

const statusSchema = z.object({
  status: z.enum(['New', 'In Progress', 'Completed']),
});

type StatusForm = z.infer<typeof statusSchema>;

export default function RequirementsPage() {
  const [data, setData] = useState<AdminRequirement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewItem, setViewItem] = useState<AdminRequirement | null>(null);
  const [deletingItem, setDeletingItem] = useState<AdminRequirement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset } = useForm<StatusForm>({ resolver: zodResolver(statusSchema) });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const requirements = await getClientCollection<AdminRequirement>('requirements');
      setData(requirements);
    } catch (err) {
      console.error(err);
      toast.error('Error fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleView = (item: AdminRequirement) => {
    setViewItem(item);
    reset({ status: item.status });
  };

  const onUpdateStatus = async (formData: StatusForm) => {
    if (!viewItem) return;
    setIsSubmitting(true);
    try {
      await updateClientDocument('requirements', viewItem.id, { status: formData.status });
      toast.success('Status updated');
      setViewItem(null);
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
      await deleteClientDocument('requirements', deletingItem.id);
      toast.success('Requirement deleted');
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
        <h1 className="text-2xl font-bold text-white">Requirements</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <DataTable
          data={data}
          searchKey="clientName"
          columns={[
            { key: 'submittedAt', label: 'Date', render: (item) => new Date(item.submittedAt).toLocaleDateString() },
            { key: 'clientName', label: 'Client Name' },
            { key: 'projectType', label: 'Project Type' },
            { key: 'status', label: 'Status', render: (item) => <StatusBadge status={item.status} /> },
          ]}
          onEdit={handleView}
          onDelete={setDeletingItem}
        />
      )}

      <Modal isOpen={!!viewItem} onClose={() => !isSubmitting && setViewItem(null)} title="Requirement Details">
        {viewItem && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-gray-500">Client Name</p><p className="font-medium text-white">{viewItem.clientName}</p></div>
              <div><p className="text-sm text-gray-500">Email</p><p className="font-medium text-white">{viewItem.email || '-'}</p></div>
              <div><p className="text-sm text-gray-500">Project Type</p><p className="font-medium text-white">{viewItem.projectType}</p></div>
              <div><p className="text-sm text-gray-500">Submitted</p><p className="font-medium text-white">{new Date(viewItem.submittedAt).toLocaleString()}</p></div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Description</p>
              <div className="bg-white/5 p-4 rounded-lg border border-white/10 text-gray-300 whitespace-pre-wrap">
                {viewItem.description}
              </div>
            </div>

            <form onSubmit={handleSubmit(onUpdateStatus)} className="border-t border-white/10 pt-6 mt-6">
              <FormField label="Update Status">
                <div className="flex gap-4">
                  <Select {...register('status')} className="flex-1">
                    <option value="New" className="bg-zinc-900 text-white">New</option>
                    <option value="In Progress" className="bg-zinc-900 text-white">In Progress</option>
                    <option value="Completed" className="bg-zinc-900 text-white">Completed</option>
                  </Select>
                  <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white whitespace-nowrap">
                    {isSubmitting ? 'Updating...' : 'Update Status'}
                  </button>
                </div>
              </FormField>
            </form>
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={!!deletingItem} onClose={() => setDeletingItem(null)} onConfirm={handleDelete} title="Delete Requirement" message={`Delete inquiry from "${deletingItem?.clientName}"?`} isLoading={isSubmitting} />
    </div>
  );
}
