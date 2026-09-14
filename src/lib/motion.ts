// Shared motion tokens for the reveal choreography used across the page.
export const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;
export const REVEAL_DURATION = 0.7;
export const REVEAL_STAGGER = 0.06;

export const REVEAL_HIDDEN = { opacity: 0, filter: 'blur(4px)', y: 10 } as const;
export const REVEAL_SHOWN = { opacity: 1, filter: 'blur(0px)', y: 0 } as const;

export const SPRING_MORPH = { type: 'spring', stiffness: 260, damping: 30 } as const;
