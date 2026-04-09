## 2025-05-14 - Standardized Modal UX
**Learning:** Custom modals often lack essential accessibility features like Escape key support and backdrop click-to-close, which are expected by users and necessary for WCAG compliance.
**Action:** Always implement a `useEffect` for the 'Escape' key listener, backdrop click-to-close with `e.stopPropagation()` on content, and semantic ARIA roles (`role='dialog'`, `aria-modal='true'`) when building custom modals.
