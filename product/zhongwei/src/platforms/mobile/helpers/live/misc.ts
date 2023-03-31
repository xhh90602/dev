import { emojiSourceDict } from './emoji';

type IDetectLoadProcessFn = () => boolean;
type genericFn = () => void;

/**
 * 第三方js加载成功后执行回调
 *
 */
export function detectLoadProcess(
  fn: IDetectLoadProcessFn,
  handler: genericFn,
  interval = 500,
): void {
  const timerd = setInterval(() => {
    if (fn()) {
      clearInterval(timerd);
      handler();
    }
  }, interval);
}

/**
 * 替换消息中的emoji
 *
 */
export function parseMsg(msg): string {
  if (!msg) return '';

  return msg.replaceAll(/\[(.+?)\]/g, (match) => {
    if (match in emojiSourceDict) {
      return `<img class="emoji" src="${emojiSourceDict[match]}"" alt="emoji"/>`;
    }

    return match;
  });
}

function parser(address: string): any {
  // eslint-disable-next-line func-names
  return function (key: string): string {
    const result: any = address.match(new RegExp(`(\\?|\\&)${key}=([^\\&]+)`));
    return result ? result[2] : null;
  };
}

export const parseUrlByHash: any = parser(window.location.hash);

export const parseUrlBySearch: any = parser(window.location.search);

// 预加载theme
export function preSettingTheme(defaultTheme: string): void {
  const theme = parseUrlBySearch('theme') || defaultTheme;

  if (theme) {
    document.documentElement.classList.add(theme);
  }
}
