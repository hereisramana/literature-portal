"use client";

import AuthorCardBrowse from "./AuthorCardBrowse.jsx";
import AuthorCardTest from "./AuthorCardTest.jsx";

export default function AuthorCard({
  author,
  mode,
  onOpenModal,
  onStartTest,
  confidence,
}) {
  if (mode === "test") {
    return (
      <AuthorCardTest
        author={author}
        onStartTest={onStartTest}
        confidence={confidence}
      />
    );
  }

  return <AuthorCardBrowse author={author} onOpenModal={onOpenModal} />;
}
