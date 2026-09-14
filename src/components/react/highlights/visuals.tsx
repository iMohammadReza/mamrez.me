import { motion, useReducedMotion } from 'motion/react';
import type { HighlightVisual as VisualKind } from '@/lib/site';
import { REVEAL_EASE } from '@/lib/motion';

/**
 * Small hand-built "mini UI" compositions shown inside each highlight card and
 * again (via the shared layoutId) at the top of the project modal.
 */
export function HighlightVisual({ kind }: { kind: VisualKind }) {
  switch (kind) {
    case 'chat':
      return <ChatVisual />;
    case 'studio':
      return <StudioVisual />;
    case 'table':
      return <TableVisual />;
    case 'digest':
      return <DigestVisual />;
    case 'calendar':
      return <CalendarVisual />;
    case 'drawing':
      return <DrawingVisual />;
  }
}

const frame =
  'border-highlight-line bg-highlight-strong w-full max-w-[17rem] overflow-hidden rounded-[1rem] border';
const label = 'font-mono text-[8px] text-highlight-muted uppercase tracking-[0.14em]';

function useEnter(delay = 0) {
  const reduce = useReducedMotion();
  return reduce
    ? {}
    : {
        initial: { opacity: 0, y: 6 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '0px 0px -10% 0px' },
        transition: { duration: 0.6, ease: REVEAL_EASE, delay },
      };
}

/* Formula AI — a spreadsheet with a formula bar and rows filling in. */
function TableVisual() {
  const reduce = useReducedMotion();
  const rows = [
    ['Acme Inc.', 'Seed', 'Yes'],
    ['Northwind', 'Series A', 'No'],
    ['Globex', 'Series B', 'Yes'],
    ['Initech', 'Seed', 'No'],
  ];
  return (
    <motion.div className={frame} {...useEnter()}>
      <div className="border-highlight-line flex h-10 items-center justify-between border-b px-4">
        <span className={label}>Table / Formula AI</span>
        <span className="bg-highlight-ink size-1.5 rounded-full" />
      </div>
      <div className="border-highlight-line bg-highlight-panel/60 flex items-center gap-2 border-b px-3 py-2">
        <span className="text-highlight-ink font-mono text-[9px]">fx</span>
        <span className="text-highlight-ink/80 truncate font-mono text-[8px]">
          =AI("is {'{'}Stage{'}'} an early round?")
        </span>
      </div>
      <div className="grid grid-cols-[1fr_0.8fr_0.5fr] px-3 pt-2 pb-3">
        {['Company', 'Stage', 'Early?'].map((h) => (
          <span key={h} className={`${label} pb-1.5`}>
            {h}
          </span>
        ))}
        {rows.map((r, i) =>
          r.map((c, j) => (
            <motion.span
              key={`${i}-${j}`}
              className={`border-highlight-line truncate border-t py-1.5 pr-2 font-mono text-[8px] ${
                j === 2 ? 'text-highlight-ink' : 'text-highlight-muted'
              }`}
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 + i * 0.12 + j * 0.03, duration: 0.4 }}
            >
              {j === 2 ? (
                <span className="bg-highlight-panel text-highlight-ink rounded-sm px-1 py-px">
                  {c}
                </span>
              ) : (
                c
              )}
            </motion.span>
          ))
        )}
      </div>
    </motion.div>
  );
}

/* Houshang — a creation studio: medium tabs, a prompt, and a generation filling in. */
function StudioVisual() {
  const reduce = useReducedMotion();
  const media = ['Music', 'Text', 'Video', 'Photo'];
  const active = 3;
  return (
    <motion.div className={frame} {...useEnter()}>
      <div className="border-highlight-line flex h-10 items-center justify-between border-b px-4">
        <span className={label}>Houshang / Studio</span>
        <span className="text-highlight-muted font-mono text-[8px]">flux · 1.1</span>
      </div>
      <div className="border-highlight-line flex gap-1 border-b px-3 py-2">
        {media.map((m, i) => (
          <motion.span
            key={m}
            className={`rounded-full px-2 py-0.5 font-mono text-[8px] ${
              i === active
                ? 'bg-highlight-ink text-highlight-strong'
                : 'text-highlight-muted bg-highlight-panel/70'
            }`}
            initial={reduce ? false : { opacity: 0, y: 4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.06, duration: 0.4, ease: REVEAL_EASE }}
          >
            {m}
          </motion.span>
        ))}
      </div>
      <div className="px-3 pt-3 pb-3">
        <div className="bg-highlight-panel/60 rounded-md px-2.5 py-2 font-mono text-[8px]">
          <span className="text-highlight-muted">› </span>
          <span className="text-highlight-ink">a lighthouse at dawn, film grain</span>
        </div>
        <div className="mt-2 grid grid-cols-4 gap-1">
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              className="bg-highlight-ink/85 aspect-square rounded-[4px]"
              style={{ opacity: 0.35 + i * 0.16 }}
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 0.35 + i * 0.16, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45 + i * 0.12, duration: 0.45, ease: REVEAL_EASE }}
            />
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className={label}>Generating</span>
          <span className="bg-highlight-panel relative h-1 w-24 overflow-hidden rounded-full">
            <motion.span
              className="bg-highlight-ink absolute inset-y-0 left-0 rounded-full"
              initial={reduce ? { width: '72%' } : { width: '8%' }}
              whileInView={{ width: '72%' }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 1.2, ease: REVEAL_EASE }}
            />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* Morning Brew — a morning briefing with summarised headlines. */
