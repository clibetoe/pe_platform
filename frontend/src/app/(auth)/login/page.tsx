"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      await login(data.email, data.password);
    } catch {
      setError("Invalid email or password. Please try again.");
    }
  };

  if (user) {
    const dest = ["admin", "super_admin"].includes(user.role)
      ? "/admin/dashboard"
      : ["teacher", "coach"].includes(user.role)
      ? "/teacher/dashboard"
      : "/student/dashboard";
    router.replace(dest);
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <span className="text-2xl font-bold text-brand-700">PE</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-brand-200 mt-1">Sign in to continue learning</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              {...register("email")}
              id="email"
              label="Email Address"
              type="email"
              placeholder="you@school.edu"
              error={errors.email?.message}
            />
            <Input
              {...register("password")}
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
            />

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-brand-600 font-medium hover:underline">
              Register here
            </a>
          </p>
        </div>

        <p className="text-center text-xs text-brand-300 mt-6">
          PE Platform · Olympic Values Education Programme
        </p>
      </div>
    </div>
  );
}
