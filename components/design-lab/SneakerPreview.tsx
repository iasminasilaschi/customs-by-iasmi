/**
 * Stylized flat sneaker illustration with paintable zones driven by a
 * palette. Deliberately a "designer's concept sketch", not a photoreal
 * render — the real pair is hand-painted, and true 3D comes in a later
 * phase. Zones: toe cap, upper, side panel bars, heel, collar, sole.
 */
export function SneakerPreview({
  palette,
  className,
  annotated = false,
  tone = "light",
}: {
  palette: string[];
  className?: string;
  annotated?: boolean;
  /** "light" = dark outlines for light backgrounds; "dark" = cream outlines. */
  tone?: "light" | "dark";
}) {
  const [c1, c2 = c1, c3 = c2, c4 = c3] = palette;
  const onDark = tone === "dark";
  const line = onDark ? "rgba(245,240,230,0.85)" : "rgba(44,42,32,0.78)";
  const faint = onDark ? "rgba(245,240,230,0.4)" : "rgba(44,42,32,0.34)";

  return (
    <svg
      viewBox="0 0 640 400"
      role="img"
      aria-label="Concept sneaker mockup with colour zones"
      className={className}
    >
      {/* ground shadow */}
      <ellipse cx="320" cy="366" rx="270" ry="16" fill="rgba(0,0,0,0.35)" />

      {/* upper body */}
      <path
        d="M70,290 C62,235 95,200 150,178 C185,164 205,150 225,128 C240,112 262,100 290,100 C310,100 322,108 332,120 C348,142 372,158 407,166 C452,176 505,180 545,196 C575,208 590,235 592,268 C593,280 588,290 575,290 Z"
        fill={c4}
        opacity="0.9"
      />

      {/* heel panel */}
      <path
        d="M468,290 C468,232 480,200 512,190 C546,201 576,222 590,256 C593,270 589,285 575,290 Z"
        fill={c3}
        opacity="0.95"
      />

      {/* toe cap */}
      <path
        d="M70,290 C62,235 95,200 150,178 C162,173 174,167 184,159 C204,190 202,242 188,290 Z"
        fill={c1}
      />

      {/* side panel bars (abstract mark, deliberately not a brand swoosh) */}
      <path d="M330,290 L368,192 L406,192 L368,290 Z" fill={c2} />
      <path d="M392,290 L428,196 L450,196 L414,290 Z" fill={c2} opacity="0.55" />

      {/* vamp / lace panel */}
      <path
        d="M228,132 C243,114 264,106 290,106 C305,106 315,113 323,124 L346,158 C322,176 282,184 252,172 Z"
        fill={c4}
        stroke={faint}
        strokeWidth="2"
      />

      {/* laces */}
      <g stroke="#f2ecdf" strokeWidth="9" strokeLinecap="round" opacity="0.95">
        <line x1="242" y1="142" x2="288" y2="122" />
        <line x1="256" y1="158" x2="304" y2="136" />
        <line x1="270" y1="174" x2="320" y2="150" />
      </g>

      {/* padded collar */}
      <path
        d="M356,122 C390,158 448,170 500,160"
        fill="none"
        stroke={c3}
        strokeWidth="16"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* upper outline */}
      <path
        d="M70,290 C62,235 95,200 150,178 C185,164 205,150 225,128 C240,112 262,100 290,100 C310,100 322,108 332,120 C348,142 372,158 407,166 C452,176 505,180 545,196 C575,208 590,235 592,268 C593,280 588,290 575,290"
        fill="none"
        stroke={line}
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* midsole + outsole */}
      <path
        d="M60,290 L580,290 C606,290 618,300 618,315 C618,338 596,350 546,350 L108,350 C58,350 26,342 26,318 C26,300 40,290 60,290 Z"
        fill="#f2ecdf"
      />
      <path
        d="M60,290 L580,290 C606,290 618,300 618,315 C618,338 596,350 546,350 L108,350 C58,350 26,342 26,318 C26,300 40,290 60,290 Z"
        fill="none"
        stroke={line}
        strokeWidth="3"
      />
      {/* sole accent line */}
      <path d="M40,318 L602,318" stroke={c2} strokeWidth="5" opacity="0.6" />

      {/* stitching details */}
      <g stroke={faint} strokeWidth="2" strokeDasharray="5 6" fill="none">
        <path d="M188,286 C202,240 204,192 186,162" />
        <path d="M468,286 C468,234 479,204 508,194" />
      </g>

      {annotated && (
        <g fontFamily="var(--font-grotesk), sans-serif" fontSize="13" fill={faint}>
          <g stroke={faint} strokeWidth="1.5">
            <line x1="120" y1="212" x2="70" y2="150" />
            <line x1="382" y1="230" x2="420" y2="90" />
            <line x1="540" y1="230" x2="590" y2="130" />
            <line x1="320" y1="340" x2="250" y2="386" />
          </g>
          <circle cx="120" cy="212" r="4" fill={c1} stroke="none" />
          <circle cx="382" cy="230" r="4" fill={c2} stroke="none" />
          <circle cx="540" cy="230" r="4" fill={c3} stroke="none" />
          <circle cx="320" cy="340" r="4" fill={c2} stroke="none" />
          <text x="34" y="140">toe cap</text>
          <text x="404" y="80">panel</text>
          <text x="576" y="120">heel</text>
          <text x="258" y="398">sole line</text>
        </g>
      )}
    </svg>
  );
}
