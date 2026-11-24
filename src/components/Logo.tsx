import styles from "./Logo.module.css";

// The upper half of the ball, coming apart into dots: x, y, radius on a 64-unit grid.
// Keep in sync with src/app/icon.svg.
const DOTS: [number, number, number][] = [
  [13, 27, 2.2], [19, 27, 2.2], [25, 27, 2.2], [31, 27, 2.2], [37, 27, 2.2], [43, 27, 2.2], [49, 27, 2.2],
  [16, 21, 1.9], [22, 21, 1.9], [28, 21, 1.9], [40, 21, 1.9], [46, 21, 1.9],
  [21, 15, 1.6], [33, 15, 1.6], [39, 15, 1.6],
  [28, 10, 1.3], [40, 9, 1.3],
  [22, 6, 1], [34, 4, 1],
];

/** Beulah mark: a ball cut by the scan line — solid below (brand), dissolving above (creator). */
export function Logo({ className }: { className?: string }) {
  return (
    <svg className={`${styles.logo} ${className ?? ""}`} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M10 32 A22 22 0 0 0 54 32 Z" fill="currentColor" />
      <g fill="currentColor">
        {DOTS.map(([x, y, r], i) => (
          <circle key={i} className={styles.dot} cx={x} cy={y} r={r} style={{ animationDelay: `${(i % 7) * -0.4}s` }} />
        ))}
      </g>
      <line x1="4" y1="32" x2="60" y2="32" stroke="var(--tungsten)" strokeWidth="2" />
    </svg>
  );
}
