"use client";

import { del, get, set } from "idb-keyval";
import { StateStorage } from "zustand/middleware";

export const IDBStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    //console.log(name, "has been retrieved");
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    //console.log(name, "with value", value, "has been saved");
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    //console.log(name, "has been deleted");
    await del(name);
  },
};
