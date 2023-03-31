/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-bitwise */
export default function polyfillObjectValues() {
  Object.values = Object.values
    ? Object.values
    : function values(obj: any) {
      const allowedTypes = ['[object String]', '[object Object]', '[object Array]', '[object Function]'];
      const objType = Object.prototype.toString.call(obj);

      if (obj === null || typeof obj === 'undefined') {
        throw new TypeError('Cannot convert undefined or null to object');
      } else if (!~allowedTypes.indexOf(objType)) {
        return [];
      } else {
        // if ES6 is supported
        if (Object.keys) {
          return Object.keys(obj).map((key) => obj[key]);
        }

        const result: any[] = [];
        for (const prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            result.push(obj[prop]);
          }
        }

        return result;
      }
    };
}
