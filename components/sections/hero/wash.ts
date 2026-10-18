/**
 * Timing of one palette swap ("wash") in the homepage hero.
 *
 * The new pair's background fades in over WASH seconds. Text and UI colours
 * don't fade along with it (on a light ↔ dark swap they'd pass through the
 * background's own brightness and vanish halfway); they snap at the fade's
 * midpoint instead. That snap lives in globals.css (`html[data-vibe-wash]`,
 * --vibe-flip-delay = WASH / 2) — keep the two in step.
 */
export const WASH = 0.6;
export const EASE_WASH = [0.65, 0, 0.35, 1] as const;

/** How long html[data-vibe-wash] stays on after a swap starts (ms). */
export const WASH_HOLD = WASH * 1000 + 200;
