"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isOwner = pathname.startsWith("/proprietar");

  if (isAdmin || isOwner) {
    return (
      <DashboardShell mode={isAdmin ? "admin" : "owner"}>{children}</DashboardShell>
    );
  }

  return (
    <>
      <SiteHeader />
      <main id="continut" className="w-full flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
