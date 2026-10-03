import { MDXRemote } from "next-mdx-remote/rsc";

export function Prose({ source }: { source: string }) {
  return (
    <div className="prose prose-site max-w-none">
      <MDXRemote source={source} />
    </div>
  );
}
