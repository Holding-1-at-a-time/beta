// __tests__/dashboard.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { useOrganization, useUser } from "@clerk/nextjs";
import DashboardContent from "../app/dashboard/DashboardContent";
import { OrganizationRole, UserInfo } from "../types/auth";
require("./jest.setup");

// Mock Clerk hooks
jest.mock("@clerk/nextjs", () => ({
  useOrganization: jest.fn(),
  useUser: jest.fn(),
}));

// Mock fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ someData: "test data" }),
  })
) as jest.Mock;

const mockUserData: UserInfo = {
  fullName: "John Doe",
  email: "john@example.com",
  organizationName: "Test Org",
  role: OrganizationRole.ADMIN,
};

describe("DashboardContent", () => {
  beforeEach(() => {
    (useOrganization as jest.Mock).mockReturnValue({
      organization: { name: "Test Org" },
    });
    (useUser as jest.Mock).mockReturnValue({ user: { fullName: "John Doe" } });
  });

  it("renders user information correctly", async () => {
    render(<DashboardContent userData={mockUserData} />);

    await waitFor(() => {
      expect(screen.getByText("Name: John Doe")).toBeInTheDocument();
      expect(screen.getByText("Email: john@example.com")).toBeInTheDocument();
      expect(screen.getByText("Organization: Test Org")).toBeInTheDocument();
      expect(screen.getByText("Role: org:admin")).toBeInTheDocument();
    });
  });

  it("renders admin dashboard for admin role", async () => {
    render(<DashboardContent userData={mockUserData} />);

    await waitFor(() => {
      expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
    });
  });

  it("renders loading state while fetching data", () => {
    render(<DashboardContent userData={mockUserData} />);

    expect(screen.getByText("Loading dashboard data...")).toBeInTheDocument();
  });

  it("renders error message when data fetch fails", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    ) as jest.Mock;

    render(<DashboardContent userData={mockUserData} />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Error fetching dashboard data. Please try again later."
        )
      ).toBeInTheDocument();
    });
  });

  // Add more test cases for different roles and scenarios
});
