/**
 * Starter motifs for the planner library: simple, original vector shapes to
 * block out a composition before real artwork goes in. Not anyone's art.
 */

export interface Motif {
  id: string;
  name: string;
  width: number;
  height: number;
  svg: string;
}

const sun = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><path fill="#c23a2c" d="M200 22c98 0 176 80 176 178 0 99-79 178-178 178-97 0-176-80-176-178C22 102 103 22 200 22z"/></svg>`;

const fuji = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
<path fill="#4d6382" d="M0 400 L300 70 Q318 52 340 50 L460 50 Q482 52 500 70 L800 400 Z"/>
<path fill="#f7f4ee" d="M300 70 Q318 52 340 50 L460 50 Q482 52 500 70 L585 164 L545 150 L515 186 L478 150 L440 196 L400 152 L360 194 L322 150 L285 186 L255 150 L215 164 Z"/>
</svg>`;

const blossom = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><g transform="translate(200 200)">${[0, 72, 144, 216, 288]
  .map(
    (a) =>
      `<path transform="rotate(${a})" fill="#f2b7c6" stroke="#d98ba0" stroke-width="5" d="M0 -18 C-62 -60 -70 -140 -26 -176 L0 -150 L26 -176 C70 -140 62 -60 0 -18 Z"/>`,
  )
  .join("")}<circle r="26" fill="#c9506e"/></g></svg>`;

const waves = (() => {
  // seigaiha: overlapping rows of concentric half circles
  const r = 50;
  let out = "";
  for (let row = 0; row < 5; row++) {
    const y = 60 + row * 35;
    const shift = row % 2 ? r : 0;
    for (let col = -1; col < 6; col++) {
      const x = col * 2 * r + shift;
      for (const [k, fill] of [
        [1, "#2b4c7e"],
        [0.72, "#f7f4ee"],
        [0.5, "#2b4c7e"],
        [0.28, "#f7f4ee"],
      ] as const) {
        out += `<circle cx="${x}" cy="${y}" r="${r * k}" fill="${fill}"/>`;
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 10 500 250"><clipPath id="c"><rect x="0" y="10" width="500" height="250"/></clipPath><g clip-path="url(#c)">${out}</g></svg>`;
})();

const enso = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><path fill="none" stroke="#1d1b17" stroke-width="34" stroke-linecap="round" d="M236 60 C330 76 368 170 336 250 C300 340 180 366 108 310 C40 258 44 150 104 96"/></svg>`;

export const motifs: Motif[] = [
  { id: "motif:sun", name: "Red sun", width: 400, height: 400, svg: sun },
  { id: "motif:fuji", name: "Mountain", width: 800, height: 400, svg: fuji },
  { id: "motif:blossom", name: "Blossom", width: 400, height: 400, svg: blossom },
  { id: "motif:waves", name: "Waves", width: 500, height: 250, svg: waves },
  { id: "motif:enso", name: "Brush circle", width: 400, height: 400, svg: enso },
];

/** Explicit width/height: some browsers report 0×0 for viewBox-only SVGs. */
export const motifSrc = (m: Motif) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    m.svg.replace("<svg ", `<svg width="${m.width * 2}" height="${m.height * 2}" `),
  )}`;
