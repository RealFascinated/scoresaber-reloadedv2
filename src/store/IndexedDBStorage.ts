"use client";

import { createStore, del, get, set, UseStore } from "idb-keyval";
import { StateStorage } from "zustand/middleware";

let storage: UseStore | undefined = undefined;
if (typeof window !== "undefined") {
  storage = createStore("scoresaber-reloaded", "scoresaber");
}

export const IDBStorage: StateStorage = {
  /**
   * Fetch an item from the storage
   *
   * @param name name of the item to be fetched
   * @returns the value of the item or null if it doesn't exist
   */
  getItem: async (name: string): Promise<string | null> => {
    //console.log(name, "has been retrieved");

    return (await get(name, storage)) || null;
  },

  /**
   * Save an item to the storage
   *
   * @param name name of the item to be saved
   * @param value value of the item to be saved
   */
  setItem: async (name: string, value: string): Promise<void> => {
    //console.log(name, "with value", value, "has been saved");
    await set(name, value, storage);
  },

  /**
   * Delete an item from the storage
   *
   * @param name name of the item to be deleted
   */
  removeItem: async (name: string): Promise<void> => {
    //console.log(name, "has been deleted");
    await del(name, storage);
  },
};
