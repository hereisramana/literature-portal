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
  const [bookmarks, setBookmarks] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const fetchWiki = async (title, author) => {
    setLoading(true);
    try {
      const query = encodeURIComponent(`${title}`);
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${query}`
      );
      const data = await res.json();
      setModalData({ ...data, title, author });
    } catch (e) {
      setModalData({ title, author, extract: "No summary found." });
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-4 overflow-y-auto">

        <input
          placeholder="Search authors..."
          className="border p-2 rounded w-full mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {Object.keys(grouped).map((group) => (
          <div key={group} className="mb-6">
            <h2 className="font-bold mb-2">{group}</h2>

            {grouped[group].map((a, i) => (
              <div key={i} className="p-3 border rounded mb-2">
                <div className="flex justify-between">
                  <span>{a.author}</span>
                  <span className={regionColors[a.region]}>{a.region}</span>
                </div>

                <button
                  onClick={() =>
                    setExpanded((prev) => ({
                      ...prev,
                      [a.author]: !prev[a.author]
                    }))
                  }
                  className="text-xs underline"
                >
                  Toggle Works
                </button>

                {expanded[a.author] && (
                  <ul>
                    {a.works.map((w, idx) => (
                      <li key={idx}>
                        <button
                          className="text-blue-600 underline"
                          onClick={() => fetchWiki(w, a.author)}
                        >
                          {w}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ))}

        {/* Modal */}
        {modalData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded max-w-md">
              <h2 className="font-bold text-lg">
                {modalData.title} — {modalData.author}
              </h2>

              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  {modalData.thumbnail && (
                    <img
                      src={modalData.thumbnail.source}
                      alt=""
                      className="my-2"
                    />
                  )}
                  <p className="text-sm">{modalData.extract}</p>
                </>
              )}

              <button
                className="mt-3 border px-2 py-1"
                onClick={() => setModalData(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
