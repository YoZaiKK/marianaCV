export function scrollProgress(scrollY: number, scrollHeight: number, viewportHeight: number): number {
  const range = Math.max(0, scrollHeight - viewportHeight);
  return range > 0 ? Math.min(1, Math.max(0, scrollY / range)) : 0;
}
export function lightWeights(progress: number) {
  const p = Math.min(1, Math.max(0, progress));
  const smooth = (n: number) => n * n * (3 - 2 * n);
  return {
    sage: .6 - .48 * smooth(Math.min(p * 2, 1)),
    lilac: .14 + .7 * Math.sin(Math.PI * p) ** 2,
    pink: .12 + .68 * smooth(Math.max(0, p * 2 - 1))
  };
}
