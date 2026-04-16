'use client'

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
    children: React.ReactNode;
    requireRole?: "ADMIN" | "SISWA";
};

export function AuthGuard({ children, requireRole }: AuthGuardProps) {
    const { isAuthenticated, user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/login");
            return;
        }
        if (requireRole && user?.role !== requireRole) {
            router.replace("/");
        }
    }, [isAuthenticated, user, requireRole, router]);

    if (!isAuthenticated) return null;
    if (!requireRole && user?.role !== requireRole) return null;

    return <>{children}</>;
}