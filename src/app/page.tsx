import { StageLoader } from "@/components/StageLoader";
import { Timecode } from "@/components/Timecode";
import { WaitlistForm } from "@/components/WaitlistForm";
import styles from "./page.module.css";

const STEPS = ["Discover", "Connect", "Collaborate", "Grow"];

export default function Home() {
  return (
    <>
      <StageLoader />

      <header className={`${styles.bar} ${styles.top}`}>
        <span className={styles.mark}>Beulah</span>
        <span className={`${styles.rec} ${styles.hideSm}`}>Reel 01 · Scan</span>
        <Timecode className={styles.tc} />
      </header>

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
          <div className={styles.lede}>
            <p>
              Beulah connects ambitious brands with talented creators across every industry, making
              meaningful partnerships, powerful campaigns and creative collaborations easier to
              discover, manage and grow.
            </p>
            <p>
              <strong>
                Whether you&rsquo;re a brand looking for the right voice or a creator ready for your
                next opportunity, there&rsquo;s a place for you here.
              </strong>
            </p>
          </div>

          <WaitlistForm />

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

      <footer className={`${styles.bar} ${styles.bottom}`}>
        <span>© 2026 Beulah</span>
        <span className={`${styles.tagline} ${styles.hideSm}`}>
          The future of brand-creator partnerships starts here.
        </span>
        <span>2.39 : 1</span>
      </footer>
    </>
  );
}
