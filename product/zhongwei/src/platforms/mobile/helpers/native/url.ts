import bridge from './bridge';

const { getInstance } = bridge;

enum PageType {
  NATIVE, // 原生页面
  HTML, // H5页面
  PDF, // PDF
}
enum NativePages {
  LOGIN = 'login', // 登陆页面
  HOME = 'home', // 首页
  QUOTE_SEARCH = 'quote_search', // 搜索页
}

interface IParams {
  title?: string; // 标题
  fullScreen?: boolean; // 是否为全屏 WebView
  height?: number; // 页面高度
  pageType: PageType; // 页面类型
  path: string; // 页面地址
  replace?: boolean; // 是否关闭当前视图
  data?: boolean; // 传递给下个页面的数据
}

const nativeFun = (path: string, replace: boolean, fullScreen: boolean) => {
  if (process.env.NODE_ENV === 'production') {
    getInstance().call.view('PAGE_OPEN', {
      pageType: PageType.HTML,
      path,
      replace,
      fullScreen,
    });
  } else {
    window.location.href = path;
  }
};

/**
 * 打开搜索股票页面
 * @param data
 */
export const openStockSearch = (data: { marketList?: number[]; callbackEvent: string }) => {
  const params: any = {};

  if (data.marketList && data.marketList.length) {
    params.marketList = data.marketList;
  }

  if (data.callbackEvent) {
    params.callbackEvent = data.callbackEvent;
  }

  getInstance().call.view('PAGE_OPEN', {
    pageType: PageType.NATIVE,
    path: NativePages.QUOTE_SEARCH,
    data: params,
  });
};

/**
 *  拼接url地址
 * @param url 跳转的pathname
 * @returns
 */
export const joinUrl = (url: string) => {
  const { origin, pathname } = window.location;
  const newPathname = pathname.split('/');
  const { length } = newPathname;
  newPathname[length - 1] = url;
  return origin + newPathname.join('/');
};

export function nativeOpenPage(html: string, replace = false, fullScreen = false): void {
  const location = joinUrl(html);
  nativeFun(location, replace, fullScreen);
}

export function joinExternalUrl(baseUrl: string, replace = false, fullScreen = false) {
  return (html: string) => {
    nativeFun(baseUrl + html, replace, fullScreen);
  };
}

export const nativeOpenDeposit = joinExternalUrl('');
