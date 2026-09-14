'use client';
// Combines beui.dev/components/blocks/not-found "terminal" and "glitch":
// a terminal types the failed command, and its output is the scrambling code.

import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { TextReveal } from '@/components/motion/text-reveal';
import { SPRING_PRESS } from '@/lib/ease';
import { useHoverCapable } from '@/lib/hooks/use-hover-capable';

const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&@$?/\\';
const SCRAMBLE_MS = 800;
const TICK_MS = 45;
const TYPE_SPRING = { stiffness: 320, damping: 30, mass: 0.6 };

// Typing choreography (seconds). Each line starts once the previous one has landed.
const CD_STAGGER = 0.018;
const ERR_DELAY = 0.45;
const ERR_STAGGER = 0.012;
const STATUS_DELAY = 1.1;
const STATUS_STAGGER = 0.018;
const STATUS_CMD = '$ status 404';

/**
 * Renders `text`, scrambling every glyph after `delay` before it settles.
 * SSR and the first paint show the real text, so reduced-motion users and
 * crawlers never see the noise.
 */
function Scramble({ text, delay = 0 }: { text: string; delay?: number }) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (reduce) {
      setDisplay(text);
      return;
    }
    const chars = text.split('');
    let raf = 0;
    let last = 0;
    let start = 0;

    const loop = (now: number) => {
      if (!start) start = now;
      if (now - last >= TICK_MS) {
        last = now;
        const progress = Math.min((now - start) / SCRAMBLE_MS, 1);
        const settled = Math.floor(progress * chars.length);
        setDisplay(
          chars
            .map((ch, i) =>
              i < settled || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
            )
            .join('')
        );
      }
      if (now - start < SCRAMBLE_MS) raf = requestAnimationFrame(loop);
      else setDisplay(text);
    };
    const timer = window.setTimeout(() => {
      raf = requestAnimationFrame(loop);
    }, delay * 1000);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [text, delay, reduce]);

  return <span className="tabular-nums">{display}</span>;
}

export function NotFound({ code = '404' }: { code?: string }) {
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  // The real path is only known on the client; SSR types a placeholder.
  const [path, setPath] = useState('/page');
  useEffect(() => {
    const p = window.location.pathname;
    if (p && p !== '/') setPath(p.length > 40 ? `${p.slice(0, 37)}…` : p);
  }, []);

  const cd = `$ cd ${path}`;
  const err = `cd: no such file or directory: ${path}`;
  const statusDelay = STATUS_DELAY + (cd.length + err.length - 46) * 0.01;
  const codeDelay = reduce ? 0 : statusDelay + STATUS_CMD.length * STATUS_STAGGER + 0.15;

  return (
    <div className="flex w-full flex-col items-start gap-8">
      <div className="border-highlight-line bg-highlight-strong w-full overflow-hidden rounded-2xl border shadow-[var(--modal-shadow)]">
        <div className="border-highlight-line flex items-center gap-1.5 border-b px-4 py-3">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
          <span className="text-highlight-muted ml-2 font-mono text-[11px]">~/mamrez.me</span>
        </div>
        <div className="space-y-1.5 px-5 pt-4 pb-5 font-mono text-[13px] leading-relaxed">
          <TextReveal
            key={`cd-${path}`}
            as="p"
            split="char"
            stagger={CD_STAGGER}
            blur={6}
            yOffset={0}
            spring={TYPE_SPRING}
            className="text-highlight-ink/85"
            text={cd}
          />
          <TextReveal
            key={`err-${path}`}
            as="p"
            split="char"
            stagger={ERR_STAGGER}
            delay={ERR_DELAY}
            blur={6}
            yOffset={0}
            spring={TYPE_SPRING}
            className="break-all text-[#ff5f57]"
            text={err}
          />
          <p className="text-highlight-ink/85 flex items-center">
            <TextReveal
              key={`status-${path}`}
              as="span"
              split="char"
              stagger={STATUS_STAGGER}
              delay={statusDelay}
              blur={6}
              yOffset={0}
              spring={TYPE_SPRING}
              text={STATUS_CMD}
            />
            <span
              aria-hidden="true"
              className="bg-highlight-ink/85 ml-1 inline-block h-[1.1em] w-[0.55ch] translate-y-[0.12em] motion-safe:animate-pulse"
            />
          </p>

          {/* Command output: the big code, scrambling into place with a chromatic split on hover. */}
          <motion.div
            className="group text-highlight-ink relative pt-3 [font-size:clamp(4.5rem,16vw,8rem)] leading-none font-bold tracking-tighter select-none"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: codeDelay }}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 pt-3 text-[#ff0040] opacity-0 mix-blend-screen transition-[transform,opacity] duration-150 ease-out group-hover:translate-x-[3px] group-hover:opacity-70 motion-reduce:hidden"
            >
              <Scramble text={code} delay={codeDelay} />
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 pt-3 text-[#00e5ff] opacity-0 mix-blend-screen transition-[transform,opacity] duration-150 ease-out group-hover:-translate-x-[3px] group-hover:opacity-70 motion-reduce:hidden"
            >
              <Scramble text={code} delay={codeDelay} />
            </span>
            <h1 className="relative">
              <Scramble text={code} delay={codeDelay} />
            </h1>
          </motion.div>
        </div>
      </div>

      <div>
        <p className="font-hand text-4xl leading-none font-medium">Seems you're lost</p>
        <p className="text-ink-muted mt-3 max-w-sm text-sm leading-5">
          This page doesn't exist, or it moved. The home page is still where you left it.
        </p>
      </div>

      <div>
        <motion.a
          href="/"
          whileTap={reduce ? undefined : { scale: 0.96 }}
          whileHover={reduce || !canHover ? undefined : { scale: 1.02 }}
          transition={SPRING_PRESS}
          className="bg-highlight-ink text-highlight-strong hover:bg-highlight-ink/90 inline-flex min-h-9 items-center justify-center rounded-full px-4 text-xs font-medium transition-colors select-none"
        >
          Back home
        </motion.a>
      </div>
    </div>
  );
}
