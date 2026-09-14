import Lenis from 'lenis';

/**
 * Inertia scrolling for the whole page (Lenis) plus a slim custom scrollbar
 * that replaces the native one. Touch stays native; Lenis honours
 * `prefers-reduced-motion` on its own (lerp becomes 1:1). Scroll containers
 * marked `data-lenis-prevent` (the project modal) keep native scrolling.
 */
const HIDE_AFTER = 900; // ms of stillness before the scrollbar fades out

export function initSmoothScroll(bar: HTMLElement, thumb: HTMLElement) {
  const lenis = new Lenis({
    lerp: 0.09,
    autoRaf: true,
    anchors: true,
  });

  // The project modal locks the page with `body { overflow: hidden }`; mirror
  // that on Lenis so wheel over the backdrop doesn't scroll the page behind it.
  const syncLock = () => {
    if (document.body.style.overflow === 'hidden') lenis.stop();
    else lenis.start();
  };
  new MutationObserver(syncLock).observe(document.body, {
    attributes: true,
    attributeFilter: ['style'],
  });

  /* ---------- Custom scrollbar ---------- */
  let hideTimer = 0;
  let dragging = false;

  const show = () => {
    bar.dataset.active = '';
    window.clearTimeout(hideTimer);
    if (!dragging) hideTimer = window.setTimeout(() => delete bar.dataset.active, HIDE_AFTER);
  };

  const layout = () => {
    const track = bar.clientHeight;
    const { limit } = lenis;
    const total = limit + window.innerHeight;
    if (limit <= 0) {
      bar.hidden = true;
      return;
    }
    bar.hidden = false;
    const size = Math.max(28, (window.innerHeight / total) * track);
    const y = (lenis.animatedScroll / limit) * (track - size);
    thumb.style.height = `${size}px`;
    thumb.style.transform = `translate3d(0, ${y}px, 0)`;
  };

  lenis.on('scroll', () => {
    layout();
    show();
  });
  window.addEventListener('resize', layout, { passive: true });

  // Drag the thumb: map pointer travel along the track to a scroll position.
  let grab = 0; // pointer offset inside the thumb at grab time
  const toScroll = (clientY: number) => {
    const rect = bar.getBoundingClientRect();
    const size = thumb.offsetHeight;
    const ratio = (clientY - rect.top - grab) / (rect.height - size);
    return Math.min(1, Math.max(0, ratio)) * lenis.limit;
  };
  thumb.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    dragging = true;
    grab = e.clientY - thumb.getBoundingClientRect().top;
    thumb.setPointerCapture(e.pointerId);
    bar.dataset.dragging = '';
    show();
  });
  thumb.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    lenis.scrollTo(toScroll(e.clientY), { immediate: true });
  });
  const release = () => {
    if (!dragging) return;
    dragging = false;
    delete bar.dataset.dragging;
    show();
  };
  thumb.addEventListener('pointerup', release);
  thumb.addEventListener('pointercancel', release);
  thumb.addEventListener('lostpointercapture', release);

  // Click on the track: jump so the thumb centres on the pointer.
  bar.addEventListener('pointerdown', (e) => {
    if (e.target !== bar || e.button !== 0) return;
    grab = thumb.offsetHeight / 2;
    lenis.scrollTo(toScroll(e.clientY));
  });

  layout();
  return lenis;
}
