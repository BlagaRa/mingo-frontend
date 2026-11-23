"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { appConfig } from "@/config/app";

export type DemoRole = "player" | "owner" | "admin";

type DemoSessionValue = {
  role: DemoRole;
  setRole: (role: DemoRole) => void;
  emailVerified: boolean;
  setEmailVerified: (value: boolean) => void;
};

const DemoSessionContext = createContext<DemoSessionValue | null>(null);

export function DemoSessionProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<DemoRole>(appConfig.demoRole);
  const [emailVerified, setEmailVerified] = useState(false);

  const setRole = useCallback((next: DemoRole) => {
    setRoleState(next);
  }, []);

  const value = useMemo(
    () => ({ role, setRole, emailVerified, setEmailVerified }),
    [role, setRole, emailVerified],
  );

  return (
    <DemoSessionContext.Provider value={value}>
      {children}
    </DemoSessionContext.Provider>
  );
}

export function useDemoSession(): DemoSessionValue {
  const ctx = useContext(DemoSessionContext);
  if (!ctx) {
    throw new Error("useDemoSession must be used within DemoSessionProvider");
  }
  return ctx;
}
