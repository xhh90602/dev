/* eslint-disable no-restricted-properties */
import { toFixed, toThousands } from '@/utils';
import { FormattedMessage } from 'react-intl';
import { IFormList } from '../trade-form';
import '../trade-form.scss';

interface ISellPositionNum {
  num?: number;
  costPrice?: number;
  dec?: number;
}

interface IReturn {
  render: IFormList | null;
  [s: string]: any;
}

/** 可卖持仓数量 */
export const sellPositionNum = (props?: ISellPositionNum, isShow?: boolean): IReturn => {
  const { num, costPrice, dec = 2 } = props || {};

  if (!isShow) {
    return {
      rule: {},
      render: null,
    };
  }

  const render = {
    label: (
      <div styleName="desc-num">
        <FormattedMessage id="enable_total_qty" />
        &nbsp;
        {toThousands(num as number)}
      </div>
    ),
    content: (
      <div styleName="desc-num" className="t-r">
        <FormattedMessage id="position_cost" />
        &nbsp;
        {toFixed(costPrice, dec)}
      </div>
    ),
    line: true,
  };

  const rule = {
    isSellMax: (n: StrNumber) => {
      if (!n || window.isNaN(Number(n)) || (num && Number(n) > num)) {
        return false;
      }

      return true;
    },
  };

  return {
    render,
    rule,
  };
};
