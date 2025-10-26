export function shuffle<T>(array: T[], seed?: number): T[] {
  // Fisher–Yates; if seed provided, deterministic.
  const result = array.slice();
  let random = Math.random;
  if (typeof seed === 'number') {
    let s = seed >>> 0;
    random = () => {
      // xorshift32
      s ^= s << 13;
      s ^= s >>> 17;
      s ^= s << 5;
      return ((s >>> 0) % 1000) / 1000;
    };
  }
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}


