"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { ProductTour } from "@/components/tour/ProductTour";

interface DashboardLayoutProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export function DashboardLayout({ children, requiredRoles }: DashboardLayoutProps) {
  const { user, loading, isRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
    if (!loading && user && requiredRoles && !isRole(...requiredRoles)) {
      router.replace("/unauthorized");
    }
  }, [user, loading, router, requiredRoles, isRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-brand-950">
      <ProductTour />
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-h-screen rounded-tl-2xl rounded-bl-2xl overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto dashboard-bg relative">
          {/* Ambient background glow blobs */}
          <div className="pointer-events-none absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-brand-400/[0.06] blur-3xl" />
          <div className="pointer-events-none absolute top-1/2 -left-24 w-96 h-96 rounded-full bg-accent-400/[0.07] blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-violet-400/[0.05] blur-3xl" />
          <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
