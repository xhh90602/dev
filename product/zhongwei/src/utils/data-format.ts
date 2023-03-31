export function numTransform(n: string | number) {
  if (+n) {
    if (+n > 100000) {
      const c = +n / 10000;
      return `${c.toFixed(2)}w`;
    }
    return n;
  }
  return n;
}

// 链接上拼接参数
export function updateQueryStringParameter(uri, key, value) {
  if (!value) return uri;
  const re = new RegExp(`([?&])${key}=.*?(&|$)`, 'i');
  const separator = uri.indexOf('?') !== -1 ? '&' : '?';
  if (uri.match(re)) {
    return uri.replace(re, `$1${key}=${value}$2`);
  }
  return `${uri + separator + key}=${value}`;
}

// 判断净值
export function netValueJudge(val) {
  if (+val) {
    if (+val > 1) {
      return 1;
    }
    if (+val < 1) {
      return -1;
    }
    return 0;
  }
  return 0;
}
