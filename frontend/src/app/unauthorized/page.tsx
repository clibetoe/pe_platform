"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { ShieldOff, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  const { user } = useAuth();

  const dashboardHref = user
    ? ["admin", "super_admin"].includes(user.role)
      ? "/admin/dashboard"
      : ["teacher", "coach"].includes(user.role)
      ? "/teacher/dashboard"
      : "/student/dashboard"
    : "/login";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-950 via-brand-900 to-slate-900 p-6">
      <div className="max-w-sm w-full text-center">
        <div className="w-20 h-20 rounded-3xl bg-red-500/20 border border-red-400/30 flex items-center justify-center mx-auto mb-6">
          <ShieldOff size={36} className="text-red-400" />
        </div>
        <h1 className="font-display font-extrabold text-3xl text-white mb-3">Access Denied</h1>
        <p className="text-white/60 text-sm mb-8">
          You don&apos;t have permission to view this page. Please contact your administrator if you believe this is a mistake.
        </p>
        <Link
          href={dashboardHref}
          className="inline-flex items-center gap-2 bg-white text-brand-800 font-semibold px-6 py-3 rounded-full transition-colors hover:bg-brand-50"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
