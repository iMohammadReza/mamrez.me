/**
 * Flags every `[data-reveal]` block as revealed once it enters the viewport;
 * the entrance itself is a CSS transition (see global.css). Eager blocks
 * animate on their own and reduced-motion users see everything immediately.
 */
export function initReveal(root: ParentNode = document) {
  const blocks = root.querySelectorAll<HTMLElement>(
    '[data-reveal]:not([data-revealed]):not([data-reveal-eager])'
  );
  if (!blocks.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    blocks.forEach((el) => (el.dataset.revealed = ''));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.revealed = '';
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px' }
  );
  blocks.forEach((el) => io.observe(el));
}
