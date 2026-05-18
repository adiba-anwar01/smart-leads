import { axiosInstance } from './axios.instance';
import type { ApiResponse, AuthResponseData, LoginFormData, RegisterFormData } from '../types';

export async function register(data: RegisterFormData): Promise<AuthResponseData> {
  const response = await axiosInstance.post<ApiResponse<AuthResponseData>>('/auth/register', data);
  return response.data.data!;
}

export async function login(data: LoginFormData): Promise<AuthResponseData> {
  const response = await axiosInstance.post<ApiResponse<AuthResponseData>>('/auth/login', data);
  return response.data.data!;
}
