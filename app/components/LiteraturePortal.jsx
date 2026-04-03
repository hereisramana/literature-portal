"use client";
import { useState, useMemo, useEffect } from "react";

const regionColors = {
  British: "bg-red-700 text-white",
  American: "bg-gray-600 text-white",
  Indian: "bg-sky-500 text-black",
  African: "bg-green-700 text-white",
  Caribbean: "bg-amber-800 text-white",
  European: "bg-purple-700 text-white",
  Australian: "bg-yellow-400 text-black"
};

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function LiteraturePortal({ data }) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [regionFilter, setRegionFilter] = useState("");
  const [periodFilter, setPeriodFilter] = useState("");
  const [theoryFilter, setTheoryFilter] = useState("");
  const [category, setCategory] = useState(Object.keys(data)[0]);
  const [groupAZ, setGroupAZ] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [bookmarks, setBookmarks] = useState(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("litBookmarks");
    return saved ? JSON.parse(saved) : [];
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("litBookmarks", JSON.stringify(bookmarks));
    }
  }, [bookmarks]);

  const authors = data[category] || [];

  const filtered = useMemo(() => {
    return authors.filter((a) => {
      return (
        a.author.toLowerCase().includes(debouncedSearch.toLowerCase()) &&
        (regionFilter ? a.region === regionFilter : true) &&
        (periodFilter ? a.literary_period === periodFilter : true) &&
        (theoryFilter ? a.theory_type === theoryFilter : true)
      );
    });
  }, [authors, debouncedSearch, regionFilter, periodFilter, theoryFilter]);

  const grouped = useMemo(() => {
    if (!groupAZ) return { All: filtered };
    const g = {};
    filtered.forEach((a) => {
      const letter = a.author[0].toUpperCase();
      if (!g[letter]) g[letter] = [];
      g[letter].push(a);
    });
    return g;
  }, [filtered, groupAZ]);

  const toggleBookmark = (author) => {
    setBookmarks((prev) =>
      prev.includes(author)
        ? prev.filter((a) => a !== author)
        : [...prev, author]
    );
  };

  return (
    <div className="flex h-screen">
      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b p-3 flex justify-between items-center md:hidden z-50">
        <button onClick={() => setSidebarOpen(true)} className="text-lg">☰</button>
        <span className="font-semibold">Literature Portal</span>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-gray-900 text-white p-4 overflow-y-auto transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform`}
      >
        <button
          className="md:hidden mb-4"
          onClick={() => setSidebarOpen(false)}
        >
          Close
        </button>

        <h2 className="text-xl mb-4">Categories</h2>
        {Object.keys(data).map((cat) => (
          <div
            key={cat}
            onClick={() => {
              setCategory(cat);
              setSidebarOpen(false);
            }}
            className={`cursor-pointer p-2 rounded ${
              category === cat ? "bg-gray-700" : ""
            }`}
          >
            {cat}
          </div>
        ))}

        <h3 className="mt-6 mb-2">Bookmarks</h3>
        {bookmarks.map((b) => (
          <div key={b} className="text-sm">{b}</div>
        ))}
      </div>

      {/* Main */}
      <div className="flex-1 p-4 md:p-6 mt-12 md:mt-0 overflow-y-auto">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            aria-label="Search authors"
            type="text"
            placeholder="Search authors..."
            className="border p-2 rounded w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex gap-2 overflow-x-auto">
            <select className="border p-2 rounded" onChange={(e) => setRegionFilter(e.target.value)}>
              <option value="">Region</option>
              {Object.keys(regionColors).map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>

            <select className="border p-2 rounded" onChange={(e) => setPeriodFilter(e.target.value)}>
              <option value="">Period</option>
              {[...new Set(authors.map((a) => a.literary_period))].map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>

            <select className="border p-2 rounded" onChange={(e) => setTheoryFilter(e.target.value)}>
              <option value="">Theory</option>
              {[...new Set(authors.map((a) => a.theory_type).filter(Boolean))].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setGroupAZ(!groupAZ)}
            className="border px-3 rounded"
          >
            {groupAZ ? "Ungroup" : "A-Z"}
          </button>
        </div>

        {/* Cards */}
        {Object.keys(grouped).map((group) => (
          <div key={group} className="mb-6">
            <h2 className="text-lg md:text-xl font-bold mb-3">{group}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {grouped[group].map((a, i) => (
                <div key={i} className="p-4 border rounded-xl shadow">
                  <div className="flex justify-between items-center">
                    <a href={a.author_link} target="_blank" className="font-semibold text-sm md:text-base">
                      {a.author}
                    </a>
                    <span className={`text-xs px-2 py-1 rounded ${regionColors[a.region] || "bg-gray-500 text-white"}`}>
                      {a.region}
                    </span>
                  </div>

                  <div className="text-xs md:text-sm text-gray-600">{a.literary_period}</div>

                  <button
                    className="text-xs text-blue-700 mt-2 underline"
                    onClick={() =>
                      setExpanded((prev) => ({
                        ...prev,
                        [a.author]: !prev[a.author]
                      }))
                    }
                  >
                    {expanded[a.author] ? "Hide" : "Show"}
                  </button>

                  {expanded[a.author] && (
                    <ul className="text-xs md:text-sm list-disc ml-4 mt-2">
                      {a.works.map((w, idx) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  )}

                  <button
                    onClick={() => toggleBookmark(a.author)}
                    className="mt-3 text-xs border px-2 py-1 rounded"
                  >
                    {bookmarks.includes(a.author) ? "Saved" : "Save"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
