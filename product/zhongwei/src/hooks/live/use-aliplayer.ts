import { useEffect } from 'react';
import { loadScript } from './utils';
// 动态引入aliplayer的js文件
export default function useAliplayer(): void {
  useEffect(() => {
    const scriptSrc = 'https://g.alicdn.com/de/prismplayer/2.11.0/aliplayer-min.js';
    loadScript(scriptSrc).then(() => {
      console.log('aliplayer loaded');
    });
  }, []);
}
