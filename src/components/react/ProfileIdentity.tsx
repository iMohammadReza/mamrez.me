import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { TextRevealCss } from '@/components/motion/text-reveal-css';
import { TextScramble } from '@/components/motion/text-scramble';
import { SPRING_MOUSE } from '@/lib/ease';

interface Props {
  avatar: string;
  avatarSrcSet?: string;
  name: string;
  alias: string;
  title: string;
  /** Title shown while the avatar is hovered. */
  easterTitle: string;
}

const NAME_CLASS = 'text-[0.95rem] leading-5 font-[600] tracking-[-0.0064em]';
const TITLE_CLASS = 'text-ink-muted text-sm leading-5 tracking-[-0.0064em]';
const REVEAL_MS = 1400;
/** How long a tap keeps the hover state alive on touch devices. */
const TOUCH_HOLD_MS = 3000;

/**
 * Avatar + name + title. The avatar springs in and tilts toward the cursor;
 * hovering it scrambles the name into the alias (and back on leave). Touch
 * has no hover, so a tap turns it on for a few seconds instead.
 *
 * The entrances (avatar pop, name/title stagger) are CSS animations so the
 * hero is painted — and moving — before React and Motion have loaded.
 */
export function ProfileIdentity({ avatar, avatarSrcSet, name, alias, title, easterTitle }: Props) {
  const reduce = useReducedMotion() ?? false;
  const [hovered, setHovered] = useState(false);
  // The name is spring-revealed on load, then handed to TextScramble so
  // hover swaps animate (TextScramble only animates on text *changes*).
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setRevealed(true), reduce ? 0 : REVEAL_MS);
    return () => window.clearTimeout(t);
  }, [reduce]);

  // Touch pointers fire enter/leave around a single tap, so instead of
  // following them the tap arms a timer that releases the hover state.
  const holdTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(holdTimer.current), []);
  const isTouch = (e: PointerEvent<HTMLDivElement>) => e.pointerType !== 'mouse';

  // Cursor tilt: -0.5..0.5 across the tile, mapped to a few degrees of rotation.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, SPRING_MOUSE);
  const sy = useSpring(py, SPRING_MOUSE);
  const rotateX = useTransform(sy, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-12, 12]);
  const glowX = useTransform(sx, [-0.5, 0.5], ['20%', '80%']);
  const glowY = useTransform(sy, [-0.5, 0.5], ['20%', '80%']);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onEnter = (e: PointerEvent<HTMLDivElement>) => {
    setHovered(true);
    if (!isTouch(e)) return;
    window.clearTimeout(holdTimer.current);
    holdTimer.current = window.setTimeout(() => setHovered(false), TOUCH_HOLD_MS);
  };
  const onLeave = (e: PointerEvent<HTMLDivElement>) => {
    if (isTouch(e)) return;
    setHovered(false);
    px.set(0);
    py.set(0);
  };

  return (
    <div className="flex items-center gap-4">
      <div
        className="hero-avatar-in relative size-14 shrink-0 cursor-pointer touch-manipulation select-none [-webkit-touch-callout:none] [perspective:400px]"
        onPointerMove={onMove}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        onContextMenu={(e) => e.preventDefault()}
      >
        <motion.div
          className="ring-highlight-line relative size-full overflow-hidden rounded-[0.9rem] ring-1 [transform-style:preserve-3d] ring-inset"
          style={reduce ? undefined : { rotateX, rotateY }}
          animate={{ scale: hovered && !reduce ? 1.08 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        >
          <motion.img
            src={avatar}
            srcSet={avatarSrcSet}
            sizes="56px"
            alt={`Portrait of ${name}`}
            width={56}
            height={56}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            draggable={false}
            className="absolute inset-0 size-full object-cover"
            animate={{ scale: hovered && !reduce ? 1.12 : 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          />
          {/* Cursor-following sheen */}
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 mix-blend-soft-light"
            style={{
              background: useTransform(
                [glowX, glowY],
                ([x, y]) =>
                  `radial-gradient(60% 60% at ${x} ${y}, rgba(255,255,255,0.7), transparent 70%)`
              ),
            }}
            animate={{ opacity: hovered && !reduce ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </div>

      <div className="min-w-0">
        {revealed ? (
          <h1 id="profile-name" className={NAME_CLASS}>
            <TextScramble
              text={hovered ? alias : name}
              glyphs="MamRezABCDEFGHJKLMNPQRSTUVWXYZ#%&@$?/"
            />
          </h1>
        ) : (
          <TextRevealCss
            as="h1"
            id="profile-name"
            text={name}
            split="char"
            stagger={0.025}
            blur={8}
            yOffset="30%"
            className={NAME_CLASS}
          />
        )}
        {revealed ? (
          <p className={TITLE_CLASS}>
            <TextScramble
              text={hovered ? easterTitle : title}
              glyphs="abcdefghijklmnopqrstuvwxyz#%&@$?/"
            />
          </p>
        ) : (
          <TextRevealCss
            as="p"
            text={title}
            split="word"
            stagger={0.07}
            delay={0.35}
            blur={8}
            yOffset="30%"
            className={TITLE_CLASS}
          />
        )}
      </div>
    </div>
  );
}
