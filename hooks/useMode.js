import { useState } from "react";

export function useMode() {
  const [mode, setMode] = useState("study");
  return { mode, setMode };
}
