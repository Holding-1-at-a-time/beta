// Generated by CodiumAI

describe("AdvancedSettings", () => {
  // Form renders correctly with default values
  it("should render form with default values when component mounts", () => {
    const { getByLabelText } = render(
      <AdvancedSettings tenantId="test-tenant" />
    );
    expect(getByLabelText("Data Retention Period").value).toBe("1year");
    expect(getByLabelText("Default Timezone").value).toBe("UTC");
    expect(getByLabelText("Default Language").value).toBe("en");
  });

  // User can successfully update advanced settings
  it("should update advanced settings when form is submitted", async () => {
    const updateAdvancedSettings = jest.fn();
    useMutation.mockReturnValue(updateAdvancedSettings);
    const { getByText, getByLabelText } = render(
      <AdvancedSettings tenantId="test-tenant" />
    );
    fireEvent.change(getByLabelText("Data Retention Period"), {
      target: { value: "2years" },
    });
    fireEvent.click(getByText("Save Changes"));
    await waitFor(() =>
      expect(updateAdvancedSettings).toHaveBeenCalledWith({
        tenantId: "test-tenant",
        settings: expect.any(Object),
      })
    );
  });

  // User can successfully export data
  it("should export data when export button is clicked", async () => {
    const exportData = jest
      .fn()
      .mockResolvedValue(
        new Blob(["data"], { type: "application/octet-stream" })
      );
    useMutation.mockReturnValue(exportData);
    const { getByText } = render(<AdvancedSettings tenantId="test-tenant" />);
    fireEvent.click(getByText("Export All Data"));
    await waitFor(() =>
      expect(exportData).toHaveBeenCalledWith({ tenantId: "test-tenant" })
    );
  });

  // Toast notifications display on successful update
  it("should display success toast on successful update", async () => {
    const toast = jest.fn();
    useToast.mockReturnValue({ toast });
    const updateAdvancedSettings = jest.fn().mockResolvedValue({});
    useMutation.mockReturnValue(updateAdvancedSettings);
    const { getByText } = render(<AdvancedSettings tenantId="test-tenant" />);
    fireEvent.click(getByText("Save Changes"));
    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Success" })
      )
    );
  });

  // Toast notifications display on successful export
  it("should display success toast on successful export", async () => {
    const toast = jest.fn();
    useToast.mockReturnValue({ toast });
    const exportData = jest
      .fn()
      .mockResolvedValue(
        new Blob(["data"], { type: "application/octet-stream" })
      );
    useMutation.mockReturnValue(exportData);
    const { getByText } = render(<AdvancedSettings tenantId="test-tenant" />);
    fireEvent.click(getByText("Export All Data"));
    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Success" })
      )
    );
  });

  // Form validation works with correct input
  it("should validate form with correct input", async () => {
    const { getByText, getByLabelText } = render(
      <AdvancedSettings tenantId="test-tenant" />
    );
    fireEvent.change(getByLabelText("Data Retention Period"), {
      target: { value: "2years" },
    });
    fireEvent.click(getByText("Save Changes"));
    await waitFor(() => expect(getByText("Save Changes")).not.toBeDisabled());
  });

  // Form submission fails due to network error
  it("should show error toast on form submission failure due to network error", async () => {
    const toast = jest.fn();
    useToast.mockReturnValue({ toast });
    const updateAdvancedSettings = jest
      .fn()
      .mockRejectedValue(new Error("Network Error"));
    useMutation.mockReturnValue(updateAdvancedSettings);
    const { getByText } = render(<AdvancedSettings tenantId="test-tenant" />);
    fireEvent.click(getByText("Save Changes"));
    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Error" })
      )
    );
  });

  // Export data fails due to network error
  it("should show error toast on export data failure due to network error", async () => {
    const toast = jest.fn();
    useToast.mockReturnValue({ toast });
    const exportData = jest.fn().mockRejectedValue(new Error("Network Error"));
    useMutation.mockReturnValue(exportData);
    const { getByText } = render(<AdvancedSettings tenantId="test-tenant" />);
    fireEvent.click(getByText("Export All Data"));
    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Error" })
      )
    );
  });

  // Form submission with invalid data shows validation errors
  it("should show validation errors on form submission with invalid data", async () => {
    const { getByText, getByLabelText } = render(
      <AdvancedSettings tenantId="test-tenant" />
    );
    fireEvent.change(getByLabelText("Data Retention Period"), {
      target: { value: "" },
    });
    fireEvent.click(getByText("Save Changes"));
    await waitFor(() =>
      expect(getByText(/validation error/i)).toBeInTheDocument()
    );
  });

  // Export data returns empty result
  it("should show error toast when export data returns empty result", async () => {
    const toast = jest.fn();
    useToast.mockReturnValue({ toast });
    const exportData = jest.fn().mockResolvedValue(null);
    useMutation.mockReturnValue(exportData);
    const { getByText } = render(<AdvancedSettings tenantId="test-tenant" />);
    fireEvent.click(getByText("Export All Data"));
    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Error" })
      )
    );
  });

  // Advanced settings query returns undefined
  it("should show loading state when advanced settings query returns undefined", () => {
    useQuery.mockReturnValue(undefined);
    const { getByText } = render(<AdvancedSettings tenantId="test-tenant" />);
    expect(getByText(/loading/i)).toBeInTheDocument();
  });

  // Form submission with missing tenantId
  it("should not submit form when tenantId is missing", async () => {
    const updateAdvancedSettings = jest.fn();
    useMutation.mockReturnValue(updateAdvancedSettings);
    const { getByText } = render(<AdvancedSettings tenantId={null} />);
    fireEvent.click(getByText("Save Changes"));
    await waitFor(() => expect(updateAdvancedSettings).not.toHaveBeenCalled());
  });

  // Export button is enabled when not exporting
  it("should enable export button when not exporting", () => {
    const { getByText } = render(<AdvancedSettings tenantId="test-tenant" />);
    const exportButton = getByText("Export All Data");
    expect(exportButton).not.toBeDisabled();
  });

  // Form submission button is enabled when form is dirty
  it("should enable form submission button when form is dirty", () => {
    // Mocking the required functions and values
    const mockAdvancedSettings = {
      dataRetention: "1year",
      defaultTimezone: "UTC",
      defaultLanguage: "en",
    };
    const mockUpdateAdvancedSettings = jest.fn();
    const mockExportData = jest.fn();
    const mockToast = jest.fn();

    // Rendering the component
    const { getByText, getByRole } = render(
      <AdvancedSettings tenantId="test-tenant" />
    );

    // Triggering form dirty state
    fireEvent.change(getByRole("combobox", { name: "Data Retention Period" }), {
      target: { value: "2years" },
    });

    // Checking if form submission button is enabled
    expect(getByText("Save Changes")).toBeEnabled();
  });

  // Export data with missing tenantId
  it("should display error message when exporting data with missing tenantId", () => {
    const { getByText, getByRole } = render(<AdvancedSettings />);
    const exportButton = getByRole("button", { name: "Export All Data" });

    fireEvent.click(exportButton);

    expect(
      getByText("Failed to export data. Please try again.")
    ).toBeInTheDocument();
  });

  // Export button shows loading state when exporting
  it("should show loading state when exporting", () => {
    const { getByText } = render(<AdvancedSettings tenantId="test-tenant" />);
    const exportButton = getByText("Export All Data");

    fireEvent.click(exportButton);

    expect(getByText("Exporting...")).toBeInTheDocument();
  });

  // Form submission button shows loading state when submitting
  it("should show loading state on form submission", async () => {
    const mockAdvancedSettings = {
      dataRetention: "1year",
      defaultTimezone: "UTC",
      defaultLanguage: "en",
    };
    const mockUpdateAdvancedSettings = jest.fn();
    const mockExportData = jest.fn();
    const mockToast = jest.fn();
    const mockUseToast = jest.fn().mockReturnValue({ toast: mockToast });
    const mockUseQuery = jest.fn().mockReturnValue(mockAdvancedSettings);
    const mockUseMutation = jest.fn().mockImplementation((apiMethod) => {
      if (apiMethod === api.advancedSettings.update) {
        return mockUpdateAdvancedSettings;
      } else if (apiMethod === api.advancedSettings.exportData) {
        return mockExportData;
      }
    });
    const mockSetIsSubmitting = jest.fn();
    const mockSetIsExporting = jest.fn();
    const mockUseState = jest.spyOn(React, "useState");
    mockUseState.mockImplementation((initial) => [
      initial,
      initial === false ? mockSetIsSubmitting : mockSetIsExporting,
    ]);

    render(<AdvancedSettings tenantId="test-tenant" />);

    await act(async () => {
      await fireEvent.click(
        screen.getByRole("button", { name: "Save Changes" })
      );
    });

    expect(mockSetIsSubmitting).toHaveBeenCalledWith(true);
    expect(mockUpdateAdvancedSettings).toHaveBeenCalledWith({
      tenantId: "test-tenant",
      settings: mockAdvancedSettings,
    });
    expect(mockToast).toHaveBeenCalledWith({
      title: "Success",
      description: "Advanced settings updated successfully",
    });
    expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
  });

  // Error messages display correctly on form validation failure
  it("should display error messages when form validation fails", () => {
    // Mock toast function
    const mockToast = jest.fn();
    jest.mock("@/components/ui/use-toast", () => ({
      useToast: () => ({
        toast: mockToast,
      }),
    }));

    // Mock useForm hook
    jest.mock("react-hook-form", () => ({
      useForm: () => ({
        control: {},
        handleSubmit: jest.fn(),
        formState: {
          errors: { dataRetention: { message: "Data retention is required" } },
          isDirty: false,
        },
      }),
    }));

    // Render AdvancedSettings component
    const { getByText } = render(<AdvancedSettings tenantId="test-tenant" />);

    // Check if error message is displayed for data retention field
    expect(getByText("Data retention is required")).toBeInTheDocument();
  });

  // Default values are correctly populated from advancedSettings query
  it("should populate form with default values from advancedSettings query", () => {
    const mockAdvancedSettings = {
      dataRetention: "1year",
      defaultTimezone: "UTC",
      defaultLanguage: "en",
    };
    jest.mock("convex/react", () => ({
      useQuery: jest.fn(() => mockAdvancedSettings),
    }));

    const { getByLabelText } = render(
      <AdvancedSettings tenantId="test-tenant" />
    );

    expect(getByLabelText("Data Retention Period").value).toBe("1year");
    expect(getByLabelText("Default Timezone").value).toBe("UTC");
    expect(getByLabelText("Default Language").value).toBe("en");
  });

  // Blob creation and download link work correctly for export
  it("should create a Blob and download link when exporting data", () => {
    const mockResult = "mocked data result";
    const mockBlob = new Blob([mockResult], {
      type: "application/octet-stream",
    });
    const mockUrl = "mocked-url";
    const mockLink = document.createElement("a");
    jest.spyOn(URL, "createObjectURL").mockReturnValue(mockUrl);
    jest.spyOn(document, "createElement").mockReturnValue(mockLink);
    jest.spyOn(URL, "revokeObjectURL").mockImplementation();
    jest
      .spyOn(api.advancedSettings, "exportData")
      .mockResolvedValue(mockResult);

    const { getByText } = render(<AdvancedSettings tenantId="test-tenant" />);
    fireEvent.click(getByText("Export All Data"));

    expect(api.advancedSettings.exportData).toHaveBeenCalledWith({
      tenantId: "test-tenant",
    });
    expect(URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
    expect(mockLink.href).toBe(mockUrl);
    expect(mockLink.download).toBe("data-export-test-tenant.zip");

    jest.clearAllMocks();
  });
});
