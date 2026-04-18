export default function Confidence() {
  const levels = ["Weak", "Moderate", "Good", "Excellent"];

  return (
    <div className="fixed bottom-0 left-0 right-0 p-3 bg-[var(--color-bg-raised)] flex justify-around">
      {levels.map((l) => (
        <button
          key={l}
          className="px-3 py-1 text-sm border rounded"
        >
          {l}
        </button>
      ))}
    </div>
  );
}
