import { Words } from "@/components/Words";

/** An oversized page title whose words rise in one after another. */
export function PageTitle({ text, className = "" }: { text: string; className?: string }) {
  return (
    <h1 data-node className={`words display text-title whitespace-nowrap ${className}`}>
      <Words text={text} />
    </h1>
  );
}
