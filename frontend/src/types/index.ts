export enum LeadStatus {
  New = 'New',
  Contacted = 'Contacted',
  Qualified = 'Qualified',
  Lost = 'Lost',
}
export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export type UserRole = 'admin' | 'sales_user';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

export interface ILead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: string | User;
  createdAt: string;
  updatedAt: string;
}

export interface LeadFilters {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: 'latest' | 'oldest';
  page?: number;
  createdBy?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedLeadsResponse {
  leads: ILead[];
  pagination: PaginationMeta;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface AuthResponseData {
  token: string;
  user: User;
}

export interface DashboardStats {
  totalLeads: number;
  newThisMonth: number;
  qualifiedLeads: number;
  contactedLeads: number;
  statusCounts: Record<string, number>;
  sourceCounts: Record<string, number>;
}

export interface CreateLeadFormData {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

export type UpdateLeadFormData = Partial<CreateLeadFormData>;

export type Lead = ILead;
export type CreateLeadPayload = CreateLeadFormData;
export type UpdateLeadPayload = UpdateLeadFormData;
