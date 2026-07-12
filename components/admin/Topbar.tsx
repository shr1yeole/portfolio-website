'use client';

import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

export function Topbar() {
  const pathname = usePathname();
  
  // Create a friendly title from the pathname
  const segments = pathname.split('/').filter(Boolean);
  const currentSegment = segments[segments.length - 1] || 'Dashboard';
  const title = currentSegment.charAt(0).toUpperCase() + currentSegment.slice(1);

  return (
    <header className="h-20 bg-black/40 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {/* Mobile menu button could go here if implemented later */}
        <button className="md:hidden text-gray-400 hover:text-white">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-white">Shravan Yeole</p>
          <p className="text-xs text-gray-400">Admin</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px]">
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
            <span className="text-sm font-bold text-white">SY</span>
          </div>
        </div>
      </div>
    </header>
  );
}
