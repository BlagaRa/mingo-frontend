import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { appConfig } from "@/config/app";
import { theme } from "@/config/theme";
import { SiteChrome } from "@/components/layout/site-chrome";
import { DemoSessionProvider } from "@/lib/demo-session";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: appConfig.name,
    template: `%s · ${appConfig.name}`,
  },
  description:
    "Rezervă și gestionează terenuri de fotbal — pentru jucători și proprietari.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ro"
      className={`${display.variable} ${body.variable} h-full antialiased`}
      style={
        {
          "--color-ivory": theme.colors.ivory,
          "--color-forest": theme.colors.forest,
          "--color-forest-fill": theme.colors.forestFill,
          "--color-coral": theme.colors.coral,
          "--color-ink": theme.colors.ink,
          "--color-on-forest": theme.colors.onForest,
          "--color-on-coral": theme.colors.onCoral,
          "--color-surface-muted": theme.colors.surfaceMuted,
          "--color-coral-soft": theme.colors.coralSoft,
          "--radius-sm": theme.radii.sm,
          "--radius-md": theme.radii.md,
          "--type-body": theme.type.body,
          "--type-small": theme.type.small,
          "--type-h1": theme.type.h1,
          "--type-h2": theme.type.h2,
          "--type-h3": theme.type.h3,
          "--motion-press-ms": `${theme.motion.pressMs}ms`,
          "--ease-out": theme.motion.easeOut,
          "--min-viewport": `${theme.minViewportPx}px`,
        } as CSSProperties
      }
    >
      <body className="flex min-h-full flex-col bg-[var(--color-forest)] font-[family-name:var(--font-body)] text-[var(--color-ink)]">
        <DemoSessionProvider>
          <a
            href="#continut"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[var(--radius-sm)] focus:bg-[var(--color-coral)] focus:px-3 focus:py-2 focus:text-[var(--color-on-coral)]"
          >
            Sari la conținut
          </a>
          <SiteChrome>{children}</SiteChrome>
        </DemoSessionProvider>
      </body>
    </html>
  );
}
