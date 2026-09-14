/**
 * Flags every `[data-hand]` title as done once it scrolls into view; the
 * write-in (clip wipe + travelling pen dot) is a CSS animation whose duration
 * SectionTitle.astro derives from the title length. Eager titles animate on
 * their own from first paint.
 */
export function initHandwriting(root: ParentNode = document) {
  const titles = root.querySelectorAll<HTMLElement>(
    '[data-hand]:not([data-hand-done]):not([data-hand-eager])'
  );
  if (!titles.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.handDone = '';
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px' }
  );
  titles.forEach((el) => io.observe(el));
}
