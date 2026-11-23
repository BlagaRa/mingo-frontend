import type { ReactNode } from "react";
import { PageShell } from "@/components/layout/page-shell";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <PageShell title={title} description="Text demo pentru UI — nu e consiliere juridică.">
      <div className="prose-mingo max-w-[65ch] space-y-4 text-[var(--type-body)] leading-relaxed">
        {children}
      </div>
    </PageShell>
  );
}
