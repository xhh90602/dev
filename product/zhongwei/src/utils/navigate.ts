/**
 * 跳转页面
 * @param fileName 页面名称
 * @param origin 原地址
 */
export const handleNavigate = (fileName: string, origin?: string) => {
  const ultimatelyOrigin = origin || window.location.origin;

  window.location.href = `${ultimatelyOrigin}${fileName}`;
};

/**
 * 解析url参数
 */
export function getUrlParam(): Record<string, any> {
  const url = window.location.href;
  if (url.lastIndexOf('?') === -1) return {};
  const search = url.slice(url.lastIndexOf('?') + 1);

  if (!search) return {};

  const data = search.split('&');
  const params = {};

  data.forEach((item) => {
    const objMap = item.split('=');
    const name = objMap[0];
    const value = objMap[1];
    params[name] = value;
  });

  return params;
}

export function toUrlParams(obj: Record<string, string>): string {
  const newParam = { ...obj };
  const paramsStr = Object.keys(newParam).reduce((pre, val) => `${pre + val}=${newParam[val] ?? ''}&`, '?');

  return paramsStr.slice(0, paramsStr.length - 1);
}

/**
 * 修改url参数指定key
 *
 * @param rest 覆盖参数
 * @param url 重定向地址
 */
export const editUrlParams = (rest: Record<string, string>, url = '', filterRule = ''): string => {
  if (!url && !filterRule) {
    const { href } = window.location;
    url = href.lastIndexOf('?') > -1 ? href.slice(0, href.lastIndexOf('?')) : window.location.href;
  }

  if (filterRule) {
    url = filterRule;
  }

  const params = getUrlParam() || {};

  try {
    const newParam = { ...params, ...rest };
    const paramsStr = toUrlParams(newParam);

    return url + paramsStr;
  } catch (e) {
    throw new Error(`- editUrlParams function - use error,maybe not params, wrong information is as follows: ${e}`);
  }
};
