// components/dashboard/AdminDashboard.tsx
import React from "react";

interface AdminDashboardProps {
  data: {
    totalUsers: number;
    totalOrganizations: number;
    activeAppointments: number;
  };
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ data }) => {
  return (
    <div className="admin-dashboard">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-3xl font-bold">{data.totalUsers}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Total Organizations</h3>
          <p className="text-3xl font-bold">{data.totalOrganizations}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Active Appointments</h3>
          <p className="text-3xl font-bold">{data.activeAppointments}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
