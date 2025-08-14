// WEEKDAY UTILS
const WEEK = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const toWeekIndex = (isoDate) => {
  // JS: 0=Sun..6=Sat  →  we want 0=Mon..6=Sun
  const d = new Date(isoDate + 'T00:00:00Z'); // force UTC parsing of YYYY-MM-DD
  const js = d.getUTCDay();                   // 0..6 (Sun..Sat)
  return (js + 6) % 7;                        // 0..6 (Mon..Sun)
};

/**
 * @param {Record<string, number>} D - keys: 'YYYY-MM-DD', values: integers
 * @returns {Record<'Mon'|'Tue'|'Wed'|'Thu'|'Fri'|'Sat'|'Sun', number>}
 */
function solution(D) {
  // 1) Sum values by weekday, track presence
  const sums = new Array(7).fill(0);
  const present = new Array(7).fill(false);

  for (const [date, val] of Object.entries(D)) {
    const idx = toWeekIndex(date);
    sums[idx] += val;
    present[idx] = true; // mark that at least one sample landed on this weekday
  }

  // 2) If some weekdays are missing, fill by linear interpolation
  //    across each missing run between two known anchors (wrap-aware).
  const known = [];
  for (let i = 0; i < 7; i++) if (present[i]) known.push(i);

  if (known.length === 0) {
    // Not expected per problem statement (Mon & Sun exist), but guard anyway.
    return Object.fromEntries(WEEK.map((k) => [k, 0]));
  }

  // Handle wrap-around by appending first known + 7
  const extended = known.concat(known[0] + 7);

  for (let t = 0; t < known.length; t++) {
    const left = extended[t];           // anchor index in [0..6] or beyond
    const right = extended[t + 1];      // next anchor (might be > 6)
    const leftIdx = ((left % 7) + 7) % 7;
    const rightIdx = right % 7;

    const gapLen = right - left - 1;    // how many missing slots between anchors
    if (gapLen <= 0) continue;

    const startVal = sums[leftIdx];
    const endVal = sums[rightIdx];
    const step = (endVal - startVal) / (gapLen + 1);

    for (let g = 1; g <= gapLen; g++) {
      const idx = (left + g) % 7;
      const interp = startVal + step * g;
      sums[idx] = Math.round(interp);   // round to nearest int
      present[idx] = true;
    }
  }

  // 3) Return in required dictionary shape
  const out = {};
  for (let i = 0; i < 7; i++) out[WEEK[i]] = sums[i];
  return out;
}

module.exports = { solution };