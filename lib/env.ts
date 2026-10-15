import "server-only";

/**
 * Read a required environment variable and fail fast with a helpful message if
 * it is missing. Keeping the check in one place avoids scattering
 * `process.env.X!` non-null assertions around the codebase.
 */
export function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing ${name}. Copy .env.local.example to .env.local and fill it in.`,
    );
  }

  return value;
}
