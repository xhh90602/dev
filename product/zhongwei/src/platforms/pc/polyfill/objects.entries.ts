/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-bitwise */
export default function polyfillObjectEntries() {
  const allowedTypes = ['[object String]', '[object Object]', '[object Array]', '[object Function]'];

  Object.entries = Object.entries
    ? Object.entries
    : function entries(obj: any) {
      const arr: [string, any][] = [];
      const objType = typeof obj;
      if (!~allowedTypes.indexOf(objType)) {
        return [];
      }

      // eslint-disable-next-line guard-for-in
      for (const key in obj) {
        arr.push([key, obj[key]]);
      }
      return arr;
    };
}
