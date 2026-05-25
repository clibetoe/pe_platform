"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { assessmentApi } from "@/lib/api";
import type { Assessment } from "@/types";
import { ClipboardList, Target } from "lucide-react";

export default function TeacherAssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    assessmentApi.list().then((r) => setAssessments(r.data.results ?? r.data));
  }, []);

  return (
    <DashboardLayout requiredRoles={["teacher", "coach", "admin", "super_admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assessments</h1>
          <p className="text-gray-500 mt-1">All quizzes available on the platform.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {assessments.map((a) => (
            <Card key={a.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-gray-400">{a.lesson_title}</p>
                    <h3 className="font-semibold text-gray-900">{a.title}</h3>
                  </div>
                  <Badge variant={a.is_published ? "success" : "warning"}>
                    {a.is_published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><ClipboardList size={12} />{a.question_count} questions</span>
                  <span className="flex items-center gap-1"><Target size={12} />Pass: {a.pass_score}%</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-sm text-gray-400">
          Create and edit assessments via the{" "}
          <a href="http://localhost:8000/admin/" target="_blank" className="text-brand-600 hover:underline">Django Admin panel</a>.
        </p>
      </div>
    </DashboardLayout>
  );
}
