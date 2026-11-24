import Link from "next/link";
import { Logo } from "./Logo";
import styles from "./Frame.module.css";

/** Letterbox bars shared by every page, so they stay put between routes. */
export function Frame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className={`${styles.bar} ${styles.top}`}>
        <Link href="/" className={styles.mark}>
          <Logo className={styles.logo} />
          Beulah
        </Link>
        <span className={`${styles.rec} ${styles.hideSm}`}>Reel 01 · Scan</span>
      </header>

      {children}

      <footer className={`${styles.bar} ${styles.bottom}`}>
        <span>© 2026 Beulah</span>
        <span className={`${styles.tagline} ${styles.hideSm}`}>
          The future of brand-creator partnerships starts here.
        </span>
      </footer>
    </>
  );
}
