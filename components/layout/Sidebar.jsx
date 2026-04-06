export default function Sidebar({ categories, active, setActive }) {
  return (
    <aside className="w-64 hidden md:block p-4 border-r border-[var(--color-border-subtle)]">
      {Object.keys(categories).map((cat) => (
        <div
          key={cat}
          onClick={() => setActive(cat)}
          className={`p-2 cursor-pointer rounded ${
            active === cat ? "bg-[var(--color-bg-raised)]" : ""
          }`}
        >
          {cat}
        </div>
      ))}
    </aside>
  );
}
