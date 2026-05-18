import React from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatDate } from '../../utils/helpers';
import type { Lead } from '../../types';
import { LeadStatus } from '../../types';

interface ViewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  isAdmin: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

type BadgeVariant = 'info' | 'default' | 'success' | 'danger';

const STATUS_VARIANT: Record<LeadStatus, BadgeVariant> = {
  [LeadStatus.New]: 'info',
  [LeadStatus.Contacted]: 'default',
  [LeadStatus.Qualified]: 'success',
  [LeadStatus.Lost]: 'danger',
};

export function ViewLeadModal({
  isOpen,
  onClose,
  lead,
  onEdit,
  onDelete,
}: ViewLeadModalProps): React.JSX.Element | null {
  if (!lead) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lead Details"
      size="md"
      footer={
        <div className="flex w-full justify-between items-center">
          <div>
            <Button
              id={`view-delete-lead-${lead._id}`}
              variant="danger"
              onClick={() => {
                onClose();
                onDelete(lead);
              }}
            >
              Delete
            </Button>
          </div>
          <div className="flex gap-2">
            <Button id="view-close" variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button
              id={`view-edit-lead-${lead._id}`}
              onClick={() => {
                onClose();
                onEdit(lead);
              }}
            >
              Edit
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <h3 className="text-[13px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Name</h3>
          <p className="text-[14px] font-medium text-slate-900 dark:text-white">{lead.name}</p>
        </div>
        <div>
          <h3 className="text-[13px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Email</h3>
          <p className="text-[14px] text-slate-700 dark:text-slate-300">{lead.email}</p>
        </div>
        <div>
          <h3 className="text-[13px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Status</h3>
          <Badge label={lead.status} variant={STATUS_VARIANT[lead.status]} dot />
        </div>
        <div>
          <h3 className="text-[13px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Source</h3>
          <p className="text-[14px] text-slate-700 dark:text-slate-300">{lead.source}</p>
        </div>
        <div>
          <h3 className="text-[13px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Created At</h3>
          <p className="text-[14px] text-slate-700 dark:text-slate-300">{formatDate(lead.createdAt)}</p>
        </div>
        <div>
          <h3 className="text-[13px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Created By</h3>
          <p className="text-[14px] text-slate-700 dark:text-slate-300">
            {typeof lead.createdBy === 'string' ? lead.createdBy : lead.createdBy.name}
          </p>
        </div>
      </div>
    </Modal>
  );
}
