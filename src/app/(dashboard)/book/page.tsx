"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useBook, useCreateBook, useUpdateBook, useDeleteBook } from "@/hooks/useBook";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Buku } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { BookForm, BookFormData } from "./BookForm";
import { SearchInput } from "@/components/shared/SearchInput";

export default function BookPage() {
    const { user } = useAuthStore();
    const isAdmin = user?.role === "ADMIN";

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [editData, setEditData] = useState<Buku | null>(null);

    const { data, isLoading } = useBook({ search, page, limit: 10 });
    const createBuku = useCreateBook();
    const updateBuku = useUpdateBook();
    const deleteBuku = useDeleteBook();

    const handleOpenCreate = () => { setEditData(null); setDialogOpen(true); };
    const handleOpenEdit = (buku: Buku) => { setEditData(buku); setDialogOpen(true); };

    const handleSubmit = async (formData: BookFormData) => {
        if (editData) {
            await updateBuku.mutateAsync({ id: editData.id, data: formData });
        } else {
            await createBuku.mutateAsync(formData);
        }
        setDialogOpen(false);
    };

    const handleDelete = async () => {
        if (deleteId) await deleteBuku.mutateAsync(deleteId);
        setDeleteId(null);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Books List"
                description="Manage library book collections"
                action={isAdmin && (
                    <Button onClick={handleOpenCreate}>
                        <Plus className="h-4 w-4 mr-2" /> Add Book
                    </Button>
                )}
            />

            <div className="flex items-center gap-4">
                <SearchInput placeholder="Search for title or author..." onSearch={(v) => { setSearch(v); setPage(1); }} />
            </div>

            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Year</TableHead>
                                    <TableHead>Stock</TableHead>
                                    {isAdmin && <TableHead className="text-right">Action</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.data.length === 0 && (
                                    <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-10">No books found</TableCell></TableRow>
                                )}
                                {data?.data.map((buku) => (
                                    <TableRow key={buku.id}>
                                        <TableCell className="font-medium">{buku.judul}</TableCell>
                                        <TableCell>{buku.pengarang}</TableCell>
                                        <TableCell><Badge variant="secondary">{buku.kategori}</Badge></TableCell>
                                        <TableCell>{buku.tahunTerbit}</TableCell>
                                        <TableCell>
                                            <Badge variant={buku.stok > 0 ? "default" : "destructive"}>
                                                {buku.stok} available
                                            </Badge>
                                        </TableCell>
                                        {isAdmin && (
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button size="icon" variant="ghost" onClick={() => handleOpenEdit(buku)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeleteId(buku.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {data && data.totalPages > 1 && (
                        <div className="flex justify-center gap-2">
                            <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                            <span className="flex items-center text-sm text-muted-foreground">Page {page} dari {data.totalPages}</span>
                            <Button variant="outline" disabled={page === data.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
                        </div>
                    )}
                </>
            )}

            {/* Dialog Create/Edit */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editData ? "Edit Book" : "Add new book"}</DialogTitle>
                    </DialogHeader>
                    <BookForm
                        defaultValues={editData ?? undefined}
                        onSubmit={handleSubmit}
                        isLoading={createBuku.isPending || updateBuku.isPending}
                    />
                </DialogContent>
            </Dialog>

            {/* Alert Dialog Delete */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this book?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}