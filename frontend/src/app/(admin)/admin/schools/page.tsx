"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { schoolApi } from "@/lib/api";
import type { School } from "@/types";
import { Plus, Trash2, X, MapPin, School as SchoolIcon } from "lucide-react";

type SchoolForm = { name: string; location: string };

const schoolGradients = [
  { icon: "from-sky-500 to-indigo-600",    bg: "from-sky-50/60 to-indigo-50/40",    ring: "ring-sky-100" },
  { icon: "from-emerald-500 to-teal-600",  bg: "from-emerald-50/60 to-teal-50/40",  ring: "ring-emerald-100" },
  { icon: "from-amber-400 to-orange-500",  bg: "from-amber-50/60 to-orange-50/40",  ring: "ring-amber-100" },
  { icon: "from-violet-500 to-purple-600", bg: "from-violet-50/60 to-purple-50/40", ring: "ring-violet-100" },
  { icon: "from-rose-500 to-pink-600",     bg: "from-rose-50/60 to-pink-50/40",     ring: "ring-rose-100" },
  { icon: "from-cyan-500 to-sky-600",      bg: "from-cyan-50/60 to-sky-50/40",      ring: "ring-cyan-100" },
];

export default function AdminSchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [total, setTotal] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SchoolForm>();

  useEffect(() => {
    schoolApi.list().then((r) => {
      setSchools(r.data.results ?? r.data);
      setTotal(r.data.count ?? (r.data.results ?? r.data).length);
    });
  }, []);

  const onCreate = async (data: SchoolForm) => {
    setCreating(true);
    try {
      const r = await schoolApi.create(data);
      setSchools((prev) => [...prev, r.data]);
      setTotal((t) => t + 1);
      reset();
      setShowForm(false);
    } finally { setCreating(false); }
  };

  const onDelete = async (id: number) => {
    if (!confirm("Delete this school? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await schoolApi.delete(id);
      setSchools((prev) => prev.filter((s) => s.id !== id));
      setTotal((t) => t - 1);
    } finally { setDeleting(null); }
  };

  return (
    <DashboardLayout requiredRoles={["admin", "super_admin"]}>
      <div className="space-y-8">

        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-900 via-brand-800 to-indigo-900 p-8 text-white">
          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/5" />
          <div className="absolute bottom-0 right-20 w-28 h-28 rounded-full bg-sky-400/15" />
          <div className="relative z-10 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                  <SchoolIcon size={20} className="text-white" />
                </div>
                <p className="text-white/60 text-sm font-medium">Institution Management</p>
              </div>
              <h1 className="font-display font-extrabold text-3xl text-white mb-2">Schools</h1>
              <p className="text-white/60 text-sm">{total} school{total !== 1 ? "s" : ""} registered on the platform.</p>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="flex-shrink-0 bg-white/15 border border-white/25 hover:bg-white/25 text-white"
            >
              {showForm ? <X size={16} /> : <Plus size={16} />}
              {showForm ? "Cancel" : "Add School"}
            </Button>
          </div>
        </div>

        {/* Create form */}
        {showForm && (
          <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-card">
            <div className="pointer-events-none absolute -top-8 -right-8 w-36 h-36 rounded-full bg-sky-400/[0.06]" />
            <div className="pointer-events-none absolute -bottom-5 -left-5 w-24 h-24 rounded-full bg-indigo-400/[0.07]" />
            <div className="relative z-10 px-6 py-4 border-b border-gray-50">
              <h2 className="font-display font-bold text-gray-900">Add New School</h2>
            </div>
            <div className="relative z-10 p-6">
              <form onSubmit={handleSubmit(onCreate)} className="grid sm:grid-cols-2 gap-4">
                <Input {...register("name", { required: "School name is required" })} label="School Name" placeholder="e.g. Maseru High School" error={errors.name?.message} />
                <Input {...register("location")} label="Location" placeholder="e.g. Maseru, Lesotho" />
                <div className="sm:col-span-2">
                  <Button type="submit" loading={creating}>Create School</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Schools grid */}
        {schools.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center mb-4">
              <SchoolIcon size={28} className="text-sky-300" />
            </div>
            <p className="text-gray-400 font-medium">No schools registered yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {schools.map((s, idx) => {
              const g = schoolGradients[idx % schoolGradients.length];
              return (
                <div key={s.id} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${g.bg} border border-white ring-1 ${g.ring} p-5 group hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200`}>
                  <div className="pointer-events-none absolute -top-5 -right-5 w-20 h-20 rounded-full bg-white/50" />
                  <div className="pointer-events-none absolute -bottom-4 -left-4 w-14 h-14 rounded-full bg-white/40" />
                  <div className="relative z-10 flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${g.icon} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                        <SchoolIcon size={18} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-display font-bold text-gray-900 truncate">{s.name}</h3>
                        {s.location && (
                          <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1 truncate">
                            <MapPin size={11} className="flex-shrink-0" /> {s.location}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => onDelete(s.id)}
                      disabled={deleting === s.id}
                      className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 p-1.5 rounded-lg hover:bg-red-50 disabled:opacity-40"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
