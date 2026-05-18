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
  const [tick, setTick] = useState(0);

  const filtersKey = JSON.stringify(filters);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setIsError(false);
    setError(null);

    getLeads(filters)
      .then((res) => {
        if (cancelled) return;
        setLeads(res.leads);
        setPagination(res.pagination);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setIsError(true);
        setError(err instanceof Error ? err.message : 'Failed to fetch leads');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [filtersKey, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  const addLead = useCallback(async (payload: CreateLeadPayload): Promise<Lead> => {
    const lead = await createLead(payload);
    setTick((t) => t + 1);
    return lead;
  }, []);

  const editLead = useCallback(async (id: string, payload: UpdateLeadPayload): Promise<Lead> => {
    const updated = await updateLead(id, payload);
    setLeads((prev) => prev.map((l) => (l._id === id ? updated : l)));
    return updated;
  }, []);

  const removeLead = useCallback(async (id: string): Promise<void> => {
    await deleteLead(id);
    setTick((t) => t + 1);
  }, []);

  return { leads, pagination, isLoading, isError, error, refetch, addLead, editLead, removeLead };
}
