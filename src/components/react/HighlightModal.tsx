import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { ButtonLink } from '@/components/motion/button/base';
import { SPRING_PANEL } from '@/lib/ease';
import { moveFocus } from '@/lib/focus';
import { REVEAL_EASE, SPRING_MORPH } from '@/lib/motion';
import type { Highlight } from '@/lib/site';
import { HighlightVisual } from './highlights/visuals';

interface Props {
  item: Highlight | null;
  /** True when the dialog was opened from the keyboard (shows the close button's focus ring). */
  viaKeyboard: boolean;
  /** `viaKeyboard` is true for Escape and keyboard-activated close buttons. */
  onClose: (viaKeyboard: boolean) => void;
}

/**
 * Project details dialog. The visual shares a `layoutId` with the card in the
 * rail, so it morphs from the card into the sticky header of the panel.
 */
export function HighlightModal({ item, viaKeyboard, onClose }: Props) {
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!item) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (closeRef.current) moveFocus(closeRef.current, viaKeyboard);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose(true);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [item, viaKeyboard, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
          <motion.div
            aria-hidden="true"
            className="bg-modal-backdrop absolute inset-0 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => onClose(false)}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`project-${item.slug}-title`}
            aria-describedby={`project-${item.slug}-description`}
            data-project-modal-panel="true"
            className="bg-modal-surface relative h-[min(44rem,100dvh-2rem)] w-[min(56rem,100%)] overflow-hidden rounded-[2rem] shadow-[var(--modal-shadow)] outline-none"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
            transition={reduce ? { duration: 0.15 } : SPRING_PANEL}
          >
            <div
              tabIndex={-1}
              data-lenis-prevent
              className="project-modal-scroll absolute inset-0 overflow-x-hidden overflow-y-auto overscroll-none"
            >
              <div className="sticky top-4 z-40 flex h-0 justify-end px-4">
                <motion.button
                  ref={closeRef}
                  type="button"
                  aria-label="Close project details"
                  // A click from Enter/Space carries detail 0.
                  onClick={(e) => onClose(e.detail === 0)}
                  className="bg-highlight-ink text-highlight-strong flex size-10 cursor-pointer items-center justify-center rounded-full"
                  whileTap={reduce ? undefined : { scale: 0.92 }}
                >
                  <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none">
                    <path
                      d="m5 5 10 10M15 5 5 15"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="1.25"
                    />
                  </svg>
                </motion.button>
              </div>

              <div className="sticky top-0 z-20 h-[240px] w-full sm:h-[352px]">
                <motion.div
                  layoutId={`hl-visual-${item.slug}`}
                  data-project-modal-visual="true"
                  className="bg-highlight size-full origin-top-left overflow-hidden rounded-[1.4rem]"
                  transition={reduce ? { duration: 0 } : SPRING_MORPH}
                >
                  <div className="flex size-full items-center justify-center p-5 sm:p-6">
                    <HighlightVisual kind={item.visual} />
                  </div>
                </motion.div>
              </div>

              <motion.div
                className="bg-modal-surface relative z-10 px-6 pt-9 pb-14 sm:px-10 sm:pt-12 sm:pb-20"
                initial={reduce ? false : { opacity: 0, filter: 'blur(4px)', y: 10 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                transition={{ duration: 0.6, ease: REVEAL_EASE, delay: 0.12 }}
              >
                <header>
                  <p className="text-highlight-muted text-sm">
                    {item.kind} · {item.years}
                  </p>
                  <h2
                    id={`project-${item.slug}-title`}
                    className="text-highlight-ink mt-3 text-4xl font-medium tracking-[-0.045em] sm:text-5xl"
                  >
                    {item.title}
                  </h2>
                  <p
                    id={`project-${item.slug}-description`}
                    className="text-highlight-muted mt-5 max-w-xl text-base leading-7"
                  >
                    {item.summary}
                  </p>
                  {item.href && (
                    <ButtonLink
                      href={item.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      size="sm"
                      className="bg-highlight-ink text-highlight-strong hover:bg-highlight-ink/90 mt-7 min-h-9 px-4 text-xs font-medium"
                    >
                      View project
                      <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5" fill="none">
                        <path
                          d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.4"
                        />
                      </svg>
                    </ButtonLink>
                  )}
                </header>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
