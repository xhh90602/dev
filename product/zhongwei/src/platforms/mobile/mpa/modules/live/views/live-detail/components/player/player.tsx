import * as React from 'react';

import AliPlayer from './ali-player/ali-player';

import { videoTypeEnum } from './types';

const { useMemo, useEffect } = React;

const playerDict = {
  [videoTypeEnum.ali]: AliPlayer,
  [videoTypeEnum.tencent]: AliPlayer,
  [videoTypeEnum.gensee]: AliPlayer,
};

interface IProps {
  containerId: string,
  videoInfo: any;
}

const Players: React.FC<IProps> = (props) => {
  const { containerId, videoInfo } = props;

  const Player = useMemo(() => {
    if (!videoInfo.platformType) return null;

    return playerDict[videoInfo.platformType];
  }, [containerId, videoInfo.platformType, videoInfo]);

  return (
    <div>
      {
        Player
        && (
        <Player
          containerId={containerId}
          videoInfo={videoInfo}
        />
        )
      }
    </div>
  );
};

export default Players;
