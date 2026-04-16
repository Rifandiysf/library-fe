import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { memberService, GetMemberParams, UpdateMemberData } from "@/services/member.service";
import { toast } from "sonner";
import { AxiosError } from "axios";

type ApiError = AxiosError<{ message: string }>;

export const MEMBER_KEY = "members";

export function useMember(params?: GetMemberParams) {
    return useQuery({
        queryKey: [MEMBER_KEY, params],
        queryFn: () => memberService.getAll(params),
    });
};

export function useUpdateMember() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number, data: UpdateMemberData }) => memberService.update(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: [MEMBER_KEY] });
            toast.success("Member updated successfully!");
        },
        onError: (err: ApiError) => {
            toast.error(err.response?.data?.message || "Member failed to update!");
        }
    });
};

export function useDeleteMember() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => memberService.delete(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: [MEMBER_KEY] });
            toast.success("Member deleted successfully!");
        },
        onError: (err: ApiError) => {
            toast.error(err.response?.data?.message || "Member failed to delete!");
        }
    });
};