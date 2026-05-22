import { axiosInstance } from './axios.instance';
import type {
  ApiResponse,
  ILead,
  Lead,
  CreateLeadPayload,
  UpdateLeadPayload,
  LeadFilters,
  PaginatedLeadsResponse,
  DashboardStats,
} from '../types';

export async function getLeads(filters: LeadFilters = {}): Promise<PaginatedLeadsResponse> {
  const { data } = await axiosInstance.get<ApiResponse<PaginatedLeadsResponse>>('/leads', {
    params: filters,
  });
  if (!data.data) throw new Error(data.message);
  return data.data;
}

export async function getLeadById(id: string): Promise<ILead> {
  const { data } = await axiosInstance.get<ApiResponse<ILead>>(`/leads/${id}`);
  if (!data.data) throw new Error(data.message);
  return data.data;
}

export async function createLead(payload: CreateLeadPayload): Promise<Lead> {
  const { data } = await axiosInstance.post<ApiResponse<Lead>>('/leads', payload);
  if (!data.data) throw new Error(data.message);
  return data.data;
}

export async function updateLead(id: string, payload: UpdateLeadPayload): Promise<Lead> {
  const { data } = await axiosInstance.put<ApiResponse<Lead>>(`/leads/${id}`, payload);
  if (!data.data) throw new Error(data.message);
  return data.data;
}

export async function deleteLead(id: string): Promise<void> {
  await axiosInstance.delete(`/leads/${id}`);
}

export async function exportLeadsCSV(
  filters: Omit<LeadFilters, 'page'> = {},
): Promise<Blob> {
  try {
    console.log('[CSV Export] Starting export with filters:', filters);
    
    const token = localStorage.getItem('auth-storage');
    if (!token) {
      console.error('[CSV Export] No auth token found in localStorage');
    } else {
      console.log('[CSV Export] Auth token found');
    }

    const { data } = await axiosInstance.get<Blob>('/leads/export/csv', {
      params: filters,
      responseType: 'blob',
    });
    
    console.log('[CSV Export] Export successful, blob size:', data.size);
    return data;
  } catch (error: any) {
    console.error('[CSV Export] Error:', {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      message: error?.message,
      headers: error?.response?.headers,
      data: error?.response?.data,
    });
    throw error;
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await axiosInstance.get<ApiResponse<DashboardStats>>('/leads/dashboard/stats');
  if (!data.data) throw new Error(data.message);
  return data.data;
}
