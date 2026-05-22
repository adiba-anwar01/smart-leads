import { useState, useCallback, useEffect } from 'react';
import { getLeads, createLead, updateLead, deleteLead } from '../api/leads.api';
import type {
  Lead,
  LeadFilters,
  CreateLeadPayload,
  UpdateLeadPayload,
  PaginationMeta,
} from '../types';

interface UseLeadsReturn {
  leads: Lead[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
  addLead: (payload: CreateLeadPayload) => Promise<Lead>;
  editLead: (id: string, payload: UpdateLeadPayload) => Promise<Lead>;
  removeLead: (id: string) => Promise<void>;
}

export function useLeads(filters: LeadFilters = {}): UseLeadsReturn {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const filtersKey = JSON.stringify(filters);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const res = await getLeads(filters);
      setLeads(res.leads);
      setPagination(res.pagination);
    } catch (err: unknown) {
      setIsError(true);
      setError(err instanceof Error ? err.message : 'Failed to fetch leads');
    } finally {
      setIsLoading(false);
    }
  }, [filtersKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const refetch = fetchLeads;

  const addLead = useCallback(async (payload: CreateLeadPayload): Promise<Lead> => {
    const lead = await createLead(payload);
    fetchLeads();
    return lead;
  }, [fetchLeads]);

  const editLead = useCallback(async (id: string, payload: UpdateLeadPayload): Promise<Lead> => {
    const updated = await updateLead(id, payload);
    setLeads((prev) => prev.map((l) => (l._id === id ? updated : l)));
    return updated;
  }, []);

  const removeLead = useCallback(async (id: string): Promise<void> => {
    await deleteLead(id);
    fetchLeads();
  }, [fetchLeads]);

  return { leads, pagination, isLoading, isError, error, refetch, addLead, editLead, removeLead };
}
