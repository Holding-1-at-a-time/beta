// Unit tests for: cn

import { clsx } from "clsx";

import { twMerge } from "tailwind-merge";

import { cn } from "../utils";

// Mocking the dependencies
type MockClassValue = {
  value: string;
};

jest.mock("clsx", () => ({
  clsx: jest.fn(),
}));

jest.mock("tailwind-merge", () => ({
  twMerge: jest.fn(),
}));

describe("cn() cn method", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Happy Path", () => {
    it("should merge class names correctly", () => {
      // Arrange
      const mockInputs: MockClassValue[] = [
        { value: "class1" } as any,
        { value: "class2" } as any,
      ];
      (clsx as jest.Mock).mockReturnValue("class1 class2" as any);
      (twMerge as jest.Mock).mockReturnValue("class1 class2" as any);

      // Act
      const result = cn(...mockInputs);

      // Assert
      expect(clsx).toHaveBeenCalledWith(mockInputs);
      expect(twMerge).toHaveBeenCalledWith("class1 class2");
      expect(result).toBe("class1 class2");
    });

    it("should handle empty input", () => {
      // Arrange
      const mockInputs: MockClassValue[] = [];
      (clsx as jest.Mock).mockReturnValue("" as any);
      (twMerge as jest.Mock).mockReturnValue("" as any);

      // Act
      const result = cn(...mockInputs);

      // Assert
      expect(clsx).toHaveBeenCalledWith(mockInputs);
      expect(twMerge).toHaveBeenCalledWith("");
      expect(result).toBe("");
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined inputs", () => {
      // Arrange
      const mockInputs: MockClassValue[] = [
        undefined,
        { value: "class1" } as any,
      ];
      (clsx as jest.Mock).mockReturnValue("class1" as any);
      (twMerge as jest.Mock).mockReturnValue("class1" as any);

      // Act
      const result = cn(...mockInputs);

      // Assert
      expect(clsx).toHaveBeenCalledWith(mockInputs);
      expect(twMerge).toHaveBeenCalledWith("class1");
      expect(result).toBe("class1");
    });

    it("should handle null inputs", () => {
      // Arrange
      const mockInputs: MockClassValue[] = [null, { value: "class1" } as any];
      (clsx as jest.Mock).mockReturnValue("class1" as any);
      (twMerge as jest.Mock).mockReturnValue("class1" as any);

      // Act
      const result = cn(...mockInputs);

      // Assert
      expect(clsx).toHaveBeenCalledWith(mockInputs);
      expect(twMerge).toHaveBeenCalledWith("class1");
      expect(result).toBe("class1");
    });

    it("should handle mixed valid and invalid inputs", () => {
      // Arrange
      const mockInputs: MockClassValue[] = [
        { value: "class1" } as any,
        undefined,
        { value: "class2" } as any,
        null,
      ];
      (clsx as jest.Mock).mockReturnValue("class1 class2" as any);
      (twMerge as jest.Mock).mockReturnValue("class1 class2" as any);

      // Act
      const result = cn(...mockInputs);

      // Assert
      expect(clsx).toHaveBeenCalledWith(mockInputs);
      expect(twMerge).toHaveBeenCalledWith("class1 class2");
      expect(result).toBe("class1 class2");
    });

    it("should handle inputs with empty strings", () => {
      // Arrange
      const mockInputs: MockClassValue[] = [
        { value: "" } as any,
        { value: "class1" } as any,
      ];
      (clsx as jest.Mock).mockReturnValue("class1" as any);
      (twMerge as jest.Mock).mockReturnValue("class1" as any);

      // Act
      const result = cn(...mockInputs);

      // Assert
      expect(clsx).toHaveBeenCalledWith(mockInputs);
      expect(twMerge).toHaveBeenCalledWith("class1");
      expect(result).toBe("class1");
    });
  });
});

// End of unit tests for: cn
