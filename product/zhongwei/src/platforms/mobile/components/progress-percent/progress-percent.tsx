/* eslint-disable react/require-default-props */
import { add, div, mul } from '@/utils';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import './progress-percent.scss';

interface IProgressPercent {
  left: number;
  right: number;
  leftText?: string;
  rightText?: string;
  leftColor?: string;
  rightColor?: string;
}

function getFirstLevel(str) {
  if (!str) return 0;
  const arr = str.split(',');
  if (arr.length < 3) {
    console.log('处理的买卖盘数据不为3的倍数');
    return 0;
  }

  const [, volume] = arr;
  return !Number.isNaN(volume) ? Number(volume) : 0;
}

const ProgressPercent = (props: IProgressPercent) => {
  const {
    left = '',
    right = '',
    leftText = 'buy',
    rightText = 'sell',
    leftColor = 'var(--orange-color)',
    rightColor = 'var(--blue-color)',
  } = props;

  const buyvolume = getFirstLevel(left);
  const sellvolume = getFirstLevel(right);

  if (!buyvolume && !sellvolume) return null;
  const total = buyvolume + sellvolume;
  const buywidth = ((buyvolume / total) * 100).toFixed(2);
  const sellwidth = (100 - +buywidth).toFixed(2);

  // const [leftPercent, rightPercent] = useMemo(() => {
  //   const count = add(left, right);
  //   return [
  //     mul(div(left, count), 100).toFixed(),
  //     mul(div(right, count), 100).toFixed(),
  //   ];
  // }, [left, right]);

  return (
    <div styleName="progress-percent">
      <span style={{ color: leftColor }}>
        <FormattedMessage id={leftText} />
        &nbsp;
        {buywidth}
        %
        &ensp;
      </span>
      <div styleName="percent" style={{ '--left': `${buywidth}%` }}>
        <div style={{
          background: leftColor,
          flex: `${buywidth}%`,
        }}
        />
        <div style={{
          background: rightColor,
          flex: `${sellwidth}%`,
        }}
        />
      </div>
      <span style={{ color: rightColor }} className="t-r">
        &ensp;
        {sellwidth}
        %
        &nbsp;
        <FormattedMessage id={rightText} />
      </span>
    </div>
  );
};

export default ProgressPercent;
