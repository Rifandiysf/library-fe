'use client'
import { useAuthStore } from "@/store/auth.store";
import { BookOpen, ClipboardList, LayoutDashboard, Library, LogOut, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navAdmin = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/book", label: "Manage Book", icon: BookOpen },
    { href: "/member", label: "Manage Member", icon: Users },
    { href: "/loan", label: "Transaction", icon: ClipboardList },
];

const navStudent = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/book", label: "Book List", icon: BookOpen },
    { href: "/loan", label: "My Loan", icon: ClipboardList },
];

export function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useAuthStore();
    const nav = user?.role === "ADMIN" ? navAdmin : navStudent;

    const handleLogout = () => {
        logout();
        router.replace("/login");
    };

    return (
        <aside className="flex h-screen w-64 flex-col border-r bg-card">
            <div className="flex items-center gap-2 px-6 py-5 border-b">
                <Library className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">Perpustakaan</span>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1">
                {nav.map(({ href, label, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            pathname === href
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        <Icon className="h-4 w-4" />
                        {label}
                    </Link>
                ))}
            </nav>

            <div className="border-t p-4">
                <div className="mb-3 px-3">
                    <p className="text-sm font-medium">{user?.nama}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role?.toLowerCase()}</p>
                </div>
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-destructive hover:text-destructive"
                    onClick={handleLogout}
                >
                    <LogOut className="h-4 w-4" />
                    Keluar
                </Button>
            </div>
        </aside>
    )
}