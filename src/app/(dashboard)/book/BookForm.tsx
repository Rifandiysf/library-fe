import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Buku } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const bookSchema = z.object({
    judul: z.string().min(1, "Title has required"),
    pengarang: z.string().min(1, "Author has required"),
    penerbit: z.string().min(1, "Publisher has required"),
    tahunTerbit: z.number().min(1900).max(new Date().getFullYear()),
    stok: z.number().min(0, "Stock cannot be negative"),
    kategori: z.string().min(1, "category has required"),
});

export type BookFormData = z.infer<typeof bookSchema>;

interface BookFormProps {
    defaultValues?: Partial<Buku>;
    onSubmit: (data: BookFormData) => Promise<void>;
    isLoading?: boolean;
}

export function BookForm({ defaultValues, onSubmit, isLoading }: BookFormProps) {
    const form = useForm<BookFormData>({
        resolver: zodResolver(bookSchema),
        defaultValues: {
            judul: defaultValues?.judul ?? "",
            pengarang: defaultValues?.pengarang ?? "",
            penerbit: defaultValues?.penerbit ?? "",
            tahunTerbit: defaultValues?.tahunTerbit ?? new Date().getFullYear(),
            stok: defaultValues?.stok ?? 0,
            kategori: defaultValues?.kategori ?? "",
        },
    });

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={"flex flex-col gap-4"}
        >
            <FieldGroup>

                <Field>
                    <FieldLabel>Title</FieldLabel>
                    <Input {...form.register("judul")} />
                    {form.formState.errors.judul && (
                        <p className="text-sm text-red-500">
                            {form.formState.errors.judul.message}
                        </p>
                    )}
                </Field>

                <div className="grid grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel>Author</FieldLabel>
                        <Input {...form.register("pengarang")} />
                        {form.formState.errors.pengarang && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.pengarang.message}
                            </p>
                        )}
                    </Field>

                    <Field>
                        <FieldLabel>Publisher</FieldLabel>
                        <Input {...form.register("penerbit")} />
                        {form.formState.errors.penerbit && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.penerbit.message}
                            </p>
                        )}
                    </Field>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <Field>
                        <FieldLabel>Publication Year</FieldLabel>
                        <Input
                            type="number"
                            {...form.register("tahunTerbit", {
                                valueAsNumber: true,
                            })}
                        />
                        {form.formState.errors.tahunTerbit && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.tahunTerbit.message}
                            </p>
                        )}
                    </Field>

                    <Field>
                        <FieldLabel>Stock</FieldLabel>
                        <Input
                            type="number"
                            {...form.register("stok", {
                                valueAsNumber: true,
                            })}
                        />
                        {form.formState.errors.stok && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.stok.message}
                            </p>
                        )}
                    </Field>

                    <Field>
                        <FieldLabel>Category</FieldLabel>
                        <Input {...form.register("kategori")} />
                        {form.formState.errors.kategori && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.kategori.message}
                            </p>
                        )}
                    </Field>
                </div>

                <Field>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? "Keep..." : "Save"}
                    </Button>
                </Field>

            </FieldGroup>
        </form>
    )
}