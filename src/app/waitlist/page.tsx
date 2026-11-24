import type { Metadata } from "next";
import Link from "next/link";
import { WaitlistForm } from "@/components/WaitlistForm";
import { isRole } from "@/lib/waitlist";
import styles from "../hero.module.css";

export const metadata: Metadata = {
  title: "Waitlist",
  description: "Join the Beulah waitlist as a brand or a creator.",
};

type WaitlistPageProps = {
  searchParams: Promise<{ role?: string | string[] }>;
};

export default async function WaitlistPage({ searchParams }: WaitlistPageProps) {
  const { role } = await searchParams;
  const initialRole = isRole(role) ? role : "brand";

  return (
    <main className={styles.main}>
      <section className={styles.copy}>
        <p className={styles.eyebrow}>
          <b>●</b> Waitlist open
        </p>
        <h1 className={styles.title}>
          Join the <em>waitlist.</em>
        </h1>
        <p className={styles.lede}>
          Whether you&rsquo;re a brand looking for the right voice or a creator ready for your next
          opportunity, there&rsquo;s a place for you here.
        </p>

        <div className={styles.formSlot}>
          <WaitlistForm initialRole={initialRole} />
        </div>

        <Link href="/" className={styles.back}>
          ← Back
        </Link>
      </section>
    </main>
  );
}
