"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { assessmentApi } from "@/lib/api";
import type { Certificate } from "@/types";
import { Award } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

export default function CertificatesPage() {
  const { user } = useAuth();
  const [certs, setCerts] = useState<Certificate[]>([]);

  useEffect(() => {
    assessmentApi.certificates().then((r) => setCerts(r.data.results ?? r.data));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Certificates</h1>
          <p className="text-gray-500 mt-1">Achievements earned from completed assessments.</p>
        </div>

        {certs.length === 0 ? (
          <div className="text-center py-20">
            <Award size={56} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400">No certificates yet. Pass a quiz to earn your first!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certs.map((c) => (
              <div
                key={c.id}
                className="bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-200 rounded-2xl p-6 text-center shadow-sm"
              >
                <div className="w-14 h-14 rounded-full bg-amber-400 flex items-center justify-center mx-auto mb-4">
                  <Award size={28} className="text-white" />
                </div>
                <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide mb-1">Certificate of Completion</p>
                <h3 className="font-bold text-gray-900 text-lg leading-tight">{c.assessment_title}</h3>
                <p className="text-sm text-gray-600 mt-2">Awarded to</p>
                <p className="font-semibold text-gray-900">{user?.full_name}</p>
                <p className="text-xs text-gray-400 mt-3">{c.school_name}</p>
                <div className="mt-4 pt-4 border-t border-amber-200 flex justify-between text-xs text-gray-500">
                  <span>#{c.certificate_number}</span>
                  <span>{formatDate(c.issued_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
