const rootFontSize = document.documentElement.style.fontSize;

export function remToPx(rem = 1): number {
  return Math.round((Number.parseInt(rootFontSize, 10) / 100) * (rem * 100));
}
