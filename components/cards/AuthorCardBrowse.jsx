export default function AuthorCardBrowse({ author, onOpenModal }) {
  return (
    <article className="card flex h-[304px] flex-col overflow-hidden px-7 py-6 transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-medium)]">
      <button
        onClick={() => onOpenModal?.(author.author, "")}
        className="w-fit text-left"
      >
        <h2 className="text-[28px] leading-[1.15] transition hover:text-[var(--color-accent-strong)]">
          {author.author}
        </h2>
      </button>

      <ul className="scrollbar-thin mt-5 flex-1 space-y-3 overflow-y-auto pr-1">
        {author.works?.map((work, index) => (
          <li key={index}>
            <button
              onClick={() => onOpenModal?.(work, author.author)}
              className="w-full rounded-2xl bg-[var(--color-bg-raised)] px-4 py-3 text-left text-[15px] leading-6 text-[var(--text-body-color)] transition hover:bg-[var(--color-interaction-hover)]"
            >
              {work}
            </button>
          </li>
        ))}
      </ul>
    </article>
  );
}
