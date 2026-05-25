"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authApi } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const schema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["student", "teacher"]),
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "student" },
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      await authApi.register(data);
      router.push("/login?registered=1");
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { email?: string[] } } })?.response?.data?.email?.[0];
      setError(msg ?? "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <span className="text-2xl font-bold text-brand-700">PE</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-brand-200 mt-1">Join the PE learning platform</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                {...register("first_name")}
                id="first_name"
                label="First Name"
                placeholder="Thabo"
                error={errors.first_name?.message}
              />
              <Input
                {...register("last_name")}
                id="last_name"
                label="Last Name"
                placeholder="Mokoena"
                error={errors.last_name?.message}
              />
            </div>

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
              placeholder="Min. 8 characters"
              error={errors.password?.message}
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">I am a</label>
              <select
                {...register("role")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-brand-600 font-medium hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
