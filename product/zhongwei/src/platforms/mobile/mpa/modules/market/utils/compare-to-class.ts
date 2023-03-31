export function compareToClass(value: any): 'raise' | 'decline' | undefined {
  const val = parseFloat(value);
  if (val > 0) return 'raise';
  if (val < 0) return 'decline';
  return undefined;
}
