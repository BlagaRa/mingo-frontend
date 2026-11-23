import { PageShell } from "@/components/layout/page-shell";
import { Skeleton } from "@/components/ui/feedback";

export default function RezervareNouaLoading() {
  return (
    <PageShell title="Rezervare nouă" description="Alege terenul, ziua și ora.">
      <Skeleton label="Se încarcă formularul de rezervare" lines={8} />
    </PageShell>
  );
}