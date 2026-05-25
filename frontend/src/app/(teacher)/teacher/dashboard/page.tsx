"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/Progress";
import { analyticsApi } from "@/lib/api";
import type { TeacherDashboard } from "@/types";
import { useAuth } from "@/lib/auth";
import { Users, BookOpen, Award, TrendingUp } from "lucide-react";

export default function TeacherDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<TeacherDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.teacherDashboard().then((r) => {
      setData(r.data);
      setLoading(false);
    });
  }, []);

  const stats = data
    ? [
        { label: "Total Students", value: data.total_students, icon: Users, color: "bg-blue-50 text-blue-600" },
        { label: "Classes", value: data.total_classes, icon: BookOpen, color: "bg-green-50 text-green-600" },
        { label: "Avg. Quiz Score", value: `${data.avg_score}%`, icon: Award, color: "bg-amber-50 text-amber-600" },
        { label: "Pass Rate", value: `${data.pass_rate}%`, icon: TrendingUp, color: "bg-purple-50 text-purple-600" },
      ]
    : [];

  return (
    <DashboardLayout requiredRoles={["teacher", "coach", "admin", "super_admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Teacher Dashboard
          </h1>
          <p className="text-gray-500 mt-1">Monitor student progress and class performance.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="stat-card">
                  <div className={`inline-flex p-2 rounded-lg ${color} mb-3`}>
                    <Icon size={20} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                  <p className="text-sm text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>My Classes</CardTitle>
                  <Link href="/teacher/classes" className="text-sm text-brand-600 hover:underline font-medium">
                    Manage Classes →
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {data?.classes.length === 0 ? (
                  <p className="text-sm text-gray-400">No classes yet.</p>
                ) : (
                  <div className="space-y-4">
                    {data?.classes.map((klass) => (
                      <div key={klass.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900">{klass.name}</p>
                            <Badge variant="info">{klass.student_count} students</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Avg. Score: <strong className="text-gray-900">{klass.avg_score}%</strong></span>
                            <span>Lessons done: <strong className="text-gray-900">{klass.completed_lessons}</strong></span>
                          </div>
                          <div className="mt-2">
                            <ProgressBar value={klass.avg_score} max={100} />
                          </div>
                        </div>
                        <Link href={`/teacher/classes/${klass.id}`} className="text-sm text-brand-600 hover:underline">
                          View →
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
