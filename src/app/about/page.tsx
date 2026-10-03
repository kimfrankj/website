import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Frank Kim.",
};

export default function About() {
  return (
    <div className="wrap pt-16 md:pt-28">
      <h1 className="display text-title">About</h1>
      <p className="display mt-16 text-[length:var(--text-hero)] md:mt-24">Frolicking through life.</p>
    </div>
  );
}
