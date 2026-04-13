"use client";

import AuthorCardBrowse from "./AuthorCardBrowse.jsx";

export default function AuthorCard({
  author,
  onOpenStudy,
  onStartTest,
  confidence,
  showAwardInsteadOfPeriod,
}) {
  return (
    <AuthorCardBrowse
      author={author}
      onOpenStudy={onOpenStudy}
      onStartTest={onStartTest}
      confidence={confidence}
      showAwardInsteadOfPeriod={showAwardInsteadOfPeriod}
    />
  );
}
