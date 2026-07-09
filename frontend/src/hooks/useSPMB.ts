import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from 'sonner';

// ==================== GELOMBANG ====================
export interface GelombangRecord {
  id: string;
  nama: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  kuota: number | null;
  biaya_pendaftaran: number;
  is_active: boolean;
  redirect_url?: string | null;
  pendaftars_count?: number;
}

export function useGelombangList() {
  return useQuery({
    queryKey: ['spmb-gelombang'],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const res = await api.get<GelombangRecord[]>('/spmb/gelombang');
      return res.data;
    },
  });
}

export function useGelombang(id: string | undefined) {
  return useQuery({
    queryKey: ['spmb-gelombang', id],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const res = await api.get<GelombangRecord>(`/spmb/gelombang/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateGelombang() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<GelombangRecord, 'id' | 'pendaftars_count'>) => {
      const res = await api.post('/spmb/gelombang', data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['spmb-gelombang'] }),
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}

export function useUpdateGelombang() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<GelombangRecord> }) => {
      const res = await api.put(`/spmb/gelombang/${id}`, data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['spmb-gelombang'] }),
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}

export function useDeleteGelombang() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/spmb/gelombang/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['spmb-gelombang'] }),
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}

// ==================== PENDAFTAR ====================
export interface PendaftarRecord {
  id: string;
  gelombang_id: string;
  nisn: string;
  nama_lengkap: string;
  asal_sekolah: string;
  email: string;
  no_hp: string;
  alamat: string;
  status: 'baru' | 'diverifikasi' | 'diterima' | 'ditolak';
  data_form: Record<string, unknown> | null;
  gelombang?: GelombangRecord;
  created_at: string;
}

export function usePendaftarList(gelombangId?: string, search?: string) {
  return useQuery({
    queryKey: ['spmb-pendaftar', gelombangId, search],
    staleTime: 30 * 1000,
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (gelombangId) params.gelombang_id = gelombangId;
      if (search) params.search = search;
      const res = await api.get<PendaftarRecord[]>('/spmb/pendaftar', { params });
      return res.data;
    },
  });
}

export function usePendaftar(id: string | undefined) {
  return useQuery({
    queryKey: ['spmb-pendaftar', id],
    staleTime: 30 * 1000,
    queryFn: async () => {
      const res = await api.get<PendaftarRecord>(`/spmb/pendaftar/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreatePendaftar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      gelombang_id: string;
      nisn: string;
      nama_lengkap: string;
      asal_sekolah: string;
      email: string;
      no_hp: string;
      alamat: string;
      data_form?: Record<string, unknown>;
    }) => {
      const res = await api.post('/spmb/daftar', data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['spmb-pendaftar'] }),
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}

export function useUpdatePendaftar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PendaftarRecord> }) => {
      const res = await api.put(`/spmb/pendaftar/${id}`, data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['spmb-pendaftar'] }),
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}

export function useDeletePendaftar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/spmb/pendaftar/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['spmb-pendaftar'] }),
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}

// ==================== PUBLIC GELOMBANG ====================
export function usePublicGelombangAktif() {
  return useQuery({
    queryKey: ['spmb-public-gelombang'],
    staleTime: 30 * 1000,
    queryFn: async () => {
      const res = await api.get<GelombangRecord[]>('/spmb/gelombang-aktif');
      return res.data;
    },
  });
}

// ==================== FORM FIELDS ====================
export interface FormFieldRecord {
  id: string;
  gelombang_id: string | null;
  label: string;
  field_type: 'text' | 'textarea' | 'select' | 'file' | 'date';
  options: string[] | null;
  is_required: boolean;
  urutan: number;
}

export function useFormFieldList(gelombangId?: string) {
  return useQuery({
    queryKey: ['spmb-form-fields', gelombangId],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (gelombangId) params.gelombang_id = gelombangId;
      const res = await api.get<FormFieldRecord[]>('/spmb/form-fields', { params });
      return res.data;
    },
  });
}

export function useCreateFormField() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<FormFieldRecord, 'id'>) => {
      const res = await api.post('/spmb/form-fields', data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['spmb-form-fields'] }),
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}

export function useUpdateFormField() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<FormFieldRecord> }) => {
      const res = await api.put(`/spmb/form-fields/${id}`, data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['spmb-form-fields'] }),
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}

export function useDeleteFormField() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/spmb/form-fields/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['spmb-form-fields'] }),
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}

// Public form fields per gelombang
export function usePublicFormFields(gelombangId: string) {
  return useQuery({
    queryKey: ['spmb-public-form-fields', gelombangId],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const res = await api.get<FormFieldRecord[]>(`/spmb/form-fields/${gelombangId}`);
      return res.data;
    },
    enabled: !!gelombangId,
  });
}
