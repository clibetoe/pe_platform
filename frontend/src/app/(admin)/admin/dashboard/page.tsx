"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { LayoutDashboard } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <DashboardLayout requiredRoles={["admin", "super_admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Platform-wide management and analytics.</p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <LayoutDashboard size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Admin analytics panels coming in Phase 2.</p>
            <p className="text-sm text-gray-400 mt-1">
              Use the <a href="/admin/" className="text-brand-600 hover:underline">Django Admin</a> panel for full data management.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
