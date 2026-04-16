import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookService, GetBookParams } from "@/services/book.service";
import { CreateBukuRequest, UpdateBukuRequest } from "@/types";
import { AxiosError } from "axios";
import { toast } from "sonner";

type ApiError = AxiosError<{ message: string }>;

export const BOOK_KEY = "books";

export function useBook(params?: GetBookParams) {
    return useQuery({
        queryKey: [BOOK_KEY, params],
        queryFn: () => bookService.getAll(params),
    })
};

export function useCreateBook() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateBukuRequest) => bookService.create(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: [BOOK_KEY] });
            toast.success("Books added successfully!");
        },
        onError: (err: ApiError) => {
            toast.error(err.response?.data?.message || "Books failed to add!");
        }
    });
};

export function useUpdateBook() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number, data: UpdateBukuRequest }) => bookService.update(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: [BOOK_KEY] });
            toast.success("Books updated successfully!");
        },
        onError: (err: ApiError) => {
            toast.error(err.response?.data?.message || "Books failed to update!");
        }
    });
};

export function useDeleteBook() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => bookService.delete(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: [BOOK_KEY] });
            toast.success("Books deleted successfully!");
        },
        onError: (err: ApiError) => {
            toast.error(err.response?.data?.message || "Books failed to delete!");
        }
    });
};