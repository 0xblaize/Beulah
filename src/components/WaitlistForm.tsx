"use client";

import { useMemo, useState, useSyncExternalStore, type FormEvent } from "react";
import { isEmail, type JoinResponse, type Role } from "@/lib/waitlist";
import styles from "./WaitlistForm.module.css";

type Joined = { email: string; role: Role; position: number };

const REMEMBER_KEY = "beulah:joined";

function readSaved() {
  try {
    return localStorage.getItem(REMEMBER_KEY);
  } catch {
    return null;
  }
}

function subscribeSaved(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

export function WaitlistForm() {
  const [role, setRole] = useState<Role>("brand");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [justJoined, setJustJoined] = useState<Joined | null>(null);

  // Returning visitors see their spot instead of the form.
  const savedRaw = useSyncExternalStore(subscribeSaved, readSaved, () => null);
  const saved = useMemo(() => {
    try {
      return savedRaw ? (JSON.parse(savedRaw) as Joined) : null;
    } catch {
      return null;
    }
  }, [savedRaw]);
  const joined = justJoined ?? saved;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const addr = email.trim();
    if (!isEmail(addr)) {
      setError("Enter a full email address, like name@company.com.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: addr, role }),
      });
      const data = (await res.json()) as JoinResponse;
      if (!data.ok) {
        setError(data.error);
        return;
      }
      const next = { email: addr, role, position: data.position };
      setJustJoined(next);
      try {
        localStorage.setItem(REMEMBER_KEY, JSON.stringify(next));
      } catch {}
    } catch {
      setError("We couldn't reach the server. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  if (joined) {
    return (
      <div className={styles.joined} role="status">
        <h2>You&rsquo;re on the list.</h2>
        <p>
          <span className={styles.position}>No. {String(joined.position).padStart(4, "0")}</span>
          We&rsquo;ll write to <b>{joined.email}</b> the day Beulah opens to{" "}
          {joined.role === "creator" ? "creators" : "brands"}.
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.roles} role="radiogroup" aria-label="I am joining as">
        {(["brand", "creator"] as const).map((r) => (
          <label key={r} className={role === r ? styles.on : undefined}>
            <input
              type="radio"
              name="role"
              id={`role-${r}`}
              value={r}
              checked={role === r}
              onChange={() => setRole(r)}
            />
            I&rsquo;m a {r}
          </label>
        ))}
      </div>

      <div className={styles.field}>
        <label htmlFor="email" className={styles.srOnly}>
          Work email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!error}
          aria-describedby="waitlist-status"
          required
        />
        <button type="submit" disabled={saving}>
          {saving ? "Saving" : "Join the waitlist"} <span aria-hidden="true">→</span>
        </button>
      </div>

      <p id="waitlist-status" className={styles.status} aria-live="polite">
        {error}
      </p>
    </form>
  );
}
