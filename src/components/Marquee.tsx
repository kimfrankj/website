/**
 * A band of italic words gliding slowly sideways, forever. Two identical runs sit end to end
 * so the loop is seamless (see `.marquee` in globals.css). Decorative, so hidden from screen readers.
 */
export function Marquee({ words }: { words: string[] }) {
  // Repeat the words so one run is wider than the widest screen
  const seq = Array.from({ length: 4 }, () => words).flat();
  const run = (
    <span className="marquee-run">
      {seq.map((w, i) => (
        <span key={i} className="inline-flex items-center">
          <span className="display italic">{w}</span>
          <span className="marquee-mark" />
        </span>
      ))}
    </span>
  );
  return (
    <div aria-hidden="true" className="marquee">
      <div className="marquee-track">
        {run}
        {run}
      </div>
    </div>
  );
}
