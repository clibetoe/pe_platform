"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { usersApi } from "@/lib/api";
import type { User } from "@/types";
import { Users, Search } from "lucide-react";
import { formatDate, roleLabel } from "@/lib/utils";

const ROLES = ["all", "student", "teacher", "coach", "admin", "super_admin"] as const;
type RoleFilter = (typeof ROLES)[number];

const roleBadgeVariant: Record<string, "default" | "info" | "success" | "warning" | "danger"> = {
  student: "info", teacher: "success", coach: "warning", admin: "danger", super_admin: "danger",
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
      <div className="space-y-8">

        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-900 via-brand-800 to-pink-900 p-8 text-white">
          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/5" />
          <div className="absolute bottom-0 right-20 w-28 h-28 rounded-full bg-rose-400/15" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
              <p className="text-white/60 text-sm font-medium">User Management</p>
            </div>
            <h1 className="font-display font-extrabold text-3xl text-white mb-2">Users</h1>
            <p className="text-white/60 text-sm">{total} user{total !== 1 ? "s" : ""} registered on the platform.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-card">
          <div className="pointer-events-none absolute -top-6 -right-6 w-28 h-28 rounded-full bg-rose-400/[0.05]" />
          <div className="pointer-events-none absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-brand-400/[0.06]" />
          <div className="relative z-10 p-5 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-48">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl flex-wrap">
              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    roleFilter === r ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {r.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Users table */}
        {loading ? (
          <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14" />)}</div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
              <Users size={28} className="text-rose-300" />
            </div>
            <p className="text-gray-400 font-medium">No users found.</p>
          </div>
        ) : (
          <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-card">
            <div className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full bg-rose-400/[0.05]" />
            <div className="pointer-events-none absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-brand-400/[0.06]" />
            <div className="relative z-10 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50">
                    <th className="text-left py-3 px-5 font-semibold text-gray-500 text-xs uppercase tracking-wide">User</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">School</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 uppercase">
                            {u.first_name[0]}{u.last_name[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{u.full_name}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4"><Badge variant={roleBadgeVariant[u.role] ?? "default"}>{roleLabel(u.role)}</Badge></td>
                      <td className="py-3.5 px-4 text-gray-600 text-sm">{u.school_name ?? "—"}</td>
                      <td className="py-3.5 px-4 text-gray-400 text-xs whitespace-nowrap">{formatDate(u.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
