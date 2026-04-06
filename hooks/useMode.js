import { useState } from "react";

export function useMode() {
  const [mode, setMode] = useState("browse");
  return { mode, setMode };
}
