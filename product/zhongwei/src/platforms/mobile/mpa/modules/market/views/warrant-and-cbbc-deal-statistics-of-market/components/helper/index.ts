export function getState(val: number): string {
  if (val >= 0 && val <= 0.6) return 'normal';
  if (val >= 0.6 && val <= 0.9) return 'high';
  if (val >= 0.9 && val <= 1) return 'extremelyHigh';

  return 'unknown';
}
