import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { Admins } from "./collections/Admins";
import { Categories } from "./collections/Categories";
import { Media } from "./collections/Media";
import { Programmes } from "./collections/Programmes";
import { Providers } from "./collections/Providers";
import { Users } from "./collections/Users";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

if (!process.env.PAYLOAD_SECRET) {
  throw new Error("PAYLOAD_SECRET must be set.");
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set.");
}

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET,
  admin: {
    user: Admins.slug,
    importMap: {
      baseDir: dirname,
    },
  },
  collections: [Admins, Users, Categories, Providers, Programmes, Media],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
    migrationDir: path.resolve(dirname, "migrations"),
  }),
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  cookiePrefix: "eagles-eye",
  cors: [process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"],
  csrf: [process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"],
});
