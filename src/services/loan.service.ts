import api from "@/lib/api";
import {
    Peminjaman,
    CreatePeminjamanRequest,
    ApiResponse,
    PaginatedResponse,
    StatusPeminjaman,
} from "@/types";

export interface GetLoanParams {
    status?: StatusPeminjaman;
    page?: number;
    limit?: number;
}

export const loanService = {
    getAll: async (params?: GetLoanParams): Promise<PaginatedResponse<Peminjaman>> => {
        const res = await api.get<ApiResponse<PaginatedResponse<Peminjaman>>>("/loans", { params });
        return res.data.data!;
    },

    create: async (data: CreatePeminjamanRequest): Promise<Peminjaman> => {
        const res = await api.post<ApiResponse<Peminjaman>>("/loans", data);
        return res.data.data!;
    },

    kembalikan: async (id: number): Promise<Peminjaman> => {
        const res = await api.patch<ApiResponse<Peminjaman>>(`/loans/${id}/kembalikan`);
        return res.data.data!;
    },
};