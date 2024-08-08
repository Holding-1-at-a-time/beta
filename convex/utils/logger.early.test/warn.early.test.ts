// Unit tests for: warn

import { Logger } from "../logger";

describe("Logger.warn() warn method", () => {
  let logger: Logger;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new Logger();
    consoleWarnSpy = jest
      .spyOn(global.console, "warn")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  // Happy Path Tests
  describe("Happy Path", () => {
    test("should log a warning message with the correct level and message", () => {
      const message = "This is a warning";
      logger.warn(message);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        JSON.stringify({ level: "warn", message }),
      );
    });

    test("should log a warning message with additional metadata", () => {
      const message = "This is a warning";
      const meta = { user: "JohnDoe", action: "login" };
      logger.warn(message, meta);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        JSON.stringify({ level: "warn", message, ...meta }),
      );
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    test("should handle an empty message string", () => {
      const message = "";
      logger.warn(message);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        JSON.stringify({ level: "warn", message }),
      );
    });

    test("should handle undefined metadata", () => {
      const message = "This is a warning";
      logger.warn(message, undefined);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        JSON.stringify({ level: "warn", message }),
      );
    });

    test("should handle null metadata", () => {
      const message = "This is a warning";
      logger.warn(message, null as unknown as Record<string, unknown>);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        JSON.stringify({ level: "warn", message }),
      );
    });

    test("should handle metadata with special characters", () => {
      const message = "This is a warning";
      const meta = { special: '!@#$%^&*()_+{}:"<>?' };
      logger.warn(message, meta);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        JSON.stringify({ level: "warn", message, ...meta }),
      );
    });

    test("should handle metadata with nested objects", () => {
      const message = "This is a warning";
      const meta = { user: { name: "JohnDoe", id: 123 }, action: "login" };
      logger.warn(message, meta);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        JSON.stringify({ level: "warn", message, ...meta }),
      );
    });

    test("should handle metadata with array values", () => {
      const message = "This is a warning";
      const meta = { tags: ["urgent", "system"] };
      logger.warn(message, meta);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        JSON.stringify({ level: "warn", message, ...meta }),
      );
    });
  });
});

// End of unit tests for: warn
