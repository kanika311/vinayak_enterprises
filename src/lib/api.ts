import axios from 'axios';

import { ADMIN_BASE } from '@/lib/constants';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const authPath = config.url || '';
    const isPublicAuth =
      authPath.includes('/auth/login') ||
      authPath.includes('/auth/forgot-password') ||
      authPath.includes('/auth/reset-password');

    if (!isPublicAuth) {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (!path.includes(`${ADMIN_BASE}/login`)) {
        localStorage.removeItem('token');
        window.location.href = `${ADMIN_BASE}/login`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const apiGet = async <T>(url: string, params?: Record<string, unknown>) => {
  const { data } = await api.get<{ success: boolean; data: T; message?: string }>(url, { params });
  return data.data;
};

export const apiPost = async <T>(url: string, body?: unknown) => {
  const { data } = await api.post<{ success: boolean; data: T; message?: string }>(url, body);
  return data.data;
};

export const apiPut = async <T>(url: string, body?: unknown) => {
  const { data } = await api.put<{ success: boolean; data: T; message?: string }>(url, body);
  return data.data;
};

export const apiDelete = async <T>(url: string) => {
  const { data } = await api.delete<{ success: boolean; data: T; message?: string }>(url);
  return data.data;
};

export const apiUpload = async <T>(url: string, file: File, folder?: string) => {
  const formData = new FormData();
  formData.append('file', file);
  if (folder) formData.append('folder', folder);
  const { data } = await api.post<{ success: boolean; data: T }>(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
};
