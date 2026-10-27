type Level = "debug" | "info" | "warn" | "error";
type Context = Record<string, unknown>;

const LEVEL_ORDER: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };
const MIN_LEVEL: Level = process.env.NODE_ENV === "production" ? "warn" : "debug";

function log(level: Level, message: string, error?: unknown, context?: Context) {
  if (LEVEL_ORDER[level] < LEVEL_ORDER[MIN_LEVEL]) return;

  const prefix = `[${new Date().toISOString()}] ${level.toUpperCase()}: ${message}`;
  const args: unknown[] = [prefix];
  if (context) args.push(context);
  if (error !== undefined) args.push(error);

  // eslint-disable-next-line no-console
  console[level](...args);
}

/**
 * Minimal app logger. Pass the original error object (not just its message)
 * so stack traces are preserved.
 *
 *   logger.error("Failed to save expense", err, { expenseId });
 */
export const logger = {
  debug: (message: string, context?: Context) => log("debug", message, undefined, context),
  info: (message: string, context?: Context) => log("info", message, undefined, context),
  warn: (message: string, error?: unknown, context?: Context) => log("warn", message, error, context),
  error: (message: string, error?: unknown, context?: Context) => log("error", message, error, context),
};
