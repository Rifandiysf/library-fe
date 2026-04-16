'use client'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/auth.store";
import { z } from "zod";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
    const router = useRouter();
    const setAuth = useAuthStore((s) => s.setAuth)

    const form = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: { username: "", password: "" },
    });

    const onSubmit = async (values: LoginForm) => {
        try {
            const data = await authService.login(values);
            setAuth(data.accessToken, data.user);
            toast.success(`Wellcom ${data.user.nama}`);
            router.replace("/dashboard");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <section className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Login to account</CardTitle>
                            <CardDescription>
                                Enter your username and password to login
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <FieldGroup>

                                    <Field>
                                        <FieldLabel>Username</FieldLabel>
                                        <Input
                                            placeholder="Masukkan username"
                                            {...form.register("username")}
                                        />
                                        {form.formState.errors.username && (
                                            <p className="text-sm text-red-500">
                                                {form.formState.errors.username.message}
                                            </p>
                                        )}
                                    </Field>

                                    <Field>
                                        <Input
                                            type="password"
                                            placeholder="Masukkan password"
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
                                            {form.formState.isSubmitting ? "Loading..." : "Login"}
                                        </Button>

                                        <FieldDescription className="text-center">
                                            Dont have account?{" "}
                                            <Link href="/register" className="underline">
                                                Register
                                            </Link>
                                        </FieldDescription>
                                    </Field>

                                </FieldGroup>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}