import { useEffect, useState } from "react";

const DB_NAME = "lit-progress";
const STORE = "progress";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);

    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE);
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = reject;
  });
}

export function useProgress() {
  const [db, setDb] = useState(null);

  useEffect(() => {
    openDB().then(setDb);
  }, []);

  const save = async (key, value) => {
    if (!db) return;
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(value, key);
  };

  const get = async (key) => {
    if (!db) return null;
    const tx = db.transaction(STORE, "readonly");
    return tx.objectStore(STORE).get(key);
  };

  return { save, get };
}
