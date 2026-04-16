'use client'
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBook } from "@/hooks/useBook";
import { useLoan } from "@/hooks/useLoan";
import { useMember } from "@/hooks/useMember";
import { useAuthStore } from "@/store/auth.store"
import { AlertTriangle, BookOpen, ClipboardList, Users } from "lucide-react";

function DashboardPage() {
    const { user } = useAuthStore();
    const isAdmin = user?.role === "ADMIN";

    const { data: book } = useBook({ limit: 1 });
    const { data: loan } = useLoan({ limit: 1 });
    const { data: member } = useMember({ limit: 1 });
    const { data: late } = useLoan({ status: "TERLAMBAT", limit: 1 });

    const stats = isAdmin
        ? [
            { label: "Total Book", value: book?.total ?? "-", icon: BookOpen, color: "text-blue-600" },
            { label: "Total Member", value: member?.total ?? "-", icon: Users, color: "text-green-600" },
            { label: "Currently Borrowed", value: loan?.total ?? "-", icon: ClipboardList, color: "text-orange-600" },
            { label: "Late", value: late?.total ?? "-", icon: AlertTriangle, color: "text-red-600" },
        ]
        : [
            { label: "My Loan", value: loan?.total ?? "-", icon: ClipboardList, color: "text-orange-600" },
            { label: "Late", value: late?.total ?? "-", icon: AlertTriangle, color: "text-red-600" },
        ];

    return (
        <div className="space-y-6">
            <PageHeader
                title={`Wellcome, ${user?.nama} 👋`}
                description={isAdmin ? "Manage the school's digital library" : "View and manage your loans"}
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map(({ label, value, icon: Icon, color }) => (
                    <Card key={label}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                            <Icon className={`h-5 w-5 ${color}`} />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default DashboardPage