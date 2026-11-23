import { NextResponse } from "next/server";
import { isEmail, isRole, type JoinResponse } from "@/lib/waitlist";
import { addToWaitlist } from "@/lib/waitlist-store";

function fail(error: string, status: number) {
  return NextResponse.json<JoinResponse>({ ok: false, error }, { status });
}

export async function POST(req: Request) {
  let body: { email?: unknown; role?: unknown };
  try {
    body = await req.json();
  } catch {
    return fail("Send the sign-up as JSON.", 400);
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!isEmail(email)) return fail("Enter a full email address, like name@company.com.", 422);
  if (!isRole(body.role)) return fail("Choose brand or creator.", 422);

  try {
    const { position, alreadyJoined } = await addToWaitlist(email, body.role);
    return NextResponse.json<JoinResponse>({ ok: true, position, alreadyJoined });
  } catch (err) {
    console.error("waitlist write failed", err);
    return fail("We couldn't save that just now. Try again in a moment.", 500);
  }
}
