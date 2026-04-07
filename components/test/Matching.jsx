import { useState } from "react";

export default function Matching({ data, onDone }) {
  const [selected, setSelected] = useState(null);
  const [pairs, setPairs] = useState({});

  const handleTap = (item) => {
    if (!selected) {
      setSelected(item);
    } else {
      setPairs({ ...pairs, [selected]: item });
      setSelected(null);

      if (Object.keys(pairs).length + 1 === data.length) {
        onDone();
      }
    }
  };

  return (
    <div className="mt-4 space-y-2">
      {data.map((w, i) => (
        <div
          key={i}
          onClick={() => handleTap(w)}
          className="p-2 rounded bg-[var(--color-bg-inset)] cursor-pointer"
        >
          {w}
        </div>
      ))}
    </div>
  );
}
