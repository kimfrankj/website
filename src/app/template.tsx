// A template remounts on every navigation, so a CSS animation gives a page-enter
// that works before JavaScript loads (and is switched off for reduced motion).
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
