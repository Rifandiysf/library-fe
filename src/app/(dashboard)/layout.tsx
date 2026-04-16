import { Sidebar } from "@/components/shared/Sidebar";
import { AuthGuard } from "@/providers/AuthGuard";


export default function dashboardLayout({children}: {children: React.ReactNode}) {
    return (
        <AuthGuard>
            <div className="flex overflow-hidden bg-background h-screen"s>
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </AuthGuard>
    )
}