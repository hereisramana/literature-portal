"use client";

import AuthorCardBrowse from "./AuthorCardBrowse";
import AuthorCardTest from "./AuthorCardTest";

export default function AuthorCard({ author, mode }) {
  if (mode === "test") {
    return <AuthorCardTest author={author} />;
  }

  return <AuthorCardBrowse author={author} />;
}