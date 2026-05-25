"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { usersApi } from "@/lib/api";
import type { User } from "@/types";
import { Users, Search } from "lucide-react";
import { formatDate, roleLabel } from "@/lib/utils";

const ROLES = ["all", "student", "teacher", "coach", "admin", "super_admin"] as const;
type RoleFilter = (typeof ROLES)[number];

const roleBadgeVariant: Record<string, "default" | "info" | "success" | "warning" | "danger"> = {
  student: "info",
  teacher: "success",
  coach: "warning",
  admin: "danger",
  super_admin: "danger",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (roleFilter !== "all") params.role = roleFilter;
    if (search.length >= 2) params.search = search;
    usersApi.list(params).then((r) => {
      setUsers(r.data.results ?? r.data);
      setTotal(r.data.count ?? (r.data.results ?? r.data).length);
      setLoading(false);
    });
  }, [roleFilter, search]);

  return (
    <DashboardLayout requiredRoles={["admin", "super_admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 mt-1">{total} user{total !== 1 ? "s" : ""} registered.</p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg flex-wrap">
            {ROLES.map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-colors ${
                  roleFilter === r
                    ? "bg-white shadow-sm text-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {r.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Users size={40} className="mx-auto mb-3 opacity-40" />
            <p>No users found.</p>
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-5 font-semibold text-gray-600">User</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Role</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">School</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-700 flex-shrink-0 uppercase">
                              {u.first_name[0]}{u.last_name[0]}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{u.full_name}</p>
                              <p className="text-xs text-gray-400">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={roleBadgeVariant[u.role] ?? "default"}>
                            {roleLabel(u.role)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{u.school_name ?? "—"}</td>
                        <td className="py-3 px-4 text-gray-400 whitespace-nowrap">
                          {formatDate(u.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
