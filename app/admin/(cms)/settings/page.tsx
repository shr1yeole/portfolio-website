'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { FormField, Input, Textarea } from '@/components/admin/FormField';
import { Loader2, Save } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const settingsSchema = z.object({
  bio: z.string().optional(),
  tagline: z.string().optional(),
  socialLinks: z.object({
    github: z.string().optional(),
    linkedin: z.string().optional(),
    instagram: z.string().optional(),
  }),
  resumeUrl: z.string().optional(),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema)
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'main'));
        if (snap.exists()) {
          reset(snap.data() as SettingsForm);
        }
      } catch (err) {
        console.error(err);
        toast.error('Error loading settings');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [reset]);

  const onSubmit = async (data: SettingsForm) => {
    setIsSubmitting(true);
    try {
      await setDoc(
        doc(db, 'settings', 'main'),
        { ...data, updatedAt: new Date().toISOString() },
        { merge: true }
      );
      toast.success('Settings updated successfully');
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while saving');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Global Settings</h1>
        <p className="text-gray-400 text-sm">Update your portfolio information and social links.</p>
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

          {/* Profile Information */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">Profile Information</h2>
            <div className="space-y-4">
              <FormField label="Tagline" error={errors.tagline?.message}>
                <Input {...register('tagline')} placeholder="e.g. Building Digital Experiences..." />
              </FormField>

              <FormField label="Bio" error={errors.bio?.message}>
                <Textarea {...register('bio')} placeholder="Write a short bio about yourself..." className="min-h-[150px]" />
              </FormField>

              <FormField label="Resume URL (PDF)" error={errors.resumeUrl?.message}>
                <Input {...register('resumeUrl')} placeholder="https://res.cloudinary.com/.../resume.pdf" />
              </FormField>
            </div>
          </section>

          {/* Social Links */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">Social Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <FormField label="GitHub URL" error={errors.socialLinks?.github?.message}>
                <Input {...register('socialLinks.github')} placeholder="https://github.com/..." />
              </FormField>
              <FormField label="LinkedIn URL" error={errors.socialLinks?.linkedin?.message}>
                <Input {...register('socialLinks.linkedin')} placeholder="https://linkedin.com/in/..." />
              </FormField>
              <FormField label="Instagram URL" error={errors.socialLinks?.instagram?.message}>
                <Input {...register('socialLinks.instagram')} placeholder="https://instagram.com/..." />
              </FormField>
            </div>
          </section>

          {/* Form Actions */}
          <div className="flex items-center justify-end pt-6 border-t border-white/10 gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-4">
        <div className="text-blue-400">ℹ️</div>
        <div>
          <h3 className="text-sm font-medium text-blue-400 mb-1">Admin Account</h3>
          <p className="text-xs text-gray-400">
            To change your admin email or password, go to the{' '}
            <a
              href="https://console.firebase.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Firebase Console
            </a>
            {' '}→ Authentication → Users.
          </p>
        </div>
      </div>
    </div>
  );
}
