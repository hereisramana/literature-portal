"use client";

import raw from "../data/data.json";
import { structureData } from "../utils/structureData.js";
import { useState } from "react";

import Sidebar from "../components/layout/Sidebar.jsx";
import AuthorCard from "../components/cards/AuthorCard.jsx";
import ModeToggle from "../components/layout/ModeToggle.jsx";

export default function Page() {
  const data = structureData(raw);
  const [category, setCategory] = useState(Object.keys(data)[0]);
  const [mode, setMode] = useState("browse");

  return (
    <div className="flex h-screen">
      <Sidebar
        categories={data}
        active={category}
        setActive={setCategory}
      />

      <main className="flex-1 p-4 overflow-y-auto">
        <div className="flex justify-between mb-6">
          <h1>English Literature Revision Guide</h1>
          <ModeToggle mode={mode} setMode={setMode} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data[category].map((a, i) => (
            <AuthorCard key={i} author={a} mode={mode} />
          ))}
        </div>
      </main>
    </div>
  );
}
