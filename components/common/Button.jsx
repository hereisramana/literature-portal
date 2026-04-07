export default function Button({ children, onClick, variant = "primary" }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-full text-sm
        ${
          variant === "primary"
            ? "bg-[var(--color-accent)] text-[var(--text-on-accent)]"
            : "bg-[var(--color-bg-raised)]"
        }
      `}
    >
      {children}
    </button>
  );
}
