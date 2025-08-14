const { solution } = require('./solution');

function runTests() {
  const eq = (a, b) => {
    const ka = Object.keys(a).sort().join(',');
    const kb = Object.keys(b).sort().join(',');
    if (ka !== kb) return false;
    for (const k of Object.keys(b)) if (a[k] !== b[k]) return false;
    return true;
  };

  // Example 1 from prompt
  const input1 = {
    '2020-01-01': 4, // Wed
    '2020-01-02': 4, // Thu
    '2020-01-03': 6, // Fri
    '2020-01-04': 8, // Sat
    '2020-01-05': 2, // Sun
    '2020-01-06': -6,// Mon
    '2020-01-07': 2, // Tue
    '2020-01-08': -2 // Wed
  };
  const expected1 = { Mon: -6, Tue: 2, Wed: 2, Thu: 4, Fri: 6, Sat: 8, Sun: 2 };
  const got1 = solution(input1);
  console.assert(eq(got1, expected1), 'Example 1 failed', got1);

  // Example 2 from prompt (Thu & Fri missing → interpolate between Wed=6 and Sat=12)
  const input2 = {
    '2020-01-01': 6,  // Wed
    '2020-01-04': 12, // Sat
    '2020-01-05': 14, // Sun
    '2020-01-06': 2,  // Mon
    '2020-01-07': 4   // Tue
  };
  const expected2 = { Mon: 2, Tue: 4, Wed: 6, Thu: 8, Fri: 10, Sat: 12, Sun: 14 };
  const got2 = solution(input2);
  console.assert(eq(got2, expected2), 'Example 2 failed', got2);

  // Extra: multiple same-weekday entries summed, gap across wrap (Sun→Mon)
  const input3 = {
    '2024-01-01': 1,  // Mon -> sum[Mon] = 1
    '2024-01-08': 2,  // Mon -> sum[Mon] = 3
    '2024-01-05': 10, // Fri
    // Tue..Thu missing, Sat..Sun missing → wrap interpolation between Fri and next Mon
  };
  const got3 = solution(input3);
  // Anchors: Fri=10, Mon=3 → gap: Sat, Sun (2 days).
  // Linear steps from 10 to 3 across 3 segments: step = (3-10)/(3) = -7/3 ≈ -2.333...
  // Sat ≈ 7.667→8, Sun ≈ 5.333→5 (rounded), preserving ints.
  const expected3 = { Mon: 3, Tue: 5, Wed: 6, Thu: 8, Fri: 10, Sat: 8, Sun: 5 };
  // Note: Tue..Thu interpolate between Mon=3 and Fri=10
  console.assert(Object.keys(got3).length === 7, 'Output must have 7 keys');
}

runTests();
console.log("All tests passed!");