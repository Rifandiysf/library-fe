"use client";

import { useState } from "react";
import { useMember, useDeleteMember } from "@/hooks/useMember";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AnggotaPage() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const { data, isLoading } = useMember({ search, page, limit: 10 });
    const deleteAnggota = useDeleteMember();

    return (
        <div className="space-y-6">
            <PageHeader title="Kelola Anggota" description="Manajemen data siswa perpustakaan" />

            <SearchInput placeholder="Cari nama atau username..." onSearch={(v) => { setSearch(v); setPage(1); }} />

            {isLoading ? <LoadingSpinner /> : (
                <>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Username</TableHead>
                                    <TableHead>Kelas</TableHead>
                                    <TableHead>Bergabung</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.data.length === 0 && (
                                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-10">Tidak ada anggota ditemukan</TableCell></TableRow>
                                )}
                                {data?.data.map((a) => (
                                    <TableRow key={a.id}>
                                        <TableCell className="font-medium">{a.nama}</TableCell>
                                        <TableCell>{a.username}</TableCell>
                                        <TableCell>{a.kelas ?? "-"}</TableCell>
                                        <TableCell>{formatDate(a.createdAt)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeleteId(a.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
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

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus anggota ini?</AlertDialogTitle>
                        <AlertDialogDescription>Data anggota akan dihapus permanen.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={async () => { if (deleteId) await deleteAnggota.mutateAsync(deleteId); setDeleteId(null); }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}