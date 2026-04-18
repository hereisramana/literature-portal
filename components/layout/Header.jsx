import { motion } from 'framer-motion';

export default function Header() {
  return (
    <div className="flex flex-col gap-1">
      <motion.h1
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-bold tracking-tight text-[var(--text-heading-color)] md:text-4xl"
      >
        EnLit
      </motion.h1>
      <p className="text-sm font-medium text-[var(--text-muted-color)] md:text-base">
        Modern Literature Revision
      </p>
    </div>
  );
}
