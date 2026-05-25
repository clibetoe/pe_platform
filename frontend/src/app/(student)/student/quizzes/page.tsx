"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { assessmentApi } from "@/lib/api";
import type { Assessment } from "@/types";
import { ClipboardList, Clock, Target } from "lucide-react";

export default function QuizzesPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    assessmentApi.list().then((r) => {
      setAssessments(r.data.results ?? r.data);
      setLoading(false);
    });
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quizzes</h1>
          <p className="text-gray-500 mt-1">Test your knowledge and earn certificates.</p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : assessments.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <ClipboardList size={48} className="mx-auto mb-3 opacity-40" />
            <p>No quizzes available yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {assessments.map((a) => (
              <Card key={a.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-5">
                  <p className="text-xs text-gray-400 mb-1">{a.lesson_title}</p>
                  <h3 className="font-semibold text-gray-900">{a.title}</h3>
                  {a.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{a.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <ClipboardList size={12} />
                      {a.question_count} questions
                    </span>
                    {a.time_limit_minutes && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        {a.time_limit_minutes} min
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Target size={12} />
                      Pass: {a.pass_score}%
                    </span>
                  </div>
                  <div className="mt-4">
                    <Link href={`/student/quiz/${a.id}`}>
                      <Button className="w-full" size="sm">Start Quiz</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
