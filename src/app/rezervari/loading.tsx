import { PageShell } from "@/components/layout/page-shell";
import { TableSkeleton } from "@/components/ui/feedback";

export default function RezervariLoading() {
  return (
    <PageShell title="Rezervările mele" description="Gestionează rezervările din tabel.">
      <TableSkeleton rows={5} />
    </PageShell>
  );
}