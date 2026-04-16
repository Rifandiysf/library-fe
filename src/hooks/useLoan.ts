import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { loanService, GetLoanParams } from "@/services/loan.service";
import { CreatePeminjamanRequest } from "@/types";
import { AxiosError } from "axios";
import { toast } from "sonner";

type ApiError = AxiosError<{ message: string }>;

export const LOAN_KEY = "loans";

export function useLoan(params?: GetLoanParams) {
    return useQuery({
        queryKey: [LOAN_KEY, params],
        queryFn: () => loanService.getAll(params),
    })
};

export function useCreateLoan() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreatePeminjamanRequest ) => loanService.create(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: [LOAN_KEY] });
            qc.invalidateQueries({ queryKey: ["books"] });
            toast.success("Loan successfully created!");
        },
        onError: (err: ApiError) => {
            toast.error(err.response?.data?.message || "Loan failed to Create!");
        }
    });
};

export function useReturnBook() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number ) => loanService.kembalikan(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: [LOAN_KEY] });
            qc.invalidateQueries({ queryKey: ["books"] });
            toast.success("Book successfully returned!");
        },
        onError: (err: ApiError) => {
            toast.error(err.response?.data?.message || "Book failed to return!");
        }
    });
};