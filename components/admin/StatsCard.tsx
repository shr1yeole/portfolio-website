import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({ title, value, icon: Icon, trend }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className="w-16 h-16" />
      </div>
      
      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="p-2 bg-white/5 rounded-lg">
            <Icon className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="font-medium">{title}</h3>
        </div>
        
        <div className="flex items-end gap-3">
          <span className="text-4xl font-bold text-white">{value}</span>
          {trend && (
            <span className={`text-sm font-medium pb-1 ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