function DigestVisual() {
  const reduce = useReducedMotion();
  const items = [
    { src: 'Verge', w: 'w-[88%]' },
    { src: 'HN', w: 'w-[72%]' },
    { src: 'Ars', w: 'w-[80%]' },
  ];
  return (
    <motion.div className={frame} {...useEnter()}>
      <div className="border-highlight-line flex h-10 items-center justify-between border-b px-4">
        <span className={label}>Morning Brew / 07:00</span>
        <span className="text-highlight-muted font-mono text-[8px]">3 stories</span>
      </div>
      <div className="px-4 pt-4 pb-4">
        <p className="text-highlight-ink text-[1.1rem] leading-[1.15] font-medium tracking-[-0.03em]">
          Good morning.
          <br />
          Here is what changed.
        </p>
        <div className="mt-3 flex flex-col gap-2">
          {items.map((it, i) => (
            <motion.div
              key={it.src}
              className="flex items-center gap-2"
              initial={reduce ? false : { opacity: 0, x: -4 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.14, duration: 0.45, ease: REVEAL_EASE }}
            >
              <span className={`${label} w-9 shrink-0`}>{it.src}</span>
              <span className="flex flex-1 flex-col gap-1">
                <span className={`bg-highlight-ink/80 h-1.5 rounded-full ${it.w}`} />
                <span className="bg-highlight-panel h-1 w-[55%] rounded-full" />
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* Baje — a week booking grid. */
function CalendarVisual() {
  const reduce = useReducedMotion();
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const slots: Array<[number, number, number]> = [
    [1, 1, 2],
    [2, 0, 1],
    [3, 2, 2],
    [4, 1, 1],
    [5, 3, 2],
    [6, 0, 3],
  ];
  return (
    <motion.div className={frame} {...useEnter()}>
      <div className="border-highlight-line flex h-10 items-center justify-between border-b px-4">
        <span className={label}>Corazon Gym / Week</span>
        <span className="text-highlight-muted font-mono text-[8px]">12 / 18</span>
      </div>
      <div className="px-3 pt-3 pb-3">
        <div className="grid grid-cols-7 gap-1">
          {days.map((d, i) => (
            <span key={i} className={`${label} text-center`}>
              {d}
            </span>
          ))}
        </div>
        <div className="relative mt-2 grid h-[76px] grid-cols-7 gap-1">
          {days.map((_, i) => (
            <span key={i} className="bg-highlight-panel/70 rounded-md" />
          ))}
          {slots.map(([col, row, span], i) => (
            <motion.span
              key={i}
              className="bg-highlight-ink/85 absolute rounded-[3px]"
              style={{
                left: `calc(${col} * (100% + 4px) / 7)`,
                width: 'calc((100% - 24px) / 7)',
                top: row * 18 + 4,
                height: span * 18 - 4,
              }}
              initial={reduce ? false : { opacity: 0, scaleY: 0.6 }}
              whileInView={{ opacity: 1, scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 + i * 0.07, duration: 0.45, ease: REVEAL_EASE }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* Bita — a chat thread with an agent acting on a message. */
function ChatVisual() {
  const reduce = useReducedMotion();
  const bubbles = [
    { me: true, text: 'remind me to call Sara at 5' },
    { me: false, text: 'Reminder set · today 17:00' },
    { me: true, text: 'and plan my week' },
  ];
  return (
    <motion.div className={frame} {...useEnter()}>
      <div className="border-highlight-line flex h-10 items-center justify-between border-b px-4">
        <span className={label}>Bita / Telegram</span>
        <span className="bg-new-mark size-1.5 rounded-full" />
      </div>
      <div className="flex flex-col gap-1.5 px-3 pt-3 pb-3">
        {bubbles.map((b, i) => (
          <motion.span
            key={i}
            className={`max-w-[80%] rounded-[9px] px-2.5 py-1.5 font-mono text-[8px] ${
              b.me
                ? 'bg-highlight-ink text-highlight-strong self-end rounded-br-[3px]'
                : 'bg-highlight-panel text-highlight-ink self-start rounded-bl-[3px]'
            }`}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 + i * 0.18, duration: 0.45, ease: REVEAL_EASE }}
          >
            {b.text}
          </motion.span>
        ))}
        <motion.span
          className="bg-highlight-panel flex gap-0.5 self-start rounded-[9px] rounded-bl-[3px] px-2.5 py-2"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.85, duration: 0.4 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="bg-highlight-muted size-1 rounded-full"
              animate={reduce ? undefined : { opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.span>
      </div>
    </motion.div>
  );
}

/* Dino AI — a crayon drawing on the left is traced in, then comes alive on the right. */
const DINO_PATH =
  'M9 41c4-5 9-8 15-8 2-8 12-11 20-7 3-7 6-14 11-18 3-2 8-1 8 3 0 3-4 4-6 7-3 5-4 11-6 17-2 6-8 9-15 10v6h-4v-6h-6v6h-4v-6c-5 0-10-2-13-5Z';

function DrawingVisual() {
  const reduce = useReducedMotion();
  return (
    <motion.div className={frame} {...useEnter()}>
      <div className="border-highlight-line flex h-10 items-center justify-between border-b px-4">
        <span className={label}>Dino AI / Canvas</span>
        <span className="text-highlight-muted font-mono text-[8px]">story · 1</span>
      </div>
      <div className="px-3 pt-3 pb-3">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          {/* The kid's drawing: a wobbly stroke that traces itself in. */}
          <div className="bg-highlight-panel/60 relative aspect-[4/3] overflow-hidden rounded-md">
            <span className={`${label} absolute top-1.5 left-2`}>Drawing</span>
            <svg viewBox="0 0 72 56" className="absolute inset-0 size-full" fill="none">
              <motion.path
                d={DINO_PATH}
                className="text-highlight-ink"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 1.1, ease: REVEAL_EASE }}
              />
              <motion.circle
                cx="52"
                cy="13"
                r="1.2"
                className="text-highlight-ink"
                fill="currentColor"
                initial={reduce ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.3, duration: 0.3 }}
              />
            </svg>
          </div>
          <motion.svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="text-highlight-muted size-3"
            fill="none"
            initial={reduce ? false : { opacity: 0, x: -3 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.35, duration: 0.4, ease: REVEAL_EASE }}
          >
            <path
              d="M3 8h9M8.5 4 12.5 8l-4 4"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.3"
            />
          </motion.svg>
          {/* The same shape, alive: filled, popped in, breathing. */}
          <div className="bg-highlight-panel/60 relative aspect-[4/3] overflow-hidden rounded-md">
            <span className={`${label} absolute top-1.5 left-2`}>Alive</span>
            <motion.svg
              viewBox="0 0 72 56"
              className="absolute inset-0 size-full"
              initial={reduce ? false : { opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.5, duration: 0.5, ease: REVEAL_EASE }}
              style={{ originX: '50%', originY: '65%' }}
            >
              <motion.g
                animate={reduce ? undefined : { y: [0, -1.2, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              >
                <path d={DINO_PATH} className="text-highlight-ink/90" fill="currentColor" />
                <circle
                  cx="52"
                  cy="13"
                  r="1.2"
                  className="text-highlight-strong"
                  fill="currentColor"
                />
              </motion.g>
            </motion.svg>
          </div>
        </div>
        <motion.div
          className="mt-2.5 flex flex-col gap-1"
          initial={reduce ? false : { opacity: 0, y: 4 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.8, duration: 0.45, ease: REVEAL_EASE }}
        >
          <span className="text-highlight-ink font-mono text-[8px]">
            Rexy the brave, who was scared of puddles
          </span>
          <span className="bg-highlight-ink/80 h-1 w-[78%] rounded-full" />
          <span className="bg-highlight-panel h-1 w-[52%] rounded-full" />
        </motion.div>
      </div>
    </motion.div>
  );
}
