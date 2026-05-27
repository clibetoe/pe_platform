"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
    if (!loading && user && requiredRoles && !isRole(...requiredRoles)) {
      router.replace("/unauthorized");
    }
  }, [user, loading, router, requiredRoles, isRole]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-brand-950">
      <ProductTour />
      <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden min-h-screen rounded-none lg:rounded-tl-2xl lg:rounded-bl-2xl overflow-hidden">
        <TopBar onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-auto dashboard-bg relative">
          {/* Ambient background glow blobs */}
          <div className="pointer-events-none absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-brand-400/[0.06] blur-3xl hidden sm:block" />
          <div className="pointer-events-none absolute top-1/2 -left-24 w-96 h-96 rounded-full bg-accent-400/[0.07] blur-3xl hidden sm:block" />
          <div className="pointer-events-none absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-violet-400/[0.05] blur-3xl hidden sm:block" />
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
