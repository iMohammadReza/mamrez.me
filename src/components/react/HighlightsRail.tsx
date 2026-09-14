import { animate, type AnimationPlaybackControls } from 'motion';
import { LayoutGroup, motion, useReducedMotion } from 'motion/react';
import {
  type PointerEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { moveFocus } from '@/lib/focus';
import { useHoverCapable } from '@/lib/hooks/use-hover-capable';
import type { Highlight } from '@/lib/site';
import {
  REVEAL_DURATION,
  REVEAL_EASE,
  REVEAL_HIDDEN,
  REVEAL_SHOWN,
  REVEAL_STAGGER,
} from '@/lib/motion';
import { HighlightVisual } from './highlights/visuals';
import { HighlightModal } from './HighlightModal';

export function HighlightsRail({ highlights }: { highlights: Highlight[] }) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const triggers = useRef(new Map<string, HTMLButtonElement>());
  const railRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  const [edges, setEdges] = useState({ start: true, end: false });
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{
    x: number;
    left: number;
    moved: boolean;
    lastX: number;
    lastT: number;
    velocity: number; // pointer px per ms, signed
  } | null>(null);
  const suppressClick = useRef(false);
  const settle = useRef<AnimationPlaybackControls | null>(null);

  const active = highlights.find((h) => h.slug === activeSlug) ?? null;

  // Track whether the rail is scrolled to either end so the arrows can disable.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail || !canHover) return;
    const update = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      setEdges({ start: rail.scrollLeft <= 1, end: rail.scrollLeft >= max - 1 });
    };
    update();
    rail.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(rail);
    return () => {
      rail.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [canHover]);

  /* ---- Stepped scrolling ----
   * Wheel and touch snap natively via CSS scroll-snap. Drag release and the
   * arrows tween to a card instead, with snap suspended (`data-settling`) so
   * the browser can't fight the animation. */

  // Scroll positions that align each card with the leading inset, clamped to
  // the scroll range (the last cards share the max position).
  const snapTargets = () => {
    const rail = railRef.current;
    if (!rail) return [];
    const max = rail.scrollWidth - rail.clientWidth;
    const inset = parseFloat(getComputedStyle(rail).scrollPaddingInlineStart) || 0;
    const railLeft = rail.getBoundingClientRect().left;
    return highlights.map((h) => {
      const card = triggers.current.get(h.slug);
      if (!card) return 0;
      const left = card.getBoundingClientRect().left - railLeft + rail.scrollLeft;
      return Math.min(max, Math.max(0, left - inset));
    });
  };

  const stopSettle = () => {
    settle.current?.stop();
    settle.current = null;
    delete railRef.current?.dataset.settling;
  };

  const scrollToTarget = (to: number) => {
    const rail = railRef.current;
    if (!rail) return;
    stopSettle();
    if (reduce) {
      rail.scrollLeft = to;
      return;
    }
    rail.dataset.settling = '';
    settle.current = animate(rail.scrollLeft, to, {
      duration: 0.6,
      ease: REVEAL_EASE,
      onUpdate: (v) => {
        rail.scrollLeft = v;
      },
      onComplete: () => {
        settle.current = null;
        delete rail.dataset.settling;
      },
    });
  };

  const page = (dir: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const targets = snapTargets();
    const x = rail.scrollLeft;
    // Next distinct stop in the requested direction (several cards may share the max).
    const next =
      dir === 1 ? targets.find((t) => t > x + 1) : [...targets].reverse().find((t) => t < x - 1);
    if (next !== undefined) scrollToTarget(next);
  };

  // Mouse drag-to-scroll. A small threshold keeps plain clicks opening the modal;
  // once a drag starts, the click that ends it is swallowed in the capture phase.
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!canHover || e.pointerType !== 'mouse' || e.button !== 0) return;
    const rail = railRef.current;
    if (!rail) return;
    suppressClick.current = false;
    stopSettle();
    drag.current = {
      x: e.clientX,
      left: rail.scrollLeft,
      moved: false,
      lastX: e.clientX,
      lastT: e.timeStamp,
      velocity: 0,
    };
    e.preventDefault(); // no text selection or focus-scroll while dragging
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const rail = railRef.current;
    if (!d || !rail) return;
    if (e.buttons === 0) return endDrag();
    const dx = e.clientX - d.x;
    if (!d.moved) {
      if (Math.abs(dx) < 6) return;
      d.moved = true;
      rail.setPointerCapture(e.pointerId);
      setDragging(true);
    }
    const dt = Math.max(1, e.timeStamp - d.lastT);
    d.velocity = (e.clientX - d.lastX) / dt;
    d.lastX = e.clientX;
    d.lastT = e.timeStamp;
    rail.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    const d = drag.current;
    const rail = railRef.current;
    if (!d) return;
    drag.current = null;
    setDragging(false);
    if (!d.moved || !rail) return;
    suppressClick.current = true;
    // Settle on the nearest card; a flick adds at most one step in its direction.
    const targets = snapTargets();
    if (!targets.length) return;
    const x = rail.scrollLeft;
    let idx = targets.reduce(
      (best, t, i) => (Math.abs(t - x) < Math.abs(targets[best] - x) ? i : best),
      0
    );
    if (Math.abs(d.velocity) > 0.4) {
      const dir = d.velocity < 0 ? 1 : -1; // pointer moving left pushes content forward
      const next = idx + dir;
      const ahead = dir === 1 ? targets[next] > x : targets[next] < x;
      if (next >= 0 && next < targets.length && ahead) idx = next;
    }
    scrollToTarget(targets[idx]);
  };
  const onClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    if (!suppressClick.current) return;
    suppressClick.current = false;
    e.stopPropagation();
    e.preventDefault();
  };

  // Whether the open dialog was summoned from the keyboard; decides if the
  // focus moves that follow (close button, then the card again) show a ring.
  const viaKeyboard = useRef(false);
  const open = (slug: string, keyboard: boolean) => {
    viaKeyboard.current = keyboard;
    setActiveSlug(slug);
  };

  const close = useCallback(
    (keyboard: boolean) => {
      const slug = activeSlug;
      setActiveSlug(null);
      // Return focus to the card that opened the dialog.
      if (slug) {
        requestAnimationFrame(() => {
          const card = triggers.current.get(slug);
          if (card) moveFocus(card, keyboard);
        });
      }
    },
    [activeSlug]
  );

  return (
    <LayoutGroup id="highlights">
      <div
        ref={railRef}
        data-dragging={dragging || undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
        onWheel={stopSettle}
        onClickCapture={onClickCapture}
        className="highlight-rail hover-fine:cursor-grab overflow-x-auto overflow-y-hidden overscroll-x-contain"
      >
        <div className="highlight-track flex w-max min-w-full pb-3">
          <span aria-hidden="true" className="highlight-leading-space shrink-0" />
          {highlights.map((item, i) => (
            <motion.button
              key={item.slug}
              ref={(el) => {
                if (el) triggers.current.set(item.slug, el);
                else triggers.current.delete(item.slug);
              }}
              type="button"
              aria-haspopup="dialog"
              aria-expanded={activeSlug === item.slug}
              aria-label={`Open ${item.title} project details`}
              onClick={(e) => open(item.slug, e.detail === 0)}
              className="highlight-card group focus-visible:ring-highlight-ink focus-visible:ring-offset-canvas shrink-0 cursor-pointer text-left outline-none focus-visible:ring-1 focus-visible:ring-offset-4"
              initial={reduce ? false : REVEAL_HIDDEN}
              whileInView={REVEAL_SHOWN}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{
                duration: REVEAL_DURATION,
                ease: REVEAL_EASE,
                delay: i * REVEAL_STAGGER,
              }}
            >
              <motion.div
                layoutId={`hl-visual-${item.slug}`}
                data-highlight-visual="true"
                className="highlight-visual bg-highlight ring-highlight-line/0 group-hover:bg-highlight-hover group-hover:ring-highlight-line overflow-hidden rounded-[1.35rem] ring-1 transition-[background-color,box-shadow] duration-300"
                style={{ opacity: activeSlug === item.slug ? 0 : 1 }}
              >
                {/* The mini UI lifts slightly on hover; CSS `hover:` is already gated to hover-capable devices. */}
                <div className="flex size-full items-center justify-center p-5 transition-transform duration-500 ease-(--ease-out-expo) group-hover:-translate-y-0.5 group-hover:scale-[1.03] sm:p-6">
                  <HighlightVisual kind={item.visual} />
                </div>
              </motion.div>
              <span className="mt-3 flex items-start justify-between gap-4 px-0.5">
                <span>
                  <span className="flex items-center gap-1.5 text-sm leading-5 font-[500] tracking-[-0.0064em]">
                    {item.title}
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      className="text-ink-muted size-3 -translate-x-1 opacity-0 transition-[opacity,transform] duration-300 ease-(--ease-out-expo) group-hover:translate-x-0 group-hover:opacity-100"
                      fill="none"
                    >
                      <path
                        d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </span>
                  <span className="text-ink-muted mt-0.5 block text-xs leading-4">{item.kind}</span>
                </span>
                <span className="text-ink-muted pt-0.5 font-mono text-[9px] tracking-[0.06em]">
                  {item.years}
                </span>
              </span>
            </motion.button>
          ))}
          <span aria-hidden="true" className="highlight-trailing-space shrink-0" />
        </div>
      </div>

      {/* Rendered on the server and shown via CSS on mouse/trackpad devices, so the
          row doesn't pop in after hydration and shift the content below it. */}
      <div className="hover-fine:flex mt-1 hidden justify-end gap-1.5">
        <RailArrow dir={-1} disabled={edges.start} onClick={() => page(-1)} />
        <RailArrow dir={1} disabled={edges.end} onClick={() => page(1)} />
      </div>

      <HighlightModal item={active} viaKeyboard={viaKeyboard.current} onClose={close} />
    </LayoutGroup>
  );
}

/** Prev/next paging control for the rail, only shown on mouse/trackpad devices. */
function RailArrow({
  dir,
  disabled,
  onClick,
}: {
  dir: -1 | 1;
  disabled: boolean;
  onClick: () => void;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      aria-label={dir === -1 ? 'Show previous highlights' : 'Show next highlights'}
      disabled={disabled}
      onClick={onClick}
      className="text-ink-muted hover:text-ink border-highlight-line hover:bg-highlight focus-visible:ring-highlight-ink focus-visible:ring-offset-canvas flex size-8 cursor-pointer items-center justify-center rounded-full border transition-colors duration-200 outline-none focus-visible:ring-1 focus-visible:ring-offset-2 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent"
      whileTap={reduce || disabled ? undefined : { scale: 0.92 }}
    >
      <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5" fill="none">
        <path
          d={dir === -1 ? 'M9.5 4 5.5 8l4 4' : 'M6.5 4l4 4-4 4'}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.3"
        />
      </svg>
    </motion.button>
  );
}
