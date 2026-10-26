import { Fragment } from "react";

/**
 * Splits a heading into words that rise one after another from behind a mask.
 * Pure CSS (see `.words` in globals.css), so it plays before JavaScript loads.
 */
export function Words({ text, delay = 0 }: { text: string; delay?: number }) {
  return text.split(" ").map((word, i) => (
    <Fragment key={i}>
      {i > 0 && " "}
      <span className="word">
        <span style={{ "--i": i, "--d": `${delay}ms` } as React.CSSProperties}>{word}</span>
      </span>
    </Fragment>
  ));
}
