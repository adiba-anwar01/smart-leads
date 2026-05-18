import React, { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/auth.store';
import { useLeads } from '../hooks/useLeads';
import { exportLeadsCSV } from '../api/leads.api';
import { downloadBlob } from '../utils/helpers';
import { LeadFiltersBar } from '../features/leads/LeadFiltersBar';
import { LeadsTable } from '../features/leads/LeadsTable';
import { LeadFormModal } from '../features/leads/LeadFormModal';
import { DeleteLeadModal } from '../features/leads/DeleteLeadModal';
import { ViewLeadModal } from '../features/leads/ViewLeadModal';
import { Pagination } from '../components/ui/Pagination';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import type { Lead, LeadFilters, CreateLeadPayload } from '../types';

export function LeadsPage(): React.JSX.Element {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'admin';

  const [, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<LeadFilters>({});
  const [page, setPage] = useState(1);

  const activeFilters: LeadFilters = { ...filters, page };
  const { leads, pagination, isLoading, isError, error, refetch, addLead, editLead, removeLead } =
    useLeads(activeFilters);

  const [formOpen, setFormOpen] = useState(false);
  const [editLead_, setEditLead] = useState<Lead | undefined>();
  const [deleteLead_, setDeleteLead] = useState<Lead | null>(null);
  const [viewLead_, setViewLead] = useState<Lead | null>(null);
  const [exporting, setExporting] = useState(false);

  const handleFiltersChange = useCallback((f: LeadFilters) => {
    setFilters(f);
    setPage(1);
  }, []);

  const handlePageChange = (p: number) => {
    setPage(p);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(p));
      return next;
    });
  };

  const openCreate = () => { setEditLead(undefined); setFormOpen(true); };
  const openEdit = (lead: Lead) => { setEditLead(lead); setFormOpen(true); };
  const openDelete = (lead: Lead) => setDeleteLead(lead);
  const openView = (lead: Lead) => setViewLead(lead);

  const handleFormSubmit = async (data: CreateLeadPayload) => {
    if (editLead_) {
      await editLead(editLead_._id, data);
    } else {
      await addLead(data);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportLeadsCSV(filters);
      downloadBlob(blob, 'leads-export.csv');
      toast.success('CSV exported!');
    } catch {
      toast.error('Failed to export CSV');
    } finally {
      setExporting(false);
    }
  };

  const hasActiveFilters = Object.keys(filters).length > 0;
  const showEmpty = !isLoading && !isError && leads.length === 0;

  return (
    <div className="space-y-5">
      
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Leads</h1>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button
              id="export-csv"
              variant="secondary"
              size="sm"
              isLoading={exporting}
              onClick={handleExport}
            >
              ↓ Export CSV
            </Button>
          )}
          <Button id="create-lead" size="sm" onClick={openCreate}>
            + Create Lead
          </Button>
        </div>
      </div>

      <LeadFiltersBar onChange={handleFiltersChange} />

      {isError && (
        <ErrorMessage message={error ?? 'Failed to load leads'} onRetry={refetch} />
      )}

      {showEmpty && !hasActiveFilters && (
        <EmptyState
          icon="◈"
          title="No leads yet"
          description="Create your first lead to get started."
          action={
            <Button id="empty-create-lead" size="sm" onClick={openCreate}>
              + Create Lead
            </Button>
          }
        />
      )}
      {showEmpty && hasActiveFilters && (
        <EmptyState
          icon="🔍"
          title="No leads match your filters"
          description="Try adjusting or resetting your filters."
          action={
            <Button
              id="empty-reset-filters"
              size="sm"
              variant="secondary"
              onClick={() => setSearchParams({})}
            >
              Reset Filters
            </Button>
          }
        />
      )}

      {!isError && !showEmpty && (
        <LeadsTable
          leads={leads}
          isLoading={isLoading}
          isAdmin={isAdmin}
          onView={openView}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      )}

      {pagination && pagination.totalPages > 1 && (
        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      )}

      <LeadFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        lead={editLead_}
        onSubmit={handleFormSubmit}
      />
      <DeleteLeadModal
        isOpen={!!deleteLead_}
        onClose={() => setDeleteLead(null)}
        lead={deleteLead_}
        onConfirm={removeLead}
      />
      <ViewLeadModal
        isOpen={!!viewLead_}
        onClose={() => setViewLead(null)}
        lead={viewLead_}
        isAdmin={isAdmin}
        onEdit={openEdit}
        onDelete={openDelete}
      />
    </div>
  );
}
