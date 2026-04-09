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

  // NEW: modal state
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("litBookmarks", JSON.stringify(bookmarks));
    }
  }, [bookmarks]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setModal(null);
    };
    if (modal) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [modal]);

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

  // NEW: wiki fetch (safe + fallback)
  const openModal = async (title, author) => {
    setModal({ title, author, summary: "" });
    setLoading(true);

    try {
      const query = encodeURIComponent(title);
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${query}`);
      const data = await res.json();

      setModal({
        title,
        author,
        summary: data.extract || "No summary available."
      });
    } catch {
      setModal({ title, author, summary: "No summary available." });
    }

    setLoading(false);
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
        <button className="md:hidden mb-4" onClick={() => setSidebarOpen(false)}>
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
            className={`cursor-pointer p-2 rounded ${category === cat ? "bg-gray-700" : ""}`}
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

          <button onClick={() => setGroupAZ(!groupAZ)} className="border px-3 rounded">
            {groupAZ ? "Ungroup" : "A-Z"}
          </button>
        </div>

        {/* Cards */}
        {Object.keys(grouped).map((group) => (
          <div key={group} className="mb-6">
            <h2 className="text-lg md:text-xl font-bold mb-3">{group}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {grouped[group].map((a, i) => (
                <div key={i} className="p-5 border rounded-xl shadow hover:shadow-lg transition">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <a href={a.author_link} target="_blank" className="font-semibold text-sm md:text-base">
                        {a.author}
                      </a>
                      <button
                        onClick={() => openModal(a.author, "")}
                        className="text-xs text-blue-600 underline"
                      >
                        info
                      </button>
                    </div>

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
                        <li key={idx}>
                          <span>{w}</span>
                          <button
                            onClick={() => openModal(w, a.author)}
                            className="ml-2 text-xs text-blue-600 underline"
                          >
                            info
                          </button>
                        </li>
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

      {/* Modal */}
      {modal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-bold text-lg mb-2">
              {modal.title} {modal.author && `— ${modal.author}`}
            </h2>

            {loading ? (
              <p className="text-sm">Loading...</p>
            ) : (
              <p className="text-sm mb-4">{modal.summary}</p>
            )}

            <div className="flex flex-col gap-2 text-sm">
              <a href={`https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(modal.title)}`} target="_blank" className="underline text-blue-700">Wikipedia</a>
              <a href={`https://www.britannica.com/search?query=${encodeURIComponent(modal.title)}`} target="_blank" className="underline text-blue-700">Britannica</a>
              <a href={`https://www.poetryfoundation.org/search?query=${encodeURIComponent(modal.title)}`} target="_blank" className="underline text-blue-700">Poetry Foundation</a>
              <a href={`https://www.google.com/search?q=${encodeURIComponent(modal.title)}`} target="_blank" className="underline text-blue-700">Google</a>
            </div>

            <button
              onClick={() => setModal(null)}
              className="mt-4 border px-3 py-1 rounded hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
