/**
 * Markdown rendering configuration
 * Custom component overrides for react-markdown with NEXUS cyberpunk styling.
 */

export const markdownComponents = {
  h1: ({ children }) => (
    <h1 className="text-3xl sm:text-4xl font-black text-white mt-10 mb-4 tracking-tight leading-tight">
      {children}
    </h1>
  ),

  h2: ({ children }) => (
    <h2 className="text-2xl sm:text-3xl font-black text-white mt-10 mb-4 tracking-tight leading-tight relative inline-block">
      {children}
      <span className="block h-0.5 mt-2 bg-gradient-to-r from-[#00FF88] via-[#00E0FF] to-transparent rounded-full" />
    </h2>
  ),

  h3: ({ children }) => (
    <h3 className="text-xl font-bold text-white mt-8 mb-3 tracking-tight">
      {children}
    </h3>
  ),

  h4: ({ children }) => (
    <h4 className="text-lg font-bold text-white/90 mt-6 mb-2">{children}</h4>
  ),

  p: ({ children }) => (
    <p className="text-white/60 leading-[1.8] mb-5 text-[15px]">{children}</p>
  ),

  strong: ({ children }) => (
    <strong className="text-white font-bold">{children}</strong>
  ),

  em: ({ children }) => (
    <em className="text-[#00E0FF] not-italic font-medium">{children}</em>
  ),

  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#00FF88] underline underline-offset-2 decoration-[#00FF88]/30 hover:decoration-[#00FF88] transition-colors"
    >
      {children}
    </a>
  ),

  blockquote: ({ children }) => (
    <blockquote className="relative my-6 pl-5 py-4 pr-4 border-l-2 border-[#00FF88] bg-[#00FF88]/[0.03] rounded-r-xl">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#00FF88]/[0.05] to-transparent rounded-r-xl pointer-events-none" />
      <div className="relative text-white/50 text-[15px] italic leading-relaxed [&>p]:mb-0">
        {children}
      </div>
    </blockquote>
  ),

  ul: ({ children }) => (
    <ul className="my-4 ml-1 space-y-2 text-white/60 text-[15px]">{children}</ul>
  ),

  ol: ({ children }) => (
    <ol className="my-4 ml-1 space-y-2 text-white/60 text-[15px] list-decimal list-inside">{children}</ol>
  ),

  li: ({ children, ordered }) => (
    <li className="flex gap-2 leading-relaxed">
      {!ordered && (
        <span className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#00FF88]/60" />
      )}
      <span className="flex-1">{children}</span>
    </li>
  ),

  code: ({ inline, className, children }) => {
    if (inline) {
      return (
        <code className="px-1.5 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.08] text-[#00E0FF] text-[13px] font-mono">
          {children}
        </code>
      );
    }

    return (
      <div className="my-6 rounded-xl overflow-hidden border border-white/[0.08] bg-[#080a0e]">
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.06]">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
          {className && (
            <span className="ml-2 text-[10px] text-white/20 font-mono uppercase tracking-wider">
              {className.replace('language-', '')}
            </span>
          )}
        </div>
        <pre className="p-4 overflow-x-auto">
          <code className={`text-[13px] leading-relaxed font-mono text-white/70 ${className || ''}`}>
            {children}
          </code>
        </pre>
      </div>
    );
  },

  pre: ({ children }) => <>{children}</>,

  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-white/[0.08]">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),

  thead: ({ children }) => (
    <thead className="bg-white/[0.03] border-b border-white/[0.08]">{children}</thead>
  ),

  tbody: ({ children }) => <tbody className="divide-y divide-white/[0.05]">{children}</tbody>,

  tr: ({ children }) => (
    <tr className="hover:bg-white/[0.02] transition-colors">{children}</tr>
  ),

  th: ({ children }) => (
    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#00FF88]/70">
      {children}
    </th>
  ),

  td: ({ children }) => (
    <td className="px-4 py-3 text-white/50 text-[13px]">{children}</td>
  ),

  hr: () => (
    <hr className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
  ),

  img: ({ src, alt }) => (
    <figure className="my-6">
      <div className="rounded-xl overflow-hidden border border-white/[0.08]">
        <img src={src} alt={alt} className="w-full h-auto" loading="lazy" />
      </div>
      {alt && (
        <figcaption className="mt-2 text-center text-xs text-white/25">{alt}</figcaption>
      )}
    </figure>
  ),
};
