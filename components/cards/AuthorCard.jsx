"use client";

import AuthorCardBrowse from "./AuthorCardBrowse.jsx";
import AuthorCardTest from "./AuthorCardTest.jsx";

export default function AuthorCard({ author, mode }) {
  if (mode === "test") {
    return <AuthorCardTest author={author} />;
  }

  return <AuthorCardBrowse author={author} />;
}
