"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CheckCircle2, Trophy, Award, Zap } from "lucide-react";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

type ApiErrorResponse = {
  detail?: string;
  non_field_errors?: string[];
  [key: string]: string | string[] | undefined;
};

function extractErrorMessage(error: unknown) {
  const data = (error as { response?: { data?: ApiErrorResponse } })?.response?.data;
  if (!data) return "Unable to reach the server. Please try again.";
  if (typeof data.detail === "string" && data.detail) return data.detail;

  const firstField = Object.keys(data).find((key) => key !== "detail");
  if (!firstField) return "Login failed. Please try again.";

  const value = data[firstField];
  if (Array.isArray(value) && value[0]) return value[0];
  if (typeof value === "string" && value) return value;

  return "Login failed. Please try again.";
}

function LoginForm() {
  const { login, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!user) return;
    const dest =
      ["admin", "super_admin"].includes(user.role)
        ? "/admin/dashboard"
        : ["teacher", "coach"].includes(user.role)
        ? "/teacher/dashboard"
        : "/student/dashboard";
    router.replace(dest);
  }, [user, router]);

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      await login(data.email, data.password);
    } catch (error: unknown) {
      setError(extractErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — brand panel */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 bg-gradient-to-br from-brand-900 via-brand-800 to-accent-700 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/5 animate-float" />
          <div
            className="absolute bottom-16 -left-20 w-64 h-64 rounded-full bg-accent-500/15 animate-float"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-1/3 right-1/4 w-8 h-8 rounded-full bg-white/25 animate-float"
            style={{ animationDelay: "1s" }}
          />
          <div className="absolute top-16 right-16 flex gap-3 opacity-10">
            <div className="w-12 h-12 rounded-full border-2 border-blue-300" />
            <div className="w-12 h-12 rounded-full border-2 border-yellow-300 -mt-2" />
            <div className="w-12 h-12 rounded-full border-2 border-green-300" />
          </div>
        </div>

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center font-display font-bold text-white text-sm">
              PE
            </div>
            <span className="font-display font-bold text-white text-lg">PE Platform</span>
          </Link>
        </div>

        <div className="relative z-10">
          <h2 className="font-display font-extrabold text-3xl xl:text-4xl text-white leading-tight mb-8">
            Welcome back to your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-white">
              learning journey
            </span>
          </h2>
          <div className="space-y-4">
            {[
              { icon: Trophy, text: "Track achievements & streaks" },
              { icon: Award, text: "Access your digital certificates" },
              { icon: Zap, text: "Continue where you left off" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/12 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-accent-300" />
                </div>
                <span className="text-white/75 text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 glass-card rounded-2xl p-5">
          <p className="font-display font-extrabold text-3xl text-white">5,000+</p>
          <p className="text-white/60 text-sm mt-1">students learning with PE Platform</p>
          <div className="flex items-center gap-1 mt-4">
            {["T", "A", "M", "L", "K"].map((letter, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 border-2 border-brand-800 flex items-center justify-center text-xs font-bold text-white"
                style={{ marginLeft: i > 0 ? "-8px" : 0 }}
              >
                {letter}
              </div>
            ))}
            <span className="text-white/50 text-xs ml-3">+4,995 more</span>
          </div>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="w-full lg:w-7/12 xl:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center font-display font-bold text-white text-sm">PE</div>
            <span className="font-display font-bold text-gray-900">PE Platform</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl text-gray-900 mb-2">
            Sign in
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            {"Don't have an account? "}
            <Link href="/register" className="text-brand-600 font-semibold hover:underline">
              Create one free
            </Link>
          </p>

          {justRegistered && (
            <div className="flex items-center gap-3 rounded-xl bg-green-50 border border-green-100 px-4 py-3 mb-6">
              <CheckCircle2 size={17} className="text-green-500 flex-shrink-0" />
              <span className="text-sm text-green-700 font-medium">Account created! You can now sign in.</span>
            </div>
          )}

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
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full !rounded-xl" size="lg" loading={isSubmitting}>
              Sign In
            </Button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-10">
            PE Platform · Olympic Values Education Programme
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
