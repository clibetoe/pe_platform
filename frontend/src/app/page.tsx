"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    const dest =
      ["admin", "super_admin"].includes(user.role)
        ? "/admin/dashboard"
        : ["teacher", "coach"].includes(user.role)
        ? "/teacher/dashboard"
        : "/student/dashboard";
    router.replace(dest);
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin w-8 h-8 rounded-full border-4 border-brand-600 border-t-transparent" />
    </div>
  );
}
