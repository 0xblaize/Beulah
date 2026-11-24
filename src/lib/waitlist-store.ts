import "server-only";

import postgres from "postgres";
import type { Role } from "./waitlist";

/**
 * Sign-ups live in a Postgres table (Supabase). DATABASE_URL must be the pooler
 * connection string (Supabase → Connect → Transaction pooler, port 6543): the direct
 * db.*.supabase.co host is IPv6-only and unreachable from Vercel.
 */
let sql: postgres.Sql | undefined;
let ready: Promise<unknown> | undefined;

function db() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  // The transaction pooler can't keep prepared statements; one connection per function instance.
  sql ??= postgres(url, { prepare: false, max: 1 });
  // Row level security with no policies keeps the emails out of Supabase's public API;
  // this server connects as the table owner, which bypasses it.
  ready ??= sql`
    create table if not exists waitlist (
      id bigint generated always as identity primary key,
      email text not null unique,
      role text not null check (role in ('brand', 'creator')),
      joined_at timestamptz not null default now()
    );
    alter table waitlist enable row level security;
  `
    .simple()
    .catch((err) => {
      ready = undefined;
      throw err;
    });
  return { sql, ready };
}

/** Adds an email once; a repeat sign-up returns the original place in line. */
export async function addToWaitlist(email: string, role: Role) {
  const { sql, ready } = db();
  await ready;
  const inserted = await sql`
    insert into waitlist (email, role) values (${email}, ${role})
    on conflict (email) do nothing
    returning id
  `;
  const [{ position }] = await sql<{ position: number }[]>`
    select count(*)::int as position from waitlist
    where id <= (select id from waitlist where email = ${email})
  `;
  return { position, alreadyJoined: inserted.length === 0 };
}
