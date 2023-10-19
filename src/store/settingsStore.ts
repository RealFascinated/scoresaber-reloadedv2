"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useSettingsStore = create(
  persist(
    (set: any, get: any) => ({
      userId: null,

      setUserId: (userId: string) => set({ userId: userId }),
    }),
    {
      name: "settings", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
      skipHydration: true,
    },
  ),
);
