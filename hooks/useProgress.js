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

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function useProgress() {
  const [db, setDb] = useState(null);

  useEffect(() => {
    openDB().then(setDb);
  }, []);

  const save = async (key, value) => {
    if (!db) return;
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(value, key);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  };

  const get = async (key) => {
    if (!db) return null;
    const tx = db.transaction(STORE, "readonly");
    return requestToPromise(tx.objectStore(STORE).get(key));
  };

  const batchGet = async (keys) => {
    if (!db || !keys.length) return {};
    const tx = db.transaction(STORE, "readonly");
    const store = tx.objectStore(STORE);
    
    const results = {};
    await Promise.all(
      keys.map(async (key) => {
        results[key] = await requestToPromise(store.get(key));
      })
    );
    return results;
  };

  return { save, get, batchGet, ready: Boolean(db) };
}
