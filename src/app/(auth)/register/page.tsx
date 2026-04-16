'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod"


const registerSchema = z.object({
    nama: z.string().min(2, "Name must be at least 2 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    kelas: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const setAuth = useAuthStore((s) => s.setAuth);

    const form = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        defaultValues: { nama: "", username: "", kelas: "", password: "" },
    });

    const onSubmit = async (value: RegisterForm) => {
        try {
            const data = await authService.register(value);
            setAuth(data.accessToken, data.user);
            toast.success("Register success")
            router.replace("/login")
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Login failed");
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
        >
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Register account</CardTitle>
                    <CardDescription>
                        Create an account to access the system
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>

                            <Field>
                                <FieldLabel>Full Name</FieldLabel>
                                <Input
                                    placeholder="Full Name"
                                    {...form.register("nama")}
                                />
                                {form.formState.errors.nama && (
                                    <p className="text-sm text-red-500">
                                        {form.formState.errors.nama.message}
                                    </p>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel>Username</FieldLabel>
                                <Input
                                    placeholder="Username"
                                    {...form.register("username")}
                                />
                                {form.formState.errors.username && (
                                    <p className="text-sm text-red-500">
                                        {form.formState.errors.username.message}
                                    </p>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel>
                                    Class{" "}
                                    <span className="text-muted-foreground">(opsional)</span>
                                </FieldLabel>
                                <Input
                                    placeholder="Ex: XII RPL 1"
                                    {...form.register("kelas")}
                                />
                            </Field>

                            <Field>
                                <FieldLabel>Password</FieldLabel>
                                <Input
                                    type="password"
                                    placeholder="at least 6 characters"
                                    {...form.register("password")}
                                />
                                {form.formState.errors.password && (
                                    <p className="text-sm text-red-500">
                                        {form.formState.errors.password.message}
                                    </p>
                                )}
                            </Field>

                            <Field>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={form.formState.isSubmitting}
                                >
                                    {form.formState.isSubmitting ? "process..." : "Register"}
                                </Button>

                                <FieldDescription className="text-center">
                                    Already have account?{" "}
                                    <Link href="/login" className="underline">
                                        Login
                                    </Link>
                                </FieldDescription>
                            </Field>

                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

