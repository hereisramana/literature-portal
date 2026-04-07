"use client";

const LEVELS = [
  { id: "weak", label: "Weak" },
  { id: "moderate", label: "Moderate" },
  { id: "good", label: "Good" },
  { id: "excellent", label: "Excellent" },
];

export default function ConfidenceStrip({
  visible,
  currentValue,
  onSelect,
  provider,
  onConnect,
  onDisconnect,
}) {
  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-[var(--divider-color)] bg-[rgba(242,242,240,0.96)] px-4 py-3 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--text-heading-color)]">
            Confidence check
          </p>
          <p className="text-xs text-[var(--text-muted-color)]">
            Save how secure this answer felt so future review can adapt.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => onSelect(level.id)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                currentValue === level.id
                  ? "border-[var(--button-primary-bg)] bg-[var(--button-primary-bg)] text-[var(--button-primary-text)]"
                  : "border-[var(--divider-color)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] hover:bg-[var(--color-interaction-hover)]"
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {provider ? (
            <>
              <span className="rounded-full bg-[var(--color-bg-raised)] px-3 py-1 font-semibold text-[var(--text-muted-color)]">
                {provider} connected
              </span>
              <button
                onClick={onDisconnect}
                className="rounded-full border border-[var(--divider-color)] px-3 py-1.5 font-semibold text-[var(--button-secondary-text)]"
              >
                Disconnect
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onConnect("Google")}
                className="rounded-full border border-[var(--divider-color)] px-3 py-1.5 font-semibold text-[var(--button-secondary-text)]"
              >
                Connect Google
              </button>
              <button
                onClick={() => onConnect("OneDrive")}
                className="rounded-full border border-[var(--divider-color)] px-3 py-1.5 font-semibold text-[var(--button-secondary-text)]"
              >
                Connect OneDrive
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
