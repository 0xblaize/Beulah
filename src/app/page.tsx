import Link from "next/link";
import styles from "./hero.module.css";

const STEPS = ["Discover", "Connect", "Collaborate", "Grow"];

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.copy}>
        <p className={styles.eyebrow}>
          <b>●</b> The creator &amp; brand marketplace
        </p>
        <h1 className={styles.title}>
          Where brands meet <em>influence.</em>
          <span className={styles.titleSub}>
            Where creators meet <em>opportunity.</em>
          </span>
        </h1>
        <p className={styles.lede}>
          Beulah connects ambitious brands with talented creators across every industry.
        </p>

        <div className={`${styles.formSlot} ${styles.ctas}`}>
          <Link href="/waitlist?role=brand" className={`${styles.cta} ${styles.ctaPrimary}`}>
            I&rsquo;m a brand <span aria-hidden="true">→</span>
          </Link>
          <Link href="/waitlist?role=creator" className={styles.cta}>
            I&rsquo;m a creator <span aria-hidden="true">→</span>
          </Link>
        </div>

        <ol className={styles.steps}>
          {STEPS.map((step, i) => (
            <li key={step}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {step}
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
