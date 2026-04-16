"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useLoan, useCreateLoan, useReturnBook } from "@/hooks/useLoan";
import { useBook } from "@/hooks/useBook";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { StatusPeminjaman } from "@/types";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

const statusVariant: Record<StatusPeminjaman, "default" | "secondary" | "destructive"> = {
    DIPINJAM: "default",
    DIKEMBALIKAN: "secondary",
    TERLAMBAT: "destructive",
};

const peminjamanSchema = z.object({
    bukuId: z.coerce.number().min(1, "Pilih buku"),
    tanggalKembali: z.string().min(1, "Tanggal kembali wajib diisi"),
});

export default function PeminjamanPage() {
    const { user } = useAuthStore();
    const isAdmin = user?.role === "ADMIN";

    const [filterStatus, setFilterStatus] = useState<StatusPeminjaman | "">("");
    const [page, setPage] = useState(1);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [kembalikanId, setKembalikanId] = useState<number | null>(null);

    const { data, isLoading } = useLoan({
        status: filterStatus || undefined,
        page,
        limit: 10,
    });
    const { data: bukuData } = useBook({ limit: 100 });
    const createPeminjaman = useCreateLoan();
    const kembalikan = useReturnBook();

    const form = useForm({ resolver: zodResolver(peminjamanSchema), defaultValues: { bukuId: 0, tanggalKembali: "" } });

    const handleSubmit = async (values: any) => {
        await createPeminjaman.mutateAsync(values);
        setDialogOpen(false);
        form.reset();
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title={isAdmin ? "Transaksi Peminjaman" : "Peminjamanku"}
                description={isAdmin ? "Kelola semua transaksi peminjaman" : "Lihat riwayat peminjamanmu"}
                action={
                    <Button onClick={() => setDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" /> Pinjam Buku
                    </Button>
                }
            />

            {/* Filter */}
            <Select
                value={filterStatus || "ALL"}
                onValueChange={(v) => {
                    setFilterStatus(v === "ALL" ? "" : v as StatusPeminjaman);
                    setPage(1);
                }}
            >
                <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ALL">Semua Status</SelectItem> 
                    <SelectItem value="DIPINJAM">Dipinjam</SelectItem>
                    <SelectItem value="DIKEMBALIKAN">Dikembalikan</SelectItem>
                    <SelectItem value="TERLAMBAT">Terlambat</SelectItem>
                </SelectContent>
            </Select>

            {isLoading ? <LoadingSpinner /> : (
                <>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {isAdmin && <TableHead>Peminjam</TableHead>}
                                    <TableHead>Buku</TableHead>
                                    <TableHead>Tgl Pinjam</TableHead>
                                    <TableHead>Batas Kembali</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.data.length === 0 && (
                                    <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-10">Belum ada data peminjaman</TableCell></TableRow>
                                )}
                                {data?.data.map((p) => (
                                    <TableRow key={p.id}>
                                        {isAdmin && <TableCell>{p.user.nama}<br /><span className="text-xs text-muted-foreground">{p.user.username}</span></TableCell>}
                                        <TableCell className="font-medium">{p.buku.judul}</TableCell>
                                        <TableCell>{formatDate(p.tanggalPinjam)}</TableCell>
                                        <TableCell>{formatDate(p.tanggalKembali)}</TableCell>
                                        <TableCell><Badge variant={statusVariant[p.status]}>{p.status}</Badge></TableCell>
                                        <TableCell className="text-right">
                                            {p.status === "DIPINJAM" && (
                                                <Button size="sm" variant="outline" onClick={() => setKembalikanId(p.id)}>
                                                    Kembalikan
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {data && data.totalPages > 1 && (
                        <div className="flex justify-center gap-2">
                            <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Sebelumnya</Button>
                            <span className="flex items-center text-sm text-muted-foreground">Halaman {page} dari {data.totalPages}</span>
                            <Button variant="outline" disabled={page === data.totalPages} onClick={() => setPage(p => p + 1)}>Berikutnya</Button>
                        </div>
                    )}
                </>
            )}

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Pinjam Buku</DialogTitle>
                    </DialogHeader>

                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4"
                    >
                        <FieldGroup>

                            <Field>
                                <FieldLabel>Pilih Buku</FieldLabel>
                                <Select
                                    onValueChange={(value) =>
                                        form.setValue("bukuId", Number(value))
                                    }
                                    defaultValue={
                                        form.getValues("bukuId")
                                            ? String(form.getValues("bukuId"))
                                            : undefined
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih buku yang ingin dipinjam" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {bukuData?.data
                                            .filter((b) => b.stok > 0)
                                            .map((b) => (
                                                <SelectItem key={b.id} value={String(b.id)}>
                                                    {b.judul} (stok: {b.stok})
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>

                                {form.formState.errors.bukuId && (
                                    <p className="text-sm text-red-500">
                                        {form.formState.errors.bukuId.message}
                                    </p>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel>Tanggal Kembali</FieldLabel>
                                <Input
                                    type="date"
                                    min={new Date().toISOString().split("T")[0]}
                                    {...form.register("tanggalKembali")}
                                />

                                {form.formState.errors.tanggalKembali && (
                                    <p className="text-sm text-red-500">
                                        {form.formState.errors.tanggalKembali.message}
                                    </p>
                                )}
                            </Field>

                            {/* BUTTON */}
                            <Field>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={createPeminjaman.isPending}
                                >
                                    {createPeminjaman.isPending
                                        ? "Memproses..."
                                        : "Pinjam"}
                                </Button>
                            </Field>

                        </FieldGroup>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Confirm kembalikan */}
            <AlertDialog open={!!kembalikanId} onOpenChange={() => setKembalikanId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Kembalikan buku ini?</AlertDialogTitle>
                        <AlertDialogDescription>Pastikan buku sudah dikembalikan secara fisik.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={async () => { if (kembalikanId) await kembalikan.mutateAsync(kembalikanId); setKembalikanId(null); }}>
                            Ya, Kembalikan
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}