"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { classApi, analyticsApi } from "@/lib/api";
import type { Class, User } from "@/types";
import { ArrowLeft, Users, Search, GraduationCap, BookOpen, Award, TrendingUp } from "lucide-react";
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
          return { student: { id: s.id, name: s.full_name, email: s.email }, lessons_completed: 0, quizzes_passed: 0, avg_score: 0, certificates: 0 };
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
    return <DashboardLayout><div className="space-y-4"><div className="skeleton h-48" /><div className="skeleton h-64" /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout requiredRoles={["teacher", "coach", "admin", "super_admin"]}>
      <div className="space-y-8">

        <Link href="/teacher/classes" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-700 font-medium transition-colors">
          <ArrowLeft size={15} /> Back to Classes
        </Link>

        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-800 to-emerald-900 p-8 text-white">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute bottom-0 right-16 w-28 h-28 rounded-full bg-emerald-400/15" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                  <GraduationCap size={20} className="text-white" />
                </div>
                <p className="text-white/60 text-sm font-medium">Class Detail</p>
              </div>
              <h1 className="font-display font-extrabold text-3xl text-white mb-1">{klass.name}</h1>
              <p className="text-white/60 text-sm">{klass.student_count} students enrolled</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <div className="flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
                <span className="font-display font-extrabold text-2xl text-white leading-none">{klass.student_count}</span>
                <span className="text-white/55 text-xs mt-1 font-medium">Students</span>
              </div>
            </div>
          </div>
        </div>

        {/* Add student card */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-card">
          <div className="pointer-events-none absolute -top-8 -right-8 w-36 h-36 rounded-full bg-brand-400/[0.06]" />
          <div className="pointer-events-none absolute -bottom-5 -left-5 w-24 h-24 rounded-full bg-emerald-400/[0.07]" />
          <div className="relative z-10 px-6 py-4 border-b border-gray-50">
            <h2 className="font-display font-bold text-gray-900">Add Student</h2>
          </div>
          <div className="relative z-10 p-6">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
            {searchStudents.length > 0 && (
              <div className="mt-3 bg-white border border-gray-100 rounded-xl shadow-card overflow-hidden divide-y divide-gray-50">
                {searchStudents.map((s) => (
                  <div key={s.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50/60 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {s.first_name[0]}{s.last_name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{s.full_name}</p>
                        <p className="text-xs text-gray-400">{s.email}</p>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleAdd(s.id)} loading={adding === s.id}>Add</Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Student progress card */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-card">
          <div className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full bg-emerald-400/[0.05]" />
          <div className="pointer-events-none absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-brand-400/[0.06]" />
          <div className="pointer-events-none absolute top-10 right-1/3 w-12 h-12 rounded-full bg-teal-400/[0.04]" />
          <div className="relative z-10 px-6 py-4 border-b border-gray-50">
            <h2 className="font-display font-bold text-gray-900">Student Progress</h2>
          </div>
          <div className="relative z-10 p-0">
            {loadingProgress ? (
              <div className="p-6 space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-12" />)}</div>
            ) : studentRows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center mb-3">
                  <Users size={20} className="text-brand-300" />
                </div>
                <p className="text-sm text-gray-400">No students enrolled yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-50 bg-gray-50/50">
                      <th className="text-left py-3 px-5 font-semibold text-gray-500 text-xs uppercase tracking-wide">Student</th>
                      <th className="text-center py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                        <span className="flex items-center justify-center gap-1"><BookOpen size={11} />Lessons</span>
                      </th>
                      <th className="text-center py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Quizzes</th>
                      <th className="text-center py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                        <span className="flex items-center justify-center gap-1"><TrendingUp size={11} />Score</span>
                      </th>
                      <th className="text-center py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                        <span className="flex items-center justify-center gap-1"><Award size={11} />Certs</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {studentRows.map((row) => (
                      <tr key={row.student.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                              {row.student.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{row.student.name}</p>
                              <p className="text-xs text-gray-400">{row.student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-center py-3.5 px-3 font-semibold text-gray-700">{row.lessons_completed}</td>
                        <td className="text-center py-3.5 px-3">
                          <Badge variant={row.quizzes_passed > 0 ? "success" : "default"}>{row.quizzes_passed} passed</Badge>
                        </td>
                        <td className="text-center py-3.5 px-3">
                          <span className={`font-bold ${row.avg_score >= 70 ? "text-emerald-600" : "text-gray-600"}`}>
                            {formatScore(row.avg_score)}
                          </span>
                        </td>
                        <td className="text-center py-3.5 px-3 font-semibold text-gray-700">{row.certificates}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
