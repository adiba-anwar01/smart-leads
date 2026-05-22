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
import { Download, Plus, Search, Check, Eye, Inbox } from 'lucide-react';
import type { Lead, LeadFilters, CreateLeadPayload } from '../types';

export function LeadsPage(): React.JSX.Element {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'admin';

  const [searchParams, setSearchParams] = useSearchParams();
  const createdByParam = searchParams.get('createdBy');
  
  const [filters, setFilters] = useState<LeadFilters>(
    createdByParam ? { createdBy: createdByParam } : {}
  );
  const [page, setPage] = useState(1);

  const activeFilters: LeadFilters = { ...filters, page };
  const { leads, pagination, isLoading, isError, error, refetch, addLead, editLead, removeLead } =
    useLeads(activeFilters);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedLeadForEdit, setSelectedLeadForEdit] = useState<Lead | undefined>();
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [leadToView, setLeadToView] = useState<Lead | null>(null);
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

  const openCreate = () => { setSelectedLeadForEdit(undefined); setFormOpen(true); };
  const openEdit = (lead: Lead) => { setSelectedLeadForEdit(lead); setFormOpen(true); };
  const openDelete = (lead: Lead) => setLeadToDelete(lead);
  const openView = (lead: Lead) => setLeadToView(lead);

  const handleFormSubmit = async (data: CreateLeadPayload) => {
    if (selectedLeadForEdit) {
      await editLead(selectedLeadForEdit._id, data);
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

  const hasActiveFilters = Object.keys(filters).some(
    (k) => k !== 'sort' || filters.sort !== 'latest'
  );
  const showEmpty = !isLoading && !isError && leads.length === 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Leads</h1>
        <div className="flex items-center gap-2">
          <Button
            id="export-csv"
            variant="secondary"
            size="sm"
            isLoading={exporting}
            onClick={handleExport}
            className="flex items-center"
          >
            <Download className="w-4 h-4 mr-1.5" /> Export CSV
          </Button>
          <Button id="create-lead" size="sm" onClick={openCreate} className="flex items-center">
            <Plus className="w-4 h-4 mr-1.5" /> Create Lead
          </Button>
        </div>
      </div>

      <LeadFiltersBar onChange={handleFiltersChange} />

      {filters.createdBy && isAdmin && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <p className="text-sm font-medium">Viewing leads for a specific user.</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearchParams({});
              setFilters({});
            }}
          >
            Clear User Filter
          </Button>
        </div>
      )}

      {isError && (
        <ErrorMessage message={error ?? 'Failed to load leads'} onRetry={refetch} />
      )}

      {showEmpty && !hasActiveFilters && (
        <EmptyState
          icon={<Inbox className="w-8 h-8 text-slate-500 " />}
          title="No leads yet"
          description="Create your first lead to start tracking customers"
          action={
            <Button id="empty-create-lead" size="sm" onClick={openCreate} className="flex items-center">
              <Check className="w-4 h-4 mr-1.5" /> Create Lead
            </Button>
          }
        />
      )}
      {showEmpty && hasActiveFilters && (
        <EmptyState
          icon={<Search className="w-8 h-8 text-slate-500" />}
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
        lead={selectedLeadForEdit}
        onSubmit={handleFormSubmit}
      />
      <DeleteLeadModal
        isOpen={!!leadToDelete}
        onClose={() => setLeadToDelete(null)}
        lead={leadToDelete}
        onConfirm={removeLead}
      />
      <ViewLeadModal
        isOpen={!!leadToView}
        onClose={() => setLeadToView(null)}
        lead={leadToView}
        isAdmin={isAdmin}
        onEdit={openEdit}
        onDelete={openDelete}
      />
    </div>
  );
}
