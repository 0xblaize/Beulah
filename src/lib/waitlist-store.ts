import "server-only";

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Role, WaitlistEntry } from "./waitlist";

/**
 * Local demo store: sign-ups live in data/waitlist.json.
 * Swap this module for a real database (Supabase, Postgres, Airtable…) before
 * deploying to a serverless host, whose filesystem is read-only.
 */
const FILE = path.join(process.cwd(), "data", "waitlist.json");

let queue: Promise<unknown> = Promise.resolve();

async function readAll(): Promise<WaitlistEntry[]> {
  try {
    return JSON.parse(await readFile(FILE, "utf8")) as WaitlistEntry[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function writeAll(entries: WaitlistEntry[]) {
  await mkdir(path.dirname(FILE), { recursive: true });
  const tmp = `${FILE}.tmp`;
  await writeFile(tmp, JSON.stringify(entries, null, 2));
  await rename(tmp, FILE);
}

/** Adds an email once; a repeat sign-up returns the original place in line. */
export function addToWaitlist(email: string, role: Role) {
  const run = queue.then(async () => {
    const entries = await readAll();
    const existing = entries.findIndex((e) => e.email === email);
    if (existing !== -1) return { position: existing + 1, alreadyJoined: true };
    entries.push({ email, role, joinedAt: new Date().toISOString() });
    await writeAll(entries);
    return { position: entries.length, alreadyJoined: false };
  });
  queue = run.catch(() => undefined);
  return run;
}
