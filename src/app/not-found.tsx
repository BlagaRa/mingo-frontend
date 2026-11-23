import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/feedback";

export default function NotFound() {
  return (
    <PageShell title="Mingo">
      <ErrorState
        title="Pagina nu există"
        description="Linkul e greșit sau pagina a fost mutată. Întoarce-te la terenuri."
        action={
          <Button asChild variant="accent">
            <Link href="/terenuri">Vezi terenuri</Link>
          </Button>
        }
      />
    </PageShell>
  );
}
