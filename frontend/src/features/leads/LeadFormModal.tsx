import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import type { Lead, CreateLeadPayload } from '../../types';
import { LeadStatus } from '../../types';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Website', 'Instagram', 'Referral']),
});

type FormValues = z.infer<typeof schema>;

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead;
  onSubmit: (data: CreateLeadPayload) => Promise<unknown>;
}

const selectClass =
  'w-full text-[13px] text-slate-900 dark:text-white bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-slate-300 dark:hover:border-slate-500 transition-all';

export function LeadFormModal({
  isOpen,
  onClose,
  lead,
  onSubmit,
}: LeadFormModalProps): React.JSX.Element {
  const isEdit = !!lead;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: lead?.name ?? '',
      email: lead?.email ?? '',
      status: (lead?.status as FormValues['status']) ?? 'New',
      source: (lead?.source as FormValues['source']) ?? 'Website',
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset({
        name: lead?.name ?? '',
        email: lead?.email ?? '',
        status: (lead?.status as FormValues['status']) ?? 'New',
        source: (lead?.source as FormValues['source']) ?? 'Website',
      });
    }
  }, [isOpen, lead, reset]);

  const handleFormSubmit = async (values: FormValues) => {
    try {
      await onSubmit(values);
      toast.success(isEdit ? 'Lead updated!' : 'Lead created!');
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Lead' : 'Create Lead'}
      footer={
        <>
          <Button id="modal-cancel" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            id="modal-submit"
            form="lead-form"
            type="submit"
            isLoading={isSubmitting}
          >
            {isEdit ? 'Save changes' : 'Create lead'}
          </Button>
        </>
      }
    >
      <form id="lead-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          id="lead-name"
          label="Name"
          placeholder="Jane Doe"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          id="lead-email"
          label="Email"
          type="email"
          placeholder="jane@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="lead-status" className="text-[13px] font-medium text-slate-700 dark:text-slate-300">
            Status
          </label>
          <select id="lead-status" className={selectClass} {...register('status')}>
            {['New', 'Contacted', 'Qualified', 'Lost'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.status && <p className="text-[11.5px] text-red-500">{errors.status.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="lead-source" className="text-[13px] font-medium text-slate-700 dark:text-slate-300">
            Source
          </label>
          <select id="lead-source" className={selectClass} {...register('source')}>
            {['Website', 'Instagram', 'Referral'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.source && <p className="text-[11.5px] text-red-500">{errors.source.message}</p>}
        </div>
      </form>
    </Modal>
  );
}
