"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authApi } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, BookOpen, Award, Users, BarChart2 } from "lucide-react";
import Logo from "@/components/brand/Logo";

const schema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["student", "teacher"]),
});
type FormData = z.infer<typeof schema>;

type ApiErrors = Record<string, string[]>;

function extractError(e: unknown): string {
  const data = (e as { response?: { data?: ApiErrors } })?.response?.data;
  if (!data) return "Registration failed. Please try again.";
  const firstKey = Object.keys(data)[0];
  if (!firstKey) return "Registration failed. Please try again.";
  const msgs = data[firstKey];
  return Array.isArray(msgs)
    ? `${firstKey !== "non_field_errors" ? `${firstKey}: ` : ""}${msgs[0]}`
    : "Registration failed.";
}

const highlights = [
  { icon: BookOpen, text: "200+ lessons across 12+ PE subjects" },
  { icon: Award, text: "Earn verified digital certificates" },
  { icon: BarChart2, text: "Track your progress with rich analytics" },
  { icon: Users, text: "Connect with teachers and classmates" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "student" },
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      await authApi.register(data);
      router.push("/login?registered=1");
    } catch (e: unknown) {
      setError(extractError(e));
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — brand panel */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 bg-gradient-to-br from-brand-900 via-brand-700 to-accent-600 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5 animate-float" />
          <div
            className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-accent-500/15 animate-float"
            style={{ animationDelay: "2.5s" }}
          />
          <div
            className="absolute top-1/2 right-1/3 w-6 h-6 rounded-full bg-white/20 animate-float"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center font-display font-bold text-white text-sm">
              PE
            </div>
            <span className="font-display font-bold text-white text-lg">PE Platform</span>
          </Link>
        </div>

        <div className="relative z-10">
          <h2 className="font-display font-extrabold text-3xl xl:text-4xl text-white leading-tight mb-8">
            Start your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-white">
              learning journey
            </span>{" "}
            today
          </h2>
          <div className="space-y-4">
            {highlights.map(({ icon: Icon, text }) => (
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
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm font-bold text-white">
              TM
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Thabo Mokoena</p>
              <p className="text-xs text-white/50">Student · Maseru High School</p>
            </div>
          </div>
          <p className="text-white/70 text-sm leading-relaxed italic">
            &ldquo;PE Platform helped me earn my athletics certificate in just 3 weeks. The quizzes make it so easy to study.&rdquo;
          </p>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="w-full lg:w-7/12 xl:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-6 lg:hidden"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <div className="mb-10 lg:hidden">
            <Logo compact />
          </div>

          <h1 className="font-display font-extrabold text-3xl text-gray-900 mb-2">
            Create your account
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "student", label: "Student", emoji: "🎓" },
                  { value: "teacher", label: "Teacher", emoji: "📚" },
                ].map(({ value, label, emoji }) => (
                  <label
                    key={value}
                    className="relative flex items-center gap-3 p-3.5 rounded-xl border-2 border-gray-200 cursor-pointer hover:border-brand-300 transition-colors has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50"
                  >
                    <input
                      {...register("role")}
                      type="radio"
                      value={value}
                      className="sr-only"
                    />
                    <span className="text-xl">{emoji}</span>
                    <span className="text-sm font-semibold text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full !rounded-xl" size="lg" loading={isSubmitting}>
              Create Account
            </Button>

            <p className="text-center text-xs text-gray-400">
              By registering, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
