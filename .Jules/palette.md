## 2024-04-08 - [Modal Accessibility and Interactions]
**Learning:** Standard interactive patterns like "Escape to close" and "backdrop click to close" are essential for a polished UX. Additionally, descriptive ARIA labels on buttons that only use generic text (like "info") or icons provide necessary context for screen reader users. Redundant ARIA labels (e.g., adding `aria-label="Close modal"` to a button that already says "Close") should be avoided to prevent screen reader noise.
**Action:** Always implement keyboard listeners and backdrop clicks for modals. Use descriptive ARIA labels for buttons lacking specific context, but ensure they don't redundantly repeat visible text.

## 2024-04-08 - [Parchment/Academic Theme Design]
**Learning:** Using a soft off-white (#F2EDE4) for the main background instead of pure white creates a sophisticated, "academic" feel that reduces eye strain. Pairing this with pure white cards (#FFFFFF) creates a subtle but effective visual hierarchy where the cards appear to "float" or stand out, resolving the issue of a "flat" or "desert-like" interface.
**Action:** Use the 'lit' color palette (dark: #1C2621, bg: #F2EDE4) to establish a premium brand identity while ensuring high contrast for accessibility.
