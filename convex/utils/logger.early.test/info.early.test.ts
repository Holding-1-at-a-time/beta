// Unit tests for: info

import { Logger } from "../logger";

describe("Logger.info() info method", () => {
  let logger: Logger;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new Logger();
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe("Happy path", () => {
    it("should log an info message with the correct format", () => {
      // Test to ensure the method works as expected under normal conditions
      const message = "This is an info message";
      logger.info(message);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        JSON.stringify({ level: "info", message }),
      );
    });

    it("should log an info message with additional metadata", () => {
      // Test to ensure the method works with additional metadata
      const message = "This is an info message";
      const meta = { user: "JohnDoe", action: "login" };
      logger.info(message, meta);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        JSON.stringify({ level: "info", message, ...meta }),
      );
    });
  });

  describe("Edge cases", () => {
    it("should handle an empty message string", () => {
      // Test to ensure the method handles an empty message string
      const message = "";
      logger.info(message);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        JSON.stringify({ level: "info", message }),
      );
    });

    it("should handle undefined metadata", () => {
      // Test to ensure the method handles undefined metadata
      const message = "This is an info message";
      logger.info(message, undefined);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        JSON.stringify({ level: "info", message }),
      );
    });

    it("should handle null metadata", () => {
      // Test to ensure the method handles null metadata
      const message = "This is an info message";
      logger.info(message, null as unknown as Record<string, unknown>);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        JSON.stringify({ level: "info", message }),
      );
    });

    it("should handle metadata with special characters", () => {
      // Test to ensure the method handles metadata with special characters
      const message = "This is an info message";
      const meta = { special: "chars!@#$%^&*()_+" };
      logger.info(message, meta);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        JSON.stringify({ level: "info", message, ...meta }),
      );
    });

    it("should handle metadata with nested objects", () => {
      // Test to ensure the method handles metadata with nested objects
      const message = "This is an info message";
      const meta = { user: { name: "JohnDoe", age: 30 } };
      logger.info(message, meta);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        JSON.stringify({ level: "info", message, ...meta }),
      );
    });
  });
});

// End of unit tests for: info
