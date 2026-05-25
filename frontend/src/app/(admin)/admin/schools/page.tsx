"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { schoolApi } from "@/lib/api";
import type { School } from "@/types";
import { Plus, Trash2, X, MapPin, School as SchoolIcon } from "lucide-react";

type SchoolForm = { name: string; location: string };

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
    } finally {
      setCreating(false);
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm("Delete this school? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await schoolApi.delete(id);
      setSchools((prev) => prev.filter((s) => s.id !== id));
      setTotal((t) => t - 1);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <DashboardLayout requiredRoles={["admin", "super_admin"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Schools</h1>
            <p className="text-gray-500 mt-1">{total} school{total !== 1 ? "s" : ""} registered.</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? "Cancel" : "Add School"}
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader><CardTitle>Add New School</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onCreate)} className="grid sm:grid-cols-2 gap-4">
                <Input
                  {...register("name", { required: "School name is required" })}
                  label="School Name"
                  placeholder="e.g. Maseru High School"
                  error={errors.name?.message}
                />
                <Input
                  {...register("location")}
                  label="Location"
                  placeholder="e.g. Maseru, Lesotho"
                />
                <div className="sm:col-span-2">
                  <Button type="submit" loading={creating}>Create School</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {schools.length === 0 ? (
          <div className="text-center py-20">
            <SchoolIcon size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400">No schools registered yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {schools.map((s) => (
              <Card key={s.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <SchoolIcon size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{s.name}</h3>
                        {s.location && (
                          <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                            <MapPin size={11} /> {s.location}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => onDelete(s.id)}
                      disabled={deleting === s.id}
                      className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 p-1 disabled:opacity-40"
                    >
                      <Trash2 size={16} />
                    </button>
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
