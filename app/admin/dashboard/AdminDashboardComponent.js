// app/admin/dashboard/AdminDashboardComponent.js
"use client";
import ProtectedAdminRoute from "@/app/components/ProtectedAdminRoute";

const AdminDashboardComponent = () => {
  return (
    <ProtectedAdminRoute>
      <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
      {/* Additional dashboard content goes here */}
    </ProtectedAdminRoute>
  );
};

export default AdminDashboardComponent;