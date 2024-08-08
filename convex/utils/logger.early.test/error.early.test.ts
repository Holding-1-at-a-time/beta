// Unit tests for: error

import { Logger } from "../logger";

describe("Logger.error() error method", () => {
  let logger: Logger;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new Logger();
    consoleErrorSpy = jest
      .spyOn(global.console, "error")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("Happy path", () => {
    test("should log an error message with the correct format", () => {
      // Arrange
      const message = "An error occurred";
      const expectedOutput = JSON.stringify({ level: "error", message });

      // Act
      logger.error(message);

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith(expectedOutput);
    });

    test("should log an error message with additional metadata", () => {
      // Arrange
      const message = "An error occurred";
      const meta = { userId: 123, errorCode: "E001" };
      const expectedOutput = JSON.stringify({
        level: "error",
        message,
        ...meta,
      });

      // Act
      logger.error(message, meta);

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith(expectedOutput);
    });
  });

  describe("Edge cases", () => {
    test("should handle an empty error message", () => {
      // Arrange
      const message = "";
      const expectedOutput = JSON.stringify({ level: "error", message });

      // Act
      logger.error(message);

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith(expectedOutput);
    });

    test("should handle undefined metadata", () => {
      // Arrange
      const message = "An error occurred";
      const expectedOutput = JSON.stringify({ level: "error", message });

      // Act
      logger.error(message, undefined);

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith(expectedOutput);
    });

    test("should handle null metadata", () => {
      // Arrange
      const message = "An error occurred";
      const expectedOutput = JSON.stringify({ level: "error", message });

      // Act
      logger.error(message, null as any);

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith(expectedOutput);
    });

    test("should handle metadata with special characters", () => {
      // Arrange
      const message = "An error occurred";
      const meta = { special: "chars!@#$%^&*()_+" };
      const expectedOutput = JSON.stringify({
        level: "error",
        message,
        ...meta,
      });

      // Act
      logger.error(message, meta);

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith(expectedOutput);
    });

    test("should handle metadata with nested objects", () => {
      // Arrange
      const message = "An error occurred";
      const meta = { nested: { key: "value" } };
      const expectedOutput = JSON.stringify({
        level: "error",
        message,
        ...meta,
      });

      // Act
      logger.error(message, meta);

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith(expectedOutput);
    });
  });
});

// End of unit tests for: error
