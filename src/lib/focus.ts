/**
 * Moves focus to `el`. When the user got here with a pointer, programmatic
 * focus would still match `:focus-visible` and draw the keyboard ring, so the
 * element is tagged `data-focus-quiet` (see global.css) until the keyboard is
 * used or focus leaves it.
 */
export function moveFocus(el: HTMLElement, viaKeyboard: boolean) {
  if (!viaKeyboard) {
    el.dataset.focusQuiet = '';
    const clear = () => {
      delete el.dataset.focusQuiet;
      el.removeEventListener('keydown', clear);
      el.removeEventListener('blur', clear);
    };
    el.addEventListener('keydown', clear);
    el.addEventListener('blur', clear);
  }
  el.focus();
}
