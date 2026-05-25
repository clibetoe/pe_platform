"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { classApi, analyticsApi } from "@/lib/api";
import type { Class, User } from "@/types";
import { ArrowLeft, Users, Search } from "lucide-react";
import { formatScore } from "@/lib/utils";

interface StudentRow {
  student: { id: string; name: string; email: string };
  lessons_completed: number;
  quizzes_passed: number;
  avg_score: number;
  certificates: number;
}

export default function ClassDetailPage() {
  const { classId } = useParams();
  const [klass, setKlass] = useState<Class | null>(null);
  const [studentRows, setStudentRows] = useState<StudentRow[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [searchStudents, setSearchStudents] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState<string | null>(null);

  useEffect(() => {
    classApi.detail(Number(classId)).then((r) => {
      setKlass(r.data);
      loadStudentProgress(r.data.students ?? []);
    });
  }, [classId]);

  const loadStudentProgress = async (students: User[]) => {
    setLoadingProgress(true);
    const rows: StudentRow[] = await Promise.all(
      students.map(async (s) => {
        try {
          const r = await analyticsApi.studentProgress(s.id);
          return r.data;
        } catch {
          return {
            student: { id: s.id, name: s.full_name, email: s.email },
            lessons_completed: 0, quizzes_passed: 0, avg_score: 0, certificates: 0,
          };
        }
      })
    );
    setStudentRows(rows);
    setLoadingProgress(false);
  };

  const handleSearch = async (q: string) => {
    setQuery(q);
    if (q.length < 2) { setSearchStudents([]); return; }
    const r = await classApi.students({ search: q });
    setSearchStudents(r.data.results ?? []);
  };

  const handleAdd = async (studentId: string) => {
    setAdding(studentId);
    await classApi.addStudent(Number(classId), studentId);
    const r = await classApi.detail(Number(classId));
    setKlass(r.data);
    loadStudentProgress(r.data.students ?? []);
    setSearchStudents([]);
    setQuery("");
    setAdding(null);
  };

  if (!klass) {
    return <DashboardLayout><div className="h-64 bg-gray-100 rounded-xl animate-pulse" /></DashboardLayout>;
  }

  return (
    <DashboardLayout requiredRoles={["teacher", "coach", "admin", "super_admin"]}>
      <div className="space-y-6">
        <Link href="/teacher/classes" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft size={16} /> Back to Classes
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
            <Users size={20} className="text-brand-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{klass.name}</h1>
            <p className="text-gray-500 text-sm">{klass.student_count} students enrolled</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add Student</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            {searchStudents.length > 0 && (
              <div className="mt-2 border border-gray-200 rounded-lg divide-y">
                {searchStudents.map((s) => (
                  <div key={s.id} className="flex items-center justify-between px-4 py-2.5">
                    <div>
                      <p className="text-sm font-medium">{s.full_name}</p>
                      <p className="text-xs text-gray-400">{s.email}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAdd(s.id)}
                      loading={adding === s.id}
                    >
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingProgress ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}
              </div>
            ) : studentRows.length === 0 ? (
              <p className="text-sm text-gray-400">No students enrolled yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 pr-4 font-semibold text-gray-600">Student</th>
                      <th className="text-center py-3 px-3 font-semibold text-gray-600">Lessons</th>
                      <th className="text-center py-3 px-3 font-semibold text-gray-600">Quizzes</th>
                      <th className="text-center py-3 px-3 font-semibold text-gray-600">Avg Score</th>
                      <th className="text-center py-3 px-3 font-semibold text-gray-600">Certs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {studentRows.map((row) => (
                      <tr key={row.student.id} className="hover:bg-gray-50">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-700">
                              {row.student.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{row.student.name}</p>
                              <p className="text-xs text-gray-400">{row.student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-center py-3 px-3">{row.lessons_completed}</td>
                        <td className="text-center py-3 px-3">
                          <Badge variant={row.quizzes_passed > 0 ? "success" : "default"}>
                            {row.quizzes_passed} passed
                          </Badge>
                        </td>
                        <td className="text-center py-3 px-3">
                          <span className={row.avg_score >= 70 ? "text-green-700 font-semibold" : "text-gray-700"}>
                            {formatScore(row.avg_score)}
                          </span>
                        </td>
                        <td className="text-center py-3 px-3">{row.certificates}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
