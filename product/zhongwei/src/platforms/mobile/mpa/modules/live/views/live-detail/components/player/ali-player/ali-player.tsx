import * as React from 'react';
import { recordSkinLayout } from './skin-layout';

const {
  useEffect,
  // useState,
  useRef,
} = React;

interface IProps {
  containerId,
  videoInfo,
}

const ALiPlayer: React.FC<IProps> = (props) => {
  const { containerId, videoInfo } = props;
  const player = useRef<any>(null);
  const { Aliplayer } = window;

  useEffect(() => {
    if (!containerId) return undefined;
    if (!Aliplayer) return undefined;
    let container;
    container = document.getElementById(containerId);
    const { width } = container.getBoundingClientRect();
    const isLive = !!videoInfo.playStreamUrl;
    const defaultConfig = {
      id: containerId,
      source: isLive ? videoInfo.playStreamUrl : videoInfo.recordedUrl,
      width,
      height: '100%',
      autoplay: true,
      isLive,
      rePlay: false,
      playsinline: true,
      preload: true, // 播放器自动加载
      language: 'zh-cn',
      controlBarVisibility: 'hover',
      useH5Prism: true,
      skinLayout: isLive ? [
        {
          name: 'bigPlayButton',
          align: 'cc',
        },
        {
          name: 'controlBar',
          align: 'blabs',
          x: 0,
          y: 0,
          children: [
            {
              name: 'liveDisplay',
              align: 'tlabs',
              x: 15,
              y: 7,
            },
            {
              name: 'fullScreenButton',
              align: 'tr',
              x: 10,
              y: 13,
            },
            {
              name: 'volume',
              align: 'tr',
              x: 5,
              y: 10,
            },
          ],
        },
      ] : recordSkinLayout,
    };
    // setConfig({ ...defaultConfig });
    player.current = new Aliplayer({ ...defaultConfig }, ((ins) => {
      console.log('ins===>', ins);
    }));
    return () => {
      container = null;
      player.current.dispose();
    };
  }, [containerId, videoInfo, Aliplayer]);

  return (
    <div id={containerId} />
  );
};

export default ALiPlayer;
