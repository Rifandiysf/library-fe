import api from "@/lib/api";
import {
    Buku,
    CreateBukuRequest,
    UpdateBukuRequest,
    ApiResponse,
    PaginatedResponse,
} from "@/types";

export interface GetBookParams {
    search?: string;
    kategori?: string;
    page?: number;
    limit?: number;
}

export const bookService = {
    getAll: async (params?: GetBookParams): Promise<PaginatedResponse<Buku>> => {
        const res = await api.get<ApiResponse<PaginatedResponse<Buku>>>("/books", { params });
        return res.data.data!;
    },

    getById: async (id: number): Promise<Buku> => {
        const res = await api.get<ApiResponse<Buku>>(`/books/${id}`);
        return res.data.data!;
    },

    create: async (data: CreateBukuRequest): Promise<Buku> => {
        const res = await api.post<ApiResponse<Buku>>("/books", data);
        return res.data.data!;
    },

    update: async (id: number, data: UpdateBukuRequest): Promise<Buku> => {
        const res = await api.put<ApiResponse<Buku>>(`/books/${id}`, data);
        return res.data.data!;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/books/${id}`);
    },
};