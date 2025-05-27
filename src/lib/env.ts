import { z, ZodError } from "zod";

/**
 * Define all you env variables in this schema to get full type-safety in accessing them.
 */
const EnvSchema = z.object({
  APP_HOST: z.string().url(),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_USER: z.string(),
  DB_PASS: z.string(),
  DB_NAME: z.string(),
});

export type Env = z.infer<typeof EnvSchema>;

let env: Env;

try {
  env = EnvSchema.parse(process.env);
} catch (error) {
  const zodError = error as ZodError;
  console.error(zodError.flatten().fieldErrors);
  process.exit(1);
}

export default env;
