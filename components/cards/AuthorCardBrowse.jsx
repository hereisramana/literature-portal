export default function AuthorCardBrowse({ author, onOpenModal }) {
  return (
    <article className="card flex aspect-[3/2] min-h-0 flex-col overflow-hidden px-6 py-5 transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-medium)]">
      <button
        onClick={() => onOpenModal?.(author.author, "")}
        className="w-fit text-left"
      >
        <h2 className="text-[24px] leading-[1.15] transition hover:text-[var(--color-accent-strong)] md:text-[26px]">
          {author.author}
        </h2>
      </button>

      <ul className="scrollbar-thin mt-4 flex-1 space-y-2.5 overflow-y-auto pr-1">
        {author.works?.map((work, index) => (
          <li key={index}>
            <button
              onClick={() => onOpenModal?.(work, author.author)}
              className="w-full rounded-2xl bg-[var(--color-bg-raised)] px-4 py-2.5 text-left text-[14px] leading-6 text-[var(--text-body-color)] transition hover:bg-[var(--color-interaction-hover)] md:text-[15px]"
            >
              {work}
            </button>
          </li>
        ))}
      </ul>
    </article>
  );
}
