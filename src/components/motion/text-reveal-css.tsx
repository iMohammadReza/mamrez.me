import type { CSSProperties, ElementType } from 'react';
import { toWordGroups } from '@/components/motion/text-reveal';
import { cn } from '@/lib/utils';

export interface TextRevealCssProps {
  text: string;
  as?: ElementType;
  id?: string;
  className?: string;
  split?: 'word' | 'char';
  /** Seconds between units. */
  stagger?: number;
  /** Seconds before the first unit starts. */
  delay?: number;
  blur?: number;
  yOffset?: string | number;
}

/**
 * Same choreography as `TextReveal`, but driven by CSS animations (see
 * `.tr-unit` in global.css) so the text is visible from first paint and never
 * waits for hydration. Meant for above-the-fold copy that renders once; use
 * `TextReveal` where the spring or in-view triggering is needed.
 */
export function TextRevealCss({
  text,
  as: Comp = 'span',
  id,
  className,
  split = 'word',
  stagger = 0.09,
  delay = 0,
  blur = 12,
  yOffset = '40%',
}: TextRevealCssProps) {
  let unitIndex = 0;
  const renderUnit = (unit: string, key: string) => {
    const style = { '--tr-delay': `${(delay + unitIndex * stagger).toFixed(3)}s` } as CSSProperties;
    unitIndex += 1;
    return (
      <span key={key} className="tr-unit" style={style}>
        {unit}
      </span>
    );
  };

  const rootStyle = {
    '--tr-y': typeof yOffset === 'number' ? `${yOffset}px` : yOffset,
    '--tr-blur': `${blur}px`,
  } as CSSProperties;

  return (
    <Comp id={id} className={cn('block', className)} style={rootStyle}>
      <span className="block">
        {toWordGroups(text).map((group, gi) => {
          const whole = group.text + group.trailing;
          if (split !== 'char') return renderUnit(whole, `${gi}`);
          // Characters animate one at a time, but each word (plus the space
          // that follows it) sits in its own inline-block so a long line
          // wraps between words instead of mid-word.
          return (
            <span key={gi} className="inline-block whitespace-pre">
              {Array.from(whole).map((char, ci) => renderUnit(char, `${gi}-${ci}`))}
            </span>
          );
        })}
      </span>
    </Comp>
  );
}
