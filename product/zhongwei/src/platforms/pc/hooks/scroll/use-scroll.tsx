import { useEffect, useRef } from 'react';

/**
 * 滚动到底部触发事件的hook
 * @param listDomRef 绑定滚动事件的dom节点的ref
 * @param callback 滚动到底部时执行的callback
 * @param reactionDistance 距离底部的触发距离，默认为0
 */
const useScrollToBottomHook = (listDomRef: any, callback: () => void, reactionDistance = 0) => {
  const timerRef: any = useRef(null);
  useEffect(() => {
    const currentDom = listDomRef.current;
    const handleScroll = (e: any) => {
      clearTimeout(timerRef.current);
      const start = e.target.scrollTop + e.target.offsetHeight;
      const end = e.target.scrollHeight;
      if (start === end) {
        timerRef.current = setTimeout(() => {
          callback();
        }, 300);
      }
    };
    currentDom?.addEventListener('scroll', handleScroll);
    return () => {
      currentDom?.removeEventListener('scroll', handleScroll);
    };
  }, [callback, reactionDistance, listDomRef]);
};

export default useScrollToBottomHook;
