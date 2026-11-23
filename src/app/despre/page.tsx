import { PageShell } from "@/components/layout/page-shell";
import { appConfig } from "@/config/app";

export default function DesprePage() {
  return (
    <PageShell
      title={`Despre ${appConfig.name}`}
      description="Frontend demo: rezervări pe terenuri, fără backend încă."
    >
      <div className="max-w-[65ch] space-y-4 text-[var(--type-body)]">
        <p>
          {appConfig.name} leagă proprietarii de terenuri de jucătorii care vor
          un loc și o oră fără mesaje risipite. Poți avea unul sau mai multe
          terenuri pe aceeași zonă, preț pe oră pentru tot terenul, și rezervări pe care
          alții le pot completa.
        </p>
        <p>
          Confirmarea se face printr-un cod din email — fără telefon în această
          fază. Pagina de admin există pentru gestiunea utilizatorilor, terenurilor
          și rezervărilor.
        </p>
      </div>
    </PageShell>
  );
}
