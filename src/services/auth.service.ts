import api from "@/lib/api";
import { LoginRequest, RegisterRequest, AuthResponse, ApiResponse, Anggota } from "@/types";

export const authService = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<ApiResponse<AuthResponse>>("/auth/login", data);
        return response.data.data!;
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await api.post<ApiResponse<AuthResponse>>("/auth/register", data);
        return response.data.data!;
    },

    getProfile: async (): Promise<Anggota> => {
        const response = await api.post<ApiResponse<Anggota>>("/auth/profile");
        return response.data.data!;
    }
};