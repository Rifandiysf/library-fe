import api from "@/lib/api";
import { Anggota, ApiResponse, PaginatedResponse } from "@/types";

export interface GetMemberParams {
    search?: string;
    page?: number;
    limit?: number;
}

export interface UpdateMemberData {
    nama?: string;
    kelas?: string;
    password?: string;
}

export const memberService = {
    getAll: async (params?: GetMemberParams): Promise<PaginatedResponse<Anggota>> => {
        const res = await api.get<ApiResponse<PaginatedResponse<Anggota>>>("/members", { params });
        return res.data.data!;
    },

    getById: async (id: number): Promise<Anggota> => {
        const res = await api.get<ApiResponse<Anggota>>(`/members/${id}`);
        return res.data.data!;
    },

    update: async (id: number, data: UpdateMemberData): Promise<Anggota> => {
        const res = await api.put<ApiResponse<Anggota>>(`/members/${id}`, data);
        return res.data.data!;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/members/${id}`);
    },
};