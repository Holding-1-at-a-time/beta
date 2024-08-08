// components/dashboard/__tests__/AdminDashboard.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import AdminDashboard from "../AdminDashboard";
require("./jest.setup");

describe("AdminDashboard", () => {
  const mockData = {
    totalUsers: 100,
    totalOrganizations: 10,
    activeAppointments: 25,
  };

  it("renders the admin dashboard with correct data", () => {
    render(<AdminDashboard data={mockData} />);

    // Check if the title is rendered
    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();

    // Check if the data is correctly displayed
    expect(screen.getByText("Total Users")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();

    expect(screen.getByText("Total Organizations")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();

    expect(screen.getByText("Active Appointments")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
  });
});
