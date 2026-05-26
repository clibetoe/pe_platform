"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { classApi } from "@/lib/api";
import type { Class } from "@/types";
import { useAuth } from "@/lib/auth";
import { Plus, Users, X, ChevronRight, GraduationCap } from "lucide-react";

const classGradients = [
  { bar: "from-brand-500 to-brand-700",      icon: "from-brand-500 to-brand-700",      bg: "from-brand-50/60 to-indigo-50/40",    ring: "ring-brand-100" },
  { bar: "from-emerald-500 to-teal-600",     icon: "from-emerald-500 to-teal-600",     bg: "from-emerald-50/60 to-teal-50/40",   ring: "ring-emerald-100" },
  { bar: "from-violet-500 to-purple-600",    icon: "from-violet-500 to-purple-600",    bg: "from-violet-50/60 to-purple-50/40",  ring: "ring-violet-100" },
  { bar: "from-amber-400 to-orange-500",     icon: "from-amber-400 to-orange-500",     bg: "from-amber-50/60 to-orange-50/40",   ring: "ring-amber-100" },
  { bar: "from-rose-500 to-pink-600",        icon: "from-rose-500 to-pink-600",        bg: "from-rose-50/60 to-pink-50/40",      ring: "ring-rose-100" },
  { bar: "from-cyan-500 to-sky-600",         icon: "from-cyan-500 to-sky-600",         bg: "from-cyan-50/60 to-sky-50/40",       ring: "ring-cyan-100" },
];

export default function ClassesPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<{ name: string }>();

  useEffect(() => {
    classApi.list().then((r) => setClasses(r.data.results ?? r.data));
  }, []);

  const onCreate = async (data: { name: string }) => {
    setFormError(null);
    if (!user?.school) {
      setFormError("Your account is not linked to a school. Ask an admin to assign you to one.");
      return;
    }
    setCreating(true);
    try {
      const r = await classApi.create({ name: data.name, school: Number(user.school) });
      setClasses((prev) => [...prev, r.data]);
      reset();
      setShowForm(false);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string; name?: string[] } } })
          ?.response?.data?.detail ??
        (err as { response?: { data?: { name?: string[] } } })
          ?.response?.data?.name?.[0] ??
        "Failed to create class. Please try again.";
      setFormError(msg);
    } finally {
      setCreating(false);
    }
  };

  return (
    <DashboardLayout requiredRoles={["teacher", "coach", "admin", "super_admin"]}>
      <div className="space-y-8">

        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-800 to-teal-900 p-8 text-white">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute bottom-0 right-20 w-28 h-28 rounded-full bg-teal-400/15" />
          <div className="absolute top-5 right-44 w-5 h-5 rounded-full bg-white/20" />
          <div className="relative z-10 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                  <GraduationCap size={20} className="text-white" />
                </div>
                <p className="text-white/60 text-sm font-medium">Classroom Management</p>
              </div>
              <h1 className="font-display font-extrabold text-3xl text-white mb-2">My Classes</h1>
              <p className="text-white/60 text-sm">Manage your classes and student rosters.</p>
            </div>
            <div className="flex-shrink-0">
              <Button
                onClick={() => { setShowForm(!showForm); setFormError(null); }}
                className="bg-white/15 border border-white/25 hover:bg-white/25 text-white"
              >
                {showForm ? <X size={16} /> : <Plus size={16} />}
                {showForm ? "Cancel" : "New Class"}
              </Button>
            </div>
          </div>
        </div>

        {/* Create form */}
        {showForm && (
          <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-card">
            <div className="pointer-events-none absolute -top-8 -right-8 w-36 h-36 rounded-full bg-brand-400/[0.06]" />
            <div className="pointer-events-none absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-teal-400/[0.07]" />
            <div className="relative z-10 px-6 py-5 border-b border-gray-50">
              <h2 className="font-display font-bold text-gray-900">Create New Class</h2>
            </div>
            <div className="relative z-10 p-6">
              <form onSubmit={handleSubmit(onCreate)} className="flex gap-3 items-end">
                <div className="flex-1">
                  <Input
                    {...register("name", { required: "Class name is required" })}
                    label="Class Name"
                    placeholder="e.g. Grade 10 PE"
                    error={errors.name?.message}
                  />
                </div>
                <Button type="submit" loading={creating}>Create Class</Button>
              </form>
              {formError && (
                <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                  {formError}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Classes grid */}
        {classes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mb-4">
              <Users size={28} className="text-brand-300" />
            </div>
            <h3 className="font-display font-bold text-gray-700 mb-2">No classes yet</h3>
            <p className="text-sm text-gray-400">Click &quot;New Class&quot; to create your first class.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {classes.map((klass, idx) => {
              const g = classGradients[idx % classGradients.length];
              return (
                <div
                  key={klass.id}
                  className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${g.bg} border border-white ring-1 ${g.ring} p-5 group hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200`}
                >
                  <div className="pointer-events-none absolute -top-5 -right-5 w-20 h-20 rounded-full bg-white/50" />
                  <div className="pointer-events-none absolute -bottom-4 -left-4 w-14 h-14 rounded-full bg-white/40" />
                  <div className={`inline-flex w-11 h-11 rounded-xl bg-gradient-to-br ${g.icon} items-center justify-center mb-4 shadow-sm`}>
                    <Users size={19} className="text-white" />
                  </div>
                  <h3 className="font-display font-bold text-gray-900 text-base mb-2">{klass.name}</h3>
                  <Badge variant="info" className="mb-4">
                    <Users size={11} className="mr-1" />
                    {klass.student_count} students
                  </Badge>
                  <Link href={`/teacher/classes/${klass.id}`}>
                    <button className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 bg-white/80 hover:bg-white rounded-xl px-4 py-2.5 border border-white/60 transition-all group-hover:border-gray-200">
                      View Class <ChevronRight size={14} />
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
