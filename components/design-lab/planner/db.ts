/**
 * IndexedDB for the photo planner: library images (as Blobs) and one saved
 * project per pair. Everything stays in this browser; nothing is uploaded.
 * Every call fails soft (private windows, blocked storage): the planner keeps
 * working, it just can't remember.
 */

const DB_NAME = "iasmi-photo-planner";
const DB_VERSION = 1;

export interface StoredAsset {
  id: string;
  name: string;
  width: number;
  height: number;
  blob: Blob;
  addedAt: number;
}

let dbPromise: Promise<IDBDatabase> | null = null;

function open(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === "undefined") return reject(new Error("no IndexedDB"));
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("assets")) db.createObjectStore("assets", { keyPath: "id" });
      if (!db.objectStoreNames.contains("projects")) db.createObjectStore("projects", { keyPath: "pairId" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  dbPromise.catch(() => {
    dbPromise = null;
  });
  return dbPromise;
}

function run<T>(store: "assets" | "projects", mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return open().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(store, mode);
        const req = fn(tx.objectStore(store));
        tx.oncomplete = () => resolve(req.result);
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      }),
  );
}

export const idb = {
  putAsset: (a: StoredAsset) => run("assets", "readwrite", (s) => s.put(a)),
  deleteAsset: (id: string) => run("assets", "readwrite", (s) => s.delete(id)),
  allAssets: () => run<StoredAsset[]>("assets", "readonly", (s) => s.getAll()),
  putProject: <T extends { pairId: string }>(p: T) => run("projects", "readwrite", (s) => s.put(p)),
  getProject: <T>(pairId: string) => run<T | undefined>("projects", "readonly", (s) => s.get(pairId)),
};

/** Ask the browser not to evict our storage (mobile Safari is eager). Silent. */
export function askPersistentStorage() {
  try {
    void navigator.storage?.persist?.();
  } catch {
    // not supported — fine
  }
}
