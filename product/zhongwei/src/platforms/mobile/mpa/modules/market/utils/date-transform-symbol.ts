export const dateTransformSymbol = (time:string, symbol:string) :string => {
  if (!time) return time;
  return `${time}`.replace(/-/g, symbol);
};
