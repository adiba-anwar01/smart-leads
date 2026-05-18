import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import type { Lead } from '../../types';

interface DeleteLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onConfirm: (id: string) => Promise<void>;
}

export function DeleteLeadModal({
  isOpen,
  onClose,
  lead,
  onConfirm,
}: DeleteLeadModalProps): React.JSX.Element {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!lead) return;
    setIsDeleting(true);
    try {
      await onConfirm(lead._id);
      toast.success('Lead deleted successfully');
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete lead');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Lead"
      size="sm"
      footer={
        <>
          <Button id="delete-cancel" variant="secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            id="delete-confirm"
            variant="danger"
            isLoading={isDeleting}
            onClick={handleConfirm}
          >
            Delete
          </Button>
        </>
      }
    >
      <p className="text-[14px] text-slate-600 dark:text-slate-300">
        Are you sure you want to delete{' '}
        <span className="font-semibold text-slate-800 dark:text-white">{lead?.name}</span>?
        This action cannot be undone.
      </p>
    </Modal>
  );
}
