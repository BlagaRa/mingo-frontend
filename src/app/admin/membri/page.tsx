"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CrmPagination } from "@/components/crm/crm-pagination";
import { CrmToolbar } from "@/components/crm/crm-toolbar";
import { DataTable } from "@/components/crm/data-table";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { theme } from "@/config/theme";
import { filterUsers } from "@/lib/mock/crm-queries";
import { paginate } from "@/lib/mock/paginate";
import { users as seedUsers } from "@/lib/mock/queries";
import type { User, UserRole } from "@/lib/mock/types";

const roleLabel: Record<UserRole, string> = {
  player: "Jucător",
  owner: "Proprietar",
  admin: "Admin",
};

const statusLabel = {
  active: "Activ",
  suspended: "Suspendat",
} as const;

function AdminMembriClient() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? undefined;
  const role = searchParams.get("role") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const page = searchParams.get("page") ?? undefined;

  const [rows, setRows] = useState<User[]>(seedUsers);
  const [target, setTarget] = useState<User | null>(null);

  const filtered = useMemo(
    () => filterUsers(rows, { q, role, status }),
    [rows, q, role, status],
  );
  const result = paginate(filtered, page);

  const filters = { q, role, status };

  return (
    <PageShell
      title="Membri"
      description="Caută, filtrează și gestionează conturile din platformă."
    >
      <CrmToolbar
        resultCount={result.total}
        searchDefault={q ?? ""}
        action="/admin/membri"
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="opacity-70">Rol</span>
          <select
            name="role"
            defaultValue={role ?? ""}
            className="rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-ivory)_16%,transparent)] bg-transparent px-3 py-2"
          >
            <option value="">Toate</option>
            <option value="player">{roleLabel.player}</option>
            <option value="owner">{roleLabel.owner}</option>
            <option value="admin">{roleLabel.admin}</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="opacity-70">Status</span>
          <select
            name="status"
            defaultValue={status ?? ""}
            className="rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-ivory)_16%,transparent)] bg-transparent px-3 py-2"
          >
            <option value="">Toate</option>
            <option value="active">{statusLabel.active}</option>
            <option value="suspended">{statusLabel.suspended}</option>
          </select>
        </label>
      </CrmToolbar>

      <DataTable
        columns={["Nume", "Email", "Rol", "Status", "Acțiuni"]}
        empty={
          <EmptyState
            title="Niciun membru pe filtrele astea"
            description="Schimbă căutarea sau resetează filtrele."
          />
        }
      >
        {result.items.length === 0
          ? null
          : result.items.map((user) => (
              <tr
                key={user.id}
                className="border-t border-[color-mix(in_srgb,var(--color-ivory)_10%,transparent)]"
              >
                <td data-label="Nume" className="px-4 py-3 font-medium">
                  {user.name}
                </td>
                <td data-label="Email" className="px-4 py-3">
                  {user.email}
                </td>
                <td data-label="Rol" className="px-4 py-3">
                  {roleLabel[user.role]}
                </td>
                <td data-label="Status" className="px-4 py-3">
                  <span
                    className="rounded-full px-2 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor:
                        user.status === "suspended"
                          ? theme.colors.coralSoft
                          : theme.colors.surfaceMuted,
                      color: theme.colors.ivory,
                    }}
                  >
                    {statusLabel[user.status ?? "active"]}
                  </span>
                </td>
                <td data-label="" className="px-4 py-3">
                  <Button variant="ghost" onClick={() => setTarget(user)}>
                    Gestionează
                  </Button>
                </td>
              </tr>
            ))}
      </DataTable>

      <CrmPagination
        basePath="/admin/membri"
        page={result.page}
        totalPages={result.totalPages}
        filters={filters}
      />

      <Dialog
        open={Boolean(target)}
        title={target ? `Gestionează ${target.name}` : "Membru"}
        description="Demo: poți suspenda sau reactiva contul."
        confirmLabel={
          target?.status === "suspended" ? "Reactivează" : "Suspendă"
        }
        tone="danger"
        onClose={() => setTarget(null)}
        onConfirm={() => {
          if (!target) return;
          setRows((current) =>
            current.map((row) =>
              row.id === target.id
                ? {
                    ...row,
                    status:
                      row.status === "suspended" ? "active" : "suspended",
                  }
                : row,
            ),
          );
          setTarget(null);
        }}
      />
    </PageShell>
  );
}

export default function AdminMembriPage() {
  return (
    <Suspense fallback={<Skeleton label="Se încarcă membrii" lines={6} />}>
      <AdminMembriClient />
    </Suspense>
  );
}
