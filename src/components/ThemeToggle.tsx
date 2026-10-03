"use client";

export function ThemeToggle() {
  // Decide on click, from what is actually showing, so no state or effect is needed.
  function toggle() {
    const root = document.documentElement;
    const dark =
      root.dataset.theme === "dark" ||
      (root.dataset.theme !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    const next = dark ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch {}
  }

  return (
    <button type="button" onClick={toggle} className="label link-quiet py-1.5" aria-label="Toggle light and dark mode">
      Theme
    </button>
  );
}
