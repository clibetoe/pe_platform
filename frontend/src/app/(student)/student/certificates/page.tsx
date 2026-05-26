"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { assessmentApi } from "@/lib/api";
import type { Certificate } from "@/types";
import { Award, Star, Download, Shield } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

export default function CertificatesPage() {
  const { user } = useAuth();
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    assessmentApi.certificates().then((r) => {
      setCerts(r.data.results ?? r.data);
      setLoading(false);
    });
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Page header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 via-orange-500 to-brand-800 p-8 text-white">
          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/5" />
          <div className="absolute bottom-0 right-20 w-28 h-28 rounded-full bg-amber-300/15" />
          <div className="absolute top-8 right-32 w-5 h-5 rounded-full bg-white/25" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <Award size={20} className="text-white" />
              </div>
              <p className="text-white/60 text-sm font-medium">Your Achievements</p>
            </div>
            <h1 className="font-display font-extrabold text-3xl text-white mb-2">My Certificates</h1>
            <p className="text-white/60 text-sm max-w-lg">
              Each certificate represents a milestone in your learning journey. Keep going!
            </p>
            {!loading && (
              <span className="inline-block mt-4 text-xs font-semibold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
                {certs.length} Certificate{certs.length !== 1 ? "s" : ""} Earned
              </span>
            )}
          </div>
        </div>

        {/* Certificates */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-72" />)}
          </div>
        ) : certs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-3xl bg-amber-50 flex items-center justify-center mb-5 border-2 border-amber-100">
              <Award size={36} className="text-amber-300" />
            </div>
            <h3 className="font-display font-bold text-gray-700 text-lg mb-2">No certificates yet</h3>
            <p className="text-sm text-gray-400 max-w-xs">
              Pass a quiz to earn your first certificate. Every achievement is stored here forever.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certs.map((c) => (
              <div
                key={c.id}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-2 border-amber-200 shadow-card group hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Top decorative bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400" />

                {/* Corner decorations */}
                <div className="absolute top-6 left-4 w-12 h-12 rounded-full bg-amber-100/60 border border-amber-200/60" />
                <div className="absolute bottom-6 right-4 w-8 h-8 rounded-full bg-orange-100/60 border border-orange-200/60" />

                <div className="relative p-7 text-center">
                  {/* Badge */}
                  <div className="relative inline-flex mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
                      <Award size={30} className="text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                      <Star size={10} className="text-white fill-white" />
                    </div>
                  </div>

                  {/* Label */}
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2">
                    Certificate of Completion
                  </p>

                  {/* Course name */}
                  <h3 className="font-display font-extrabold text-gray-900 text-lg leading-tight mb-4">
                    {c.assessment_title}
                  </h3>

                  {/* Divider */}
                  <div className="relative flex items-center gap-3 mb-4">
                    <div className="flex-1 h-px bg-amber-200" />
                    <Shield size={12} className="text-amber-400 flex-shrink-0" />
                    <div className="flex-1 h-px bg-amber-200" />
                  </div>

                  {/* Awarded to */}
                  <p className="text-xs text-gray-500 mb-0.5">Awarded to</p>
                  <p className="font-bold text-gray-900 text-sm">{user?.full_name}</p>
                  {c.school_name && (
                    <p className="text-xs text-gray-400 mt-0.5">{c.school_name}</p>
                  )}

                  {/* Footer */}
                  <div className="mt-5 pt-4 border-t border-amber-200/80 flex justify-between items-center text-xs">
                    <span className="font-mono text-amber-700 font-semibold">#{c.certificate_number}</span>
                    <span className="text-gray-500">{formatDate(c.issued_at)}</span>
                  </div>
                </div>

                {/* Download hint on hover */}
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-amber-100/80 to-transparent flex items-end justify-center pb-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                    <Download size={12} /> View Certificate
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
