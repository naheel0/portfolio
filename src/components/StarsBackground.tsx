/**
 * StarsBackground — pure CSS starfield with ZERO React-managed DOM nodes
 * and ZERO per-star animation entries.
 *
 * Redesign:
 *   • Instead of 50 individual absolutely-positioned <div> nodes, each
 *     with its own `twinkle` animation (50 compositor loads at runtime),
 *     the starfield is now painted with layered `radial-gradient`
 *     background images on a single element via CSS.
 *
 *   • Three starfield layers (far / mid / near) are defined as separate
 *     background-image radial-gradients on ::before / ::after / the main
 *     element itself. Each layer is a static tile that repeats across the
 *     viewport — zero JS, zero React state.
 *
 *   • Only the *layer* (a single opacity/transform keyframe) animates,
 *     not each star. That means 3 GPU-composited keyframes total,
 *     instead of 50 animation entries — significantly less main-thread
 *     scheduling and a much smaller paint surface.
 *
 *   • Slow parallax drift on `background-position` creates depth:
 *     farthest layer moves slowest, near layer moves fastest.
 *
 *   • Respects prefers-reduced-motion: all animation disabled.
 *
 *   Mounts instantly with no hydration mismatch because there is no
 *   client-only random output.
 */
const StarsBackground = () => {
  return <div id="stars-background" aria-hidden="true" />;
};

export default StarsBackground;
