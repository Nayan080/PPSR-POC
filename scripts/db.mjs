// Starts a local PostgreSQL server for development (no Docker or system install needed).
// Data lives in ./.pgdata and persists between runs. Stop with Ctrl+C.
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import EmbeddedPostgres from "embedded-postgres";

const databaseDir = resolve(import.meta.dirname, "..", ".pgdata");
const port = Number(process.env.PGPORT ?? 5433);
const database = "ppsr";

const pg = new EmbeddedPostgres({
  databaseDir,
  user: "ppsr",
  password: "ppsr",
  port,
  persistent: true,
});

const fresh = !existsSync(databaseDir);
if (fresh) await pg.initialise();
await pg.start();
if (fresh) await pg.createDatabase(database);

console.log(`PostgreSQL ready: postgres://ppsr:ppsr@localhost:${port}/${database}`);

const shutdown = async () => {
  await pg.stop();
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
