import React from 'react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatDate } from '../../utils/helpers';
import type { Lead } from '../../types';
import { LeadStatus } from '../../types';

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
  isAdmin: boolean;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

type BadgeVariant = 'info' | 'default' | 'purple' | 'warning' | 'success' | 'danger';

const STATUS_VARIANT: Record<LeadStatus, BadgeVariant> = {
  [LeadStatus.New]: 'info',
  [LeadStatus.Contacted]: 'default',
  [LeadStatus.Qualified]: 'success',
  [LeadStatus.Lost]: 'danger',
};

function SkeletonRow(): React.JSX.Element {
  return (
    <tr>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded animate-pulse w-full" />
        </td>
      ))}
    </tr>
  );
}

export function LeadsTable({
  leads,
  isLoading,
  isAdmin,
  onView,
  onEdit,
  onDelete,
}: LeadsTableProps): React.JSX.Element {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      <table className="w-full text-[13px] text-left">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
            {['Name', 'Email', 'Status', 'Source', 'Created At', 'Actions'].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
            : leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">{lead.name}</td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{lead.email}</td>
                  <td className="px-4 py-3">
                    <Badge
                      label={lead.status}
                      variant={STATUS_VARIANT[lead.status]}
                      dot
                    />
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{lead.source}</td>
                  <td className="px-4 py-3 text-slate-400 dark:text-slate-500">{formatDate(lead.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        id={`view-lead-${lead._id}`}
                        size="sm"
                        variant="ghost"
                        onClick={() => onView(lead)}
                      >
                        View
                      </Button>
                      <Button
                        id={`edit-lead-${lead._id}`}
                        size="sm"
                        variant="secondary"
                        onClick={() => onEdit(lead)}
                      >
                        Edit
                      </Button>
                      {isAdmin && (
                        <Button
                          id={`delete-lead-${lead._id}`}
                          size="sm"
                          variant="danger"
                          onClick={() => onDelete(lead)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
