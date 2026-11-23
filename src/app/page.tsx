import { StageLoader } from "@/components/StageLoader";
import { Timecode } from "@/components/Timecode";
import { WaitlistForm } from "@/components/WaitlistForm";
import styles from "./page.module.css";

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
            <b>●</b> Waitlist open · B2B creator marketplace
          </p>
          <h1 className={styles.title}>
            Every brand needs a <em>face.</em>
          </h1>
          <p className={styles.lede}>
            Beulah connects B2B brands with the creators their buyers already trust.{" "}
            <strong>Brief once, approve every post, pay on delivery.</strong>
          </p>

          <WaitlistForm />

          <ol className={styles.steps}>
            <li><span>01</span>Brief</li>
            <li><span>02</span>Approve</li>
            <li><span>03</span>Pay on delivery</li>
          </ol>
        </section>
      </main>

      <footer className={`${styles.bar} ${styles.bottom}`}>
        <span>© 2026 Beulah</span>
        <span>2.39 : 1</span>
      </footer>
    </>
  );
}
