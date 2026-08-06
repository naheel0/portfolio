/**
 * AuroraOrbs — three floating CSS-only gradient orbs that drift behind the
 * entire app. Pure CSS keyframes (zero JS), GPU-composited via `transform`,
 * and disabled entirely under `prefers-reduced-motion` (see globals.css).
 *
 * Mounted once in RootLayout, fixed to viewport, pointer-events: none.
 */

export default function AuroraOrbs() {
  return (
    <div className="aurora-orbs" aria-hidden="true">
      <div className="aurora-orb aurora-orb-1" />
    </div>
  );
}
