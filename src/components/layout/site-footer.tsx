"use client";

import Link from "next/link";
import { useState } from "react";
import { appConfig } from "@/config/app";
import { theme } from "@/config/theme";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

export function SiteFooter() {
  const [cookiesOpen, setCookiesOpen] = useState(false);

  return (
    <footer
      className="mt-auto border-t"
      style={{
        backgroundColor: theme.colors.ivory,
        color: theme.colors.forest,
        borderColor: "color-mix(in srgb, #073035 10%, transparent)",
      }}
    >
      <div className="mx-auto grid w-full max-w-[var(--content-max)] gap-10 px-[var(--page-gutter)] py-14 md:grid-cols-[1.35fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl font-semibold tracking-tight">
            {appConfig.name}
          </p>
          <p className="mt-3 max-w-[30ch] text-sm opacity-75">
            Terenuri de fotbal, rezervări curate — pentru jucători și proprietari.
          </p>
          <Button asChild variant="accent" className="mt-6">
            <Link href="/rezervari/nou">Rezervă acum</Link>
          </Button>
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: theme.colors.coral }}>
            Legal
          </p>
          <ul className="mt-3 space-y-2 text-sm opacity-90">
            <li>
              <Link href="/termeni" className="hover:underline">
                Termeni și condiții
              </Link>
            </li>
            <li>
              <Link href="/confidentialitate" className="hover:underline">
                Politica de confidențialitate
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="hover:underline">
                Politica de cookies
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: theme.colors.coral }}>
            Contact
          </p>
          <ul className="mt-3 space-y-2 text-sm opacity-90">
            <li>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/despre" className="hover:underline">
                Despre
              </Link>
            </li>
            <li>
              <Link href="/preturi" className="hover:underline">
                Planuri proprietari
              </Link>
            </li>
            <li>
              <button
                type="button"
                className="hover:underline"
                onClick={() => setCookiesOpen(true)}
              >
                Setări cookies
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div
        className="px-[var(--page-gutter)] py-4 text-center text-xs opacity-65"
        style={{
          borderTop: "1px solid color-mix(in srgb, #073035 10%, transparent)",
        }}
      >
        © 2026 {appConfig.name}. Demo frontend · poze Unsplash.
      </div>
      <Dialog
        open={cookiesOpen}
        title="Setări cookies"
        description="Demo: alege ce categorii accepți. Nu salvăm nimic pe server."
        confirmLabel="Salvează preferințele"
        cancelLabel="Doar esențiale"
        onClose={() => setCookiesOpen(false)}
        onConfirm={() => setCookiesOpen(false)}
      >
        <ul className="space-y-2 text-sm">
          <li>Esențiale — mereu active</li>
          <li>Analitice — opțional</li>
          <li>Marketing — opțional</li>
        </ul>
        <div className="mt-3">
          <Button variant="ghost" type="button" onClick={() => setCookiesOpen(false)}>
            Închide
          </Button>
        </div>
      </Dialog>
    </footer>
  );
}
