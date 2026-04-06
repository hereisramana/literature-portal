import { useState } from "react";

export default function SelectWorks({ data, onDone }) {
  const [selected, setSelected] = useState([]);

  const toggle = (w) => {
    setSelected((prev) =>
      prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w]
    );
  };

  return (
    <div className="space-y-2 mt-4">
      {data.map((w, i) => (
        <div
          key={i}
          onClick={() => toggle(w)}
          className={`p-2 rounded cursor-pointer ${
            selected.includes(w)
              ? "bg-[var(--color-accent)] text-white"
              : "bg-[var(--color-bg-inset)]"
          }`}
        >
          {w}
        </div>
      ))}

      <button
        onClick={onDone}
        className="mt-3 px-3 py-1 bg-[var(--color-accent)] text-white rounded"
      >
        Done
      </button>
    </div>
  );
}