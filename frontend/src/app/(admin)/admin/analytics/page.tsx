"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/Progress";
import { analyticsApi, schoolApi, usersApi } from "@/lib/api";
import type { TeacherDashboard } from "@/types";
import { Users, BookOpen, TrendingUp, Award, BarChart2, Star } from "lucide-react";

interface PlatformMeta {
  schools: number;
  users: number;
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<TeacherDashboard | null>(null);
  const [meta, setMeta] = useState<PlatformMeta | null>(null);

  useEffect(() => {
    Promise.all([
      analyticsApi.teacherDashboard(),
      schoolApi.list({ page_size: 1 }),
      usersApi.list({ page_size: 1 }),
    ]).then(([analyticsRes, schoolRes, userRes]) => {
      setAnalytics(analyticsRes.data);
      setMeta({
        schools: schoolRes.data.count ?? 0,
        users: userRes.data.count ?? 0,
      });
    });
  }, []);

  const loading = !analytics || !meta;

  return (
    <DashboardLayout requiredRoles={["admin", "super_admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Platform-wide performance overview.</p>
        </div>

        {loading ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
              <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Schools", value: meta.schools, icon: Star, color: "bg-blue-50 text-blue-600" },
                { label: "Total Users", value: meta.users, icon: Users, color: "bg-green-50 text-green-600" },
                { label: "Avg Score", value: `${analytics.avg_score}%`, icon: TrendingUp, color: "bg-orange-50 text-orange-600" },
                { label: "Pass Rate", value: `${analytics.pass_rate}%`, icon: Award, color: "bg-purple-50 text-purple-600" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="stat-card">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${color}`}>
                    <Icon size={18} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                  <p className="text-sm text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Class Performance</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  {analytics.classes.length === 0 ? (
                    <p className="text-sm text-gray-400">No classes found.</p>
                  ) : (
                    analytics.classes.map((klass) => (
                      <div key={klass.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-900">{klass.name}</span>
                          <span className="text-gray-500">{klass.avg_score}%</span>
                        </div>
                        <ProgressBar value={klass.avg_score} max={100} />
                        <p className="text-xs text-gray-400 mt-1">
                          {klass.student_count} students · {klass.completed_lessons} lessons completed
                        </p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Platform Summary</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { label: "Total Students", value: analytics.total_students, icon: Users },
                      { label: "Total Classes", value: analytics.total_classes, icon: BarChart2 },
                      { label: "Lessons Completed", value: analytics.completed_lessons, icon: BookOpen },
                    ].map(({ label, value, icon: Icon }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                      >
                        <div className="flex items-center gap-2 text-gray-600">
                          <Icon size={16} />
                          <span className="text-sm">{label}</span>
                        </div>
                        <span className="font-semibold text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
