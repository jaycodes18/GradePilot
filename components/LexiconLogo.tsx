/**
 * LEXICON — SVG Wordmark + Mark
 *
 * The mark: a black square, a bold white geometric "L" (vertical + horizontal bar),
 * and a red accent square in the top-right corner.
 * Stays consistent in both light and dark mode (self-contained fill colors).
 */

interface LogoMarkProps {
  size?: number;
  className?: string;
}

/** The standalone square mark (L + red accent) */
export function LexiconMark({ size = 40, className = "" }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Lexicon mark"
      role="img"
    >
      {/* Base — solid black square */}
      <rect width="48" height="48" fill="#000000" />

      {/* L — vertical bar */}
      <rect x="11" y="8" width="9" height="26" fill="#FFFFFF" />

      {/* L — horizontal bar */}
      <rect x="11" y="29" width="22" height="8" fill="#FFFFFF" />

      {/* Red accent square — top-right of the L's negative space */}
      <rect x="30" y="8" width="8" height="8" fill="#FF6B6B" />
    </svg>
  );
}

/** Full horizontal wordmark: mark + "LEXICON" text as SVG paths */
export function LexiconWordmark({
  height = 40,
  className = "",
  dark = false,
}: {
  height?: number;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-label="Lexicon">
      <LexiconMark size={height} />
      <svg
        height={height * 0.52}
        viewBox="0 0 168 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <text
          x="0"
          y="18"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontSize="22"
          fontWeight="700"
          letterSpacing="-0.04em"
          fill={dark ? "#FFFDF5" : "#000000"}
          style={{ fontFamily: "inherit" }}
        >
          LEXICON
        </text>
      </svg>
    </div>
  );
}

/** Stacked version for loading screen — large display */
export function LexiconLoadingMark({ size = 80 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Lexicon"
      role="img"
    >
      <rect width="48" height="48" fill="#000000" />
      <rect x="11" y="8" width="9" height="26" fill="#FFFFFF" />
      <rect x="11" y="29" width="22" height="8" fill="#FFFFFF" />
      <rect x="30" y="8" width="8" height="8" fill="#FF6B6B" />
    </svg>
  );
}
