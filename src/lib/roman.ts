const TABLE: [number, string][] = [
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

/** 1-39 → roman numeral (covers all Major Arcana numbers). */
export function toRoman(n: number): string {
  let v = Math.max(1, Math.min(39, Math.round(n)));
  let out = "";
  for (const [num, sym] of TABLE) {
    while (v >= num) {
      out += sym;
      v -= num;
    }
  }
  return out;
}
