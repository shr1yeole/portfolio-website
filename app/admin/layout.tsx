import AuthProvider from '@/components/admin/AuthProvider';

// All admin routes are dynamic — they require Firebase Auth state at runtime.
// This prevents Next.js from attempting to statically prerender any /admin page.
export const dynamic = 'force-dynamic';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
