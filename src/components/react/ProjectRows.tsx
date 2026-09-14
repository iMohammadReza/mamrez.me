import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import { SharedLayoutBg } from '@/components/motion/shared-layout-bg';
import { cn } from '@/lib/utils';
import {
  REVEAL_DURATION,
  REVEAL_EASE,
  REVEAL_HIDDEN,
  REVEAL_SHOWN,
  REVEAL_STAGGER,
} from '@/lib/motion';

export interface ProjectRow {
  id: string;
  title: string;
  description: string;
  year: number;
  url?: string;
  github?: string;
  badge?: 'New';
  status?: 'Running' | 'Stopped';
}

const INITIAL_COUNT = 6;

export function ProjectRows({ projects }: { projects: ProjectRow[] }) {
  const reduce = useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? projects : projects.slice(0, INITIAL_COUNT);
  const hidden = projects.length - INITIAL_COUNT;

  return (
    <>
      <SharedLayoutBg
        as="div"
        inset={0}
        pillClassName="bg-highlight rounded-2xl"
        className="flex w-full flex-col"
      >
        {visible.map((p, i) => (
          <motion.article
            key={p.id}
            className="group relative"
            initial={reduce ? false : REVEAL_HIDDEN}
            whileInView={REVEAL_SHOWN}
            viewport={{ once: true, margin: '0px 0px -8% 0px' }}
            transition={{
              duration: REVEAL_DURATION,
              ease: REVEAL_EASE,
              delay: Math.min(i, 6) * REVEAL_STAGGER,
            }}
          >
            <div className="grid grid-cols-[1fr_auto] items-center gap-5 px-3 py-4">
              <span className="min-w-0">
                <span className="flex items-center gap-2">
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-block text-sm leading-5 font-[500] tracking-[-0.0064em] transition-opacity duration-200 hover:opacity-70"
                    >
                      {p.title}
                    </a>
                  ) : (
                    <span className="inline-block text-sm leading-5 font-[500] tracking-[-0.0064em]">
                      {p.title}
                    </span>
                  )}
                  {p.badge === 'New' && <NewBadge />}
                  <span className="text-ink-muted inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.06em]">
                    {p.status && <StatusDot status={p.status} />}
                    {p.year}
                  </span>
                </span>
                <span className="text-ink-muted mt-1 block max-w-md text-sm leading-5 font-[460] tracking-[-0.0064em]">
                  {p.description}
                </span>
              </span>
              <span className="flex items-center gap-1 opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
                {p.github && (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`View ${p.title} source on GitHub`}
                    className="text-ink-muted hover:text-ink flex size-9 items-center justify-center rounded-full transition-colors duration-200"
                  >
                    <GitHubGlyph />
                  </a>
                )}
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`Open ${p.title}`}
                    className="text-ink-muted hover:text-ink flex size-9 items-center justify-center rounded-full transition-colors duration-200"
                  >
                    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none">
                      <path
                        d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.3"
                      />
                    </svg>
                  </a>
                )}
              </span>
            </div>
          </motion.article>
        ))}
      </SharedLayoutBg>
      {hidden > 0 && (
        <AnimatePresence initial={false}>
          {!expanded && (
            <motion.div
              key="more"
              className="px-3 pt-3"
              exit={{ opacity: 0, height: 0, paddingTop: 0 }}
              transition={{ duration: 0.25 }}
            >
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="text-ink-muted hover:text-ink border-highlight-line hover:bg-highlight inline-flex h-8 cursor-pointer items-center gap-2 rounded-full border px-3 text-xs font-medium transition-colors duration-200"
              >
                Show {hidden} older projects
                <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5" fill="none">
                  <path
                    d="M4 6.5 8 10.5l4-4"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.3"
                  />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}

/** Live/stopped indicator: a pulsing green dot for running projects, a hollow ring for retired ones. */
function StatusDot({ status }: { status: NonNullable<ProjectRow['status']> }) {
  const running = status === 'Running';
  return (
    <span
      title={status}
      className="relative inline-flex size-1.5 shrink-0 items-center justify-center"
    >
      {running && (
        <span
          aria-hidden="true"
          className="bg-new-mark absolute inset-0 rounded-full opacity-60 motion-safe:animate-ping motion-safe:[animation-duration:2.4s]"
        />
      )}
      <span
        aria-hidden="true"
        className={cn(
          'relative size-full rounded-full',
          running ? 'bg-new-mark' : 'border-ink-muted/60 border'
        )}
      />
      <span className="sr-only">{status}</span>
    </span>
  );
}

/** Hand-drawn "New" mark: Caveat text with two loosely traced ellipses. */
function NewBadge() {
  const reduce = useReducedMotion();
  const draw = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          whileInView: { pathLength: 1, opacity: 1 },
          viewport: { once: true },
          transition: { duration: 0.9, ease: REVEAL_EASE, delay },
        };
  return (
    <span className="font-hand text-new-mark relative inline-flex h-6 items-center justify-center px-2 text-base leading-none">
      <span className="relative z-10">New</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 46 25"
        className="text-new-mark absolute inset-0 size-full overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          d="M3.2 12.8C4.4 4.5 13.3 1.8 24.8 2.2c11.4.4 19 5.1 18.2 11.5-.9 6.3-11.8 8.8-22.6 8.3C9.2 21.5 2.3 18.3 3.2 12.8Z"
          strokeWidth="1.3"
          {...draw(0.4)}
        />
        <motion.path
          d="M2.2 13.7C2.8 6 12.5 2.5 24.2 2.9c12 .4 20.4 4.5 19.6 10.7-.7 6.1-10.8 9.3-22.5 8.7C9.8 21.8 1.8 18.7 2.2 13.7Z"
          strokeWidth="0.75"
          {...draw(0.7)}
        />
      </svg>
    </span>
  );
}

function GitHubGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none">
      <path
        d="M12 3.3a8.8 8.8 0 0 0-2.78 17.15c.44.08.6-.19.6-.42v-1.7c-2.46.53-2.98-1.04-2.98-1.04-.4-1.02-.98-1.3-.98-1.3-.8-.55.06-.54.06-.54.89.06 1.35.91 1.35.91.79 1.35 2.06.96 2.57.74.08-.57.31-.96.56-1.18-1.96-.22-4.03-.98-4.03-4.36 0-.96.35-1.75.91-2.37-.09-.22-.39-1.12.09-2.33 0 0 .74-.24 2.42.9A8.4 8.4 0 0 1 12 7.47a8.4 8.4 0 0 1 2.2.3c1.68-1.14 2.42-.9 2.42-.9.48 1.21.18 2.11.09 2.33.57.62.91 1.41.91 2.37 0 3.39-2.07 4.13-4.04 4.35.32.28.6.81.6 1.64v2.37c0 .23.16.5.61.42A8.8 8.8 0 0 0 12 3.3Z"
        fill="currentColor"
      />
    </svg>
  );
}
