import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserPayload } from "@/types";

function setCookie(name: string, value: string, days = 1) {
    const expires = new Date();
    expires.setDate(expires.getDate() + days);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function deleteCookie(name: string) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
}

interface AuthState {
    token: string | null;
    user: UserPayload | null;
    isAuthenticated: boolean;
    setAuth: (token: string, user: UserPayload) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            isAuthenticated: false,

            setAuth: (token, user) => {
                setCookie("auth-token", token, 1);
                setCookie("user-role", user.role, 1);
                set({ token, user, isAuthenticated: true });
            },

            logout: () => {
                deleteCookie("auth-token");
                deleteCookie("user-role");
                set({ token: null, user: null, isAuthenticated: false });
            },
        }),
        {
            name: "auth-storage",
        }
    )
);