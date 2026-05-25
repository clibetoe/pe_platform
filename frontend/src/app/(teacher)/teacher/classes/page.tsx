"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { classApi } from "@/lib/api";
import type { Class } from "@/types";
import { useAuth } from "@/lib/auth";
import { Plus, Users, X } from "lucide-react";

export default function ClassesPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<{ name: string }>();

  useEffect(() => {
    classApi.list().then((r) => setClasses(r.data.results ?? r.data));
  }, []);

  const onCreate = async (data: { name: string }) => {
    if (!user?.school) return;
    setCreating(true);
    const r = await classApi.create({ name: data.name, school: Number(user.school) });
    setClasses((prev) => [...prev, r.data]);
    reset();
    setShowForm(false);
    setCreating(false);
  };

  return (
    <DashboardLayout requiredRoles={["teacher", "coach", "admin", "super_admin"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
            <p className="text-gray-500 mt-1">Manage your classes and student rosters.</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? "Cancel" : "New Class"}
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader><CardTitle>Create New Class</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onCreate)} className="flex gap-3 items-end">
                <div className="flex-1">
                  <Input
                    {...register("name", { required: "Class name is required" })}
                    label="Class Name"
                    placeholder="e.g. Grade 10 PE"
                    error={errors.name?.message}
                  />
                </div>
                <Button type="submit" loading={creating}>Create</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {classes.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Users size={48} className="mx-auto mb-3 opacity-40" />
            <p>No classes yet. Create your first class above.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((klass) => (
              <Card key={klass.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-5">
                  <h3 className="font-semibold text-gray-900">{klass.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="info">
                      <Users size={11} className="mr-1" />
                      {klass.student_count} students
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <Link href={`/teacher/classes/${klass.id}`}>
                      <Button variant="secondary" size="sm" className="w-full">
                        View Class
                      </Button>
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
