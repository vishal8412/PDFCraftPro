import { openDB } from "idb";

let dbPromise: Promise<any> | null = null;

function initDb() {
  if (typeof window === "undefined") return null; // prevent SSR crash
  if (!dbPromise) {
    dbPromise = openDB("pdf-editor", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("pdfs")) {
          db.createObjectStore("pdfs");
        }
      },
    });
  }
  return dbPromise;
}

export async function savePDF(key: string, data: Blob) {
  const db = initDb();
  if (!db) return;
  (await db).put("pdfs", data, key);
}

export async function getPDF(key: string) {
  const db = initDb();
  if (!db) return null;
  return (await db).get("pdfs", key);
}
