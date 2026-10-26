import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import Link from "next/link";

/** Renders Markdown with GitHub tables and KaTeX equations ($...$ and $$...$$). */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-note">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[[rehypeKatex, { strict: "ignore", throwOnError: false }]]}
        components={{
          a: ({ href = "", children: c }) =>
            href.startsWith("/") ? (
              <Link href={href}>{c}</Link>
            ) : (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {c}
              </a>
            ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
