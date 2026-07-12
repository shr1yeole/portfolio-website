'use client';

import { useEffect, useState } from 'react';
import { Briefcase, Globe, Palette, Video, Film, Building2, MessageSquare } from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import type { DashboardStats, AdminRequirement } from '@/types/admin';
import { StatusBadge } from '@/components/admin/StatusBadge';
import Link from 'next/link';
import { getClientCollection, getClientCollectionCount } from '@/lib/firestore-client';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentRequirements, setRecentRequirements] = useState<AdminRequirement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          projectsCount,
          websitesCount,
          graphicsCount,
          videosCount,
          motionCount,
          brandsCount,
          requirements
        ] = await Promise.all([
          getClientCollectionCount('projects'),
          getClientCollectionCount('websites'),
          getClientCollectionCount('graphics'),
          getClientCollectionCount('videos'),
          getClientCollectionCount('motion'),
          getClientCollectionCount('brands'),
          getClientCollection<AdminRequirement>('requirements')
        ]);

        setStats({
          projects: projectsCount,
          websites: websitesCount,
          graphics: graphicsCount,
          videos: videosCount,
          motion: motionCount,
          brands: brandsCount,
          requirements: requirements.length,
          newRequirements: requirements.filter(r => r.status === 'New').length
        });

        // Get top 5 recent requirements
        const sorted = [...requirements].sort((a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        );
        setRecentRequirements(sorted.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="New Requirements" 
          value={stats?.newRequirements || 0} 
          icon={MessageSquare} 
          trend={{ value: 12, isPositive: true }} 
        />
        <StatsCard title="Total Projects" value={stats?.projects || 0} icon={Briefcase} />
        <StatsCard title="Websites" value={stats?.websites || 0} icon={Globe} />
        <StatsCard title="Graphics" value={stats?.graphics || 0} icon={Palette} />
        <StatsCard title="Videos" value={stats?.videos || 0} icon={Video} />
        <StatsCard title="Motion" value={stats?.motion || 0} icon={Film} />
        <StatsCard title="Brands" value={stats?.brands || 0} icon={Building2} />
        <StatsCard title="Total Req." value={stats?.requirements || 0} icon={MessageSquare} />
      </div>

      {/* Recent Requirements Table */}
      <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Recent Inquiries</h2>
          <Link href="/admin/requirements" className="text-sm text-blue-400 hover:text-blue-300">
            View all
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="py-3 px-6 text-sm font-medium text-gray-400">Date</th>
                <th className="py-3 px-6 text-sm font-medium text-gray-400">Client</th>
                <th className="py-3 px-6 text-sm font-medium text-gray-400">Project Type</th>
                <th className="py-3 px-6 text-sm font-medium text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentRequirements.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    No recent inquiries.
                  </td>
                </tr>
              ) : (
                recentRequirements.map((req) => (
                  <tr key={req.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 px-6 text-sm text-gray-300">
                      {new Date(req.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-300 font-medium">
                      {req.clientName}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-300">
                      {req.projectType}
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={req.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
