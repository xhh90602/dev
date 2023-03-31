import { webViewTouch } from '@/platforms/mobile/helpers/native/register';
import { isRollTop } from '@/platforms/mobile/helpers/native/msg';
import { identifyIosSystem } from '@mobile/mpa/modules/market/utils/identify-ios-system';

export default function webViewScoll(dom :any) :any {
  return webViewTouch((res) => {
    const { t, oldt } = res;
    console.log(t, '<--t', oldt, '<--oldt');
    const { scrollTop, scrollHeight: scH, clientHeight: cH } = dom;
    if (identifyIosSystem && scH <= cH) {
      isRollTop().then((r) => {
        console.log(r);
      });
    }
    if (scrollTop === 0 && (t > 0)) {
      isRollTop().then((r) => {
        console.log(r);
      });
    }
  });
}
