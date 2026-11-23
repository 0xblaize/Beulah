export const ROLES = ["brand", "creator"] as const;
export type Role = (typeof ROLES)[number];

export type WaitlistEntry = {
  email: string;
  role: Role;
  joinedAt: string;
};

export type JoinResponse =
  | { ok: true; position: number; alreadyJoined: boolean }
  | { ok: false; error: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(value: string) {
  return value.length <= 254 && EMAIL.test(value);
}

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}
