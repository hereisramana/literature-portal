import { useState } from "react";

export default function Ordering({ data, onDone }) {
  const [slots, setSlots] = useState(Array(data.length).fill(null));

  const fill = (item) => {
    const idx = slots.indexOf(null);
    if (idx !== -1) {
      const copy = [...slots];
      copy[idx] = item;
      setSlots(copy);
    }

    if (!slots.includes(null)) onDone();
  };

  return (
    <div className="mt-4">
      <div className="grid grid-cols-3 gap-2 mb-3">
        {slots.map((s, i) => (
          <div key={i} className="p-2 bg-[var(--color-bg-inset)] rounded">
            {s || i + 1}
          </div>
        ))}
      </div>

      {data.map((w, i) => (
        <div
          key={i}
          onClick={() => fill(w)}
          className="p-2 cursor-pointer"
        >
          {w}
        </div>
      ))}
    </div>
  );
}
