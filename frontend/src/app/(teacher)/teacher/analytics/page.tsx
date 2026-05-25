"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/Progress";
import { analyticsApi } from "@/lib/api";
import type { TeacherDashboard } from "@/types";
import { BarChart2 } from "lucide-react";

export default function TeacherAnalyticsPage() {
  const [data, setData] = useState<TeacherDashboard | null>(null);

  useEffect(() => {
    analyticsApi.teacherDashboard().then((r) => setData(r.data));
  }, []);

  return (
    <DashboardLayout requiredRoles={["teacher", "coach", "admin", "super_admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Class and student performance metrics.</p>
        </div>

        {!data ? (
          <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Students", value: data.total_students },
                { label: "Classes", value: data.total_classes },
                { label: "Avg Score", value: `${data.avg_score}%` },
                { label: "Pass Rate", value: `${data.pass_rate}%` },
              ].map(({ label, value }) => (
                <div key={label} className="stat-card text-center">
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                  <p className="text-sm text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>

            <Card>
              <CardHeader><CardTitle>Class Performance</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                {data.classes.map((klass) => (
                  <div key={klass.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-900">{klass.name}</span>
                      <span className="text-gray-500">{klass.avg_score}% avg</span>
                    </div>
                    <ProgressBar value={klass.avg_score} max={100} />
                    <p className="text-xs text-gray-400 mt-1">
                      {klass.student_count} students · {klass.completed_lessons} lessons completed
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
