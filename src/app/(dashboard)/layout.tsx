
import { Sidebar } from "@/components/shared/Sidebar";
import { AuthGuard } from "@/providers/AuthGuard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <div className="flex h-screen overflow-hidden bg-background">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </AuthGuard>
    );
}