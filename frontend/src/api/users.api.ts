import { axiosInstance } from './axios.instance';
import type { ApiResponse, User } from '../types';

export async function getUsers(): Promise<User[]> {
  const { data } = await axiosInstance.get<ApiResponse<User[]>>('/users');
  if (!data.data) throw new Error(data.message);
  return data.data;
}

export async function deleteUser(id: string): Promise<void> {
  await axiosInstance.delete(`/users/${id}`);
}

export async function updateUserStatus(id: string, isActive: boolean): Promise<User> {
  const { data } = await axiosInstance.patch<ApiResponse<User>>(`/users/${id}/status`, { isActive });
  if (!data.data) throw new Error(data.message);
  return data.data;
}
