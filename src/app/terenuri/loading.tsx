import { PageShell } from "@/components/layout/page-shell";
import { CardSkeleton, Skeleton } from "@/components/ui/feedback";

export default function TerenuriLoading() {
  return (
    <PageShell title="Terenuri" description="Găsește terenul, rezervă ora.">
      <div className="mb-8 space-y-4">
        <Skeleton label="Se încarcă filtrele" lines={2} />
      </div>
      <CardSkeleton count={6} />
    </PageShell>
  );
}
