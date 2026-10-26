// A template remounts on every navigation, so CSS animations here play on each page change
// and work before JavaScript loads (all switched off for reduced motion).
// The curtain: an ink panel and a rust panel lift away one after the other to reveal the page.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="curtain" aria-hidden="true" />
      <div className="page-enter">{children}</div>
    </>
  );
}
