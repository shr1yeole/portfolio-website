import { RequirementStatus } from '@/types/admin';

interface StatusBadgeProps {
  status: RequirementStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    'New': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    'In Progress': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Completed': 'bg-green-500/10 text-green-400 border-green-500/20',
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${styles[status]}`}>
      {status}
    </span>
  );
}
