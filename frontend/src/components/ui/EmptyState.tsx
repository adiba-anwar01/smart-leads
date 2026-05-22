import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

import { Inbox } from 'lucide-react';

const DefaultIcon: React.FC = () => (
  <Inbox className="w-8 h-8 text-slate-400" />
);

export function EmptyState({
  title,
  description,
  icon,
  action,
  className = '',
}: EmptyStateProps): React.JSX.Element {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}>
      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-4 text-2xl">
        {icon ?? <DefaultIcon />}
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}
