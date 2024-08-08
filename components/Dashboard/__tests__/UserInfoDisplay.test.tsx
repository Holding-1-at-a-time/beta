// components/dashboard/__tests__/UserInfoDisplay.test.tsx
import { render, screen } from "@testing-library/react";
import UserInfoDisplay from "../UserInfoDisplay";
import { OrganizationRole } from "@/types/auth";

describe("UserInfoDisplay", () => {
  const mockUserData = {
    fullName: "John Doe",
    email: "john@example.com",
    organizationName: "Test Org",
    role: OrganizationRole.ADMIN,
  };

  it("renders user information correctly", () => {
    render(<UserInfoDisplay userData={mockUserData} />);

    expect(screen.getByText("Name: John Doe")).toBeInTheDocument();
    expect(screen.getByText("Email: john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Organization: Test Org")).toBeInTheDocument();
    expect(screen.getByText("Role: org:admin")).toBeInTheDocument();
  });
});
