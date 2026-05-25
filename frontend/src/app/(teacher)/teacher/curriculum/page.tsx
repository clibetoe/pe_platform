"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { curriculumApi } from "@/lib/api";
import type { Subject } from "@/types";
import { BookOpen } from "lucide-react";

export default function TeacherCurriculumPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    curriculumApi.subjects().then((r) => setSubjects(r.data.results ?? r.data));
  }, []);

  return (
    <DashboardLayout requiredRoles={["teacher", "coach", "admin", "super_admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Curriculum Overview</h1>
          <p className="text-gray-500 mt-1">All published subjects and lessons.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((s, i) => {
            const colors = ["bg-blue-50 text-blue-700", "bg-green-50 text-green-700", "bg-orange-50 text-orange-700", "bg-purple-50 text-purple-700"];
            return (
              <Card key={s.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-5">
                  <div className={`inline-flex p-2 rounded-lg mb-3 ${colors[i % colors.length]}`}>
                    <BookOpen size={18} />
                  </div>
                  <h3 className="font-semibold text-gray-900">{s.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{s.description}</p>
                  <div className="flex gap-2 mt-3">
                    <Badge variant="info">{s.topic_count} topics</Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <p className="text-sm text-gray-400">
          Manage full curriculum content via the{" "}
          <a href="http://localhost:8000/admin/" target="_blank" className="text-brand-600 hover:underline">Django Admin panel</a>.
        </p>
      </div>
    </DashboardLayout>
  );
}
