/**
 * Letters that roll up one after another on hover, swapping for a copy from below
 * (the copy is a text-shadow, see `.roll` in globals.css). Hover is read from the nearest `.group`.
 */
export function Roll({ text }: { text: string }) {
  return (
    <span className="roll">
      <span className="sr-only">{text}</span>
      {[...text].map((c, i) => (
        <span key={i} aria-hidden="true" className="roll-char" style={{ "--i": i } as React.CSSProperties}>
          {c === " " ? " " : c}
        </span>
      ))}
    </span>
  );
}
