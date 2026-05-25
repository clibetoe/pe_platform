"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import { analyticsApi, assessmentApi, curriculumApi } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { MyStats, Attempt, Certificate } from "@/types";
import { BookOpen, Award, ClipboardCheck, Zap } from "lucide-react";
import { formatDate, formatScore } from "@/lib/utils";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<MyStats | null>(null);
  const [recentAttempts, setRecentAttempts] = useState<Attempt[]>([]);
  const [certs, setCerts] = useState<Certificate[]>([]);

  useEffect(() => {
    analyticsApi.myStats().then((r) => setStats(r.data));
    assessmentApi.attempts().then((r) => setRecentAttempts(r.data.results?.slice(0, 5) ?? []));
    assessmentApi.certificates().then((r) => setCerts(r.data.results ?? []));
  }, []);

  const statCards = stats
    ? [
        { label: "Lessons Completed", value: `${stats.lessons_completed}/${stats.total_lessons}`, icon: BookOpen, color: "text-blue-600 bg-blue-50" },
        { label: "Quizzes Passed", value: stats.quizzes_passed, icon: ClipboardCheck, color: "text-green-600 bg-green-50" },
        { label: "Avg. Score", value: formatScore(stats.avg_score), icon: Award, color: "text-amber-600 bg-amber-50" },
        { label: "XP Earned", value: stats.xp_total, icon: Zap, color: "text-purple-600 bg-purple-50" },
      ]
    : [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.first_name}!
          </h1>
          <p className="text-gray-500 mt-1">Track your progress and keep learning.</p>
        </div>

        {stats && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Overall Progress</p>
              <p className="text-sm text-gray-500">
                {stats.lessons_completed} / {stats.total_lessons} lessons
              </p>
            </div>
            <ProgressBar
              value={stats.lessons_completed}
              max={stats.total_lessons || 1}
              color="blue"
            />
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="stat-card">
              <div className={`inline-flex p-2 rounded-lg ${color} mb-3`}>
                <Icon size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Quiz Results</CardTitle>
            </CardHeader>
            <CardContent>
              {recentAttempts.length === 0 ? (
                <p className="text-sm text-gray-400">No quizzes taken yet. Start learning!</p>
              ) : (
                <div className="space-y-3">
                  {recentAttempts.map((a) => (
                    <div key={a.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{a.assessment_title}</p>
                        <p className="text-xs text-gray-400">{formatDate(a.submitted_at!)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{formatScore(a.score)}</span>
                        <Badge variant={a.passed ? "success" : "danger"}>
                          {a.passed ? "Passed" : "Failed"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Certificates</CardTitle>
            </CardHeader>
            <CardContent>
              {certs.length === 0 ? (
                <p className="text-sm text-gray-400">Complete a quiz to earn your first certificate!</p>
              ) : (
                <div className="space-y-3">
                  {certs.map((c) => (
                    <div key={c.id} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <Award size={16} className="text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{c.assessment_title}</p>
                        <p className="text-xs text-gray-400">#{c.certificate_number} · {formatDate(c.issued_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
