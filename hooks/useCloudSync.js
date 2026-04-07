import { useEffect, useState } from "react";

const STORAGE_KEY = "lit-cloud-provider";

export function useCloudSync() {
  const [provider, setProvider] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setProvider(localStorage.getItem(STORAGE_KEY) || "");
  }, []);

  const connect = (nextProvider) => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(STORAGE_KEY, nextProvider);
    setProvider(nextProvider);
  };

  const disconnect = () => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
    setProvider("");
  };

  const sync = async (data) => {
    if (!provider) {
      return { ok: false, reason: "not-connected" };
    }

    console.log(`Queued sync for ${provider}`, data);
    return { ok: true };
  };

  return {
    provider,
    connected: Boolean(provider),
    connect,
    disconnect,
    sync,
  };
}
