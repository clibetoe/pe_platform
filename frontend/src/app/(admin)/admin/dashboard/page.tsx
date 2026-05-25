"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { analyticsApi, schoolApi, usersApi, classApi } from "@/lib/api";
import { Star, Users, BarChart2, BookOpen, ArrowRight } from "lucide-react";

interface PlatformStats {
  schools: number;
  users: number;
  classes: number;
  avgScore: number;
}

const adminSections = [
  { href: "/admin/schools", label: "Schools", icon: Star, desc: "Manage registered schools" },
  { href: "/admin/users", label: "Users", icon: Users, desc: "View all user accounts" },
  { href: "/admin/curriculum", label: "Curriculum", icon: BookOpen, desc: "Browse all content" },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart2, desc: "Platform performance" },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);

  useEffect(() => {
    Promise.all([
      schoolApi.list({ page_size: 1 }),
      usersApi.list({ page_size: 1 }),
      classApi.list(),
      analyticsApi.teacherDashboard(),
    ]).then(([schoolRes, userRes, classRes, analyticsRes]) => {
      const classData = classRes.data.results ?? classRes.data;
      setStats({
        schools: schoolRes.data.count ?? 0,
        users: userRes.data.count ?? 0,
        classes: Array.isArray(classData) ? classData.length : (classRes.data.count ?? 0),
        avgScore: analyticsRes.data.avg_score ?? 0,
      });
    }).catch(() => {});
  }, []);

  return (
    <DashboardLayout requiredRoles={["admin", "super_admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Platform-wide management and analytics.</p>
        </div>

        {stats ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Schools", value: stats.schools, color: "text-blue-600" },
              { label: "Users", value: stats.users, color: "text-green-600" },
              { label: "Classes", value: stats.classes, color: "text-orange-600" },
              { label: "Avg Score", value: `${stats.avgScore}%`, color: "text-purple-600" },
            ].map(({ label, value, color }) => (
              <div key={label} className="stat-card text-center">
                <p className={`text-3xl font-bold ${color}`}>{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminSections.map(({ href, label, icon: Icon, desc }) => (
            <Link key={href} href={href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="pt-5 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center mb-3">
                    <Icon size={20} className="text-brand-700" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{label}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
                  <div className="flex items-center gap-1 mt-3 text-brand-600 text-sm font-medium">
                    Manage <ArrowRight size={14} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
