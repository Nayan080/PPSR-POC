import { useEffect, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AccountDto } from "@/api/generated/model";

interface AuthState {
  accessToken: string | null;
  account: AccountDto | null;
  signIn: (accessToken: string, account: AccountDto) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      account: null,
      signIn: (accessToken, account) => set({ accessToken, account }),
      signOut: () => set({ accessToken: null, account: null }),
    }),
    {
      // Session storage: the session ends when the tab closes, like the register's own portal.
      name: "ppsr-auth",
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ accessToken, account }) => ({ accessToken, account }),
    },
  ),
);

/**
 * True once the persisted session has been restored in the browser. Always false during
 * server rendering and the first client render, so both produce the same markup.
 */
export function useAuthHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) setHydrated(true);
    return useAuthStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);
  return hydrated;
}
