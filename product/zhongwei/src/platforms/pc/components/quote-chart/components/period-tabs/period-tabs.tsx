import React, { useState, useMemo, useRef } from 'react';
import { WeightType } from 'quote-ws-client-for-dz';
import ClassNames from 'classnames';
import { useIntl } from 'react-intl';
import type { Stock } from 'quote-ws-client-for-dz';
import { Dropdown, Menu } from 'antd';
import {
  getPeriodList, Period, PeriodType, IPeriodList,
  concatPeriodType, hyphen, getCandleModle, periodTypeDict,
} from '../../constant/period';

import './period-tabs.scss';

interface IProps extends Stock {
  periodType: string;
  period: Period;
  candleModle: WeightType;
  changePeriodType: (periodType: PeriodType) => void;
  changePeriod: (period: Period) => void;
  changeCandleModle: (v: WeightType) => void;
}

interface ISelectPeriodExtra {
  parentKey?: string,
}

const Chart: React.FC<IProps> = (props) => {
  const {
    periodType, period,
    candleModle, changeCandleModle,
  } = props;
  const intl = useIntl();

  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([concatPeriodType(periodType, period)]);

  const selectedCandleModleList: string[] = useMemo(() => [String(candleModle)], [candleModle]);
  const candleModleList = useMemo(() => getCandleModle(intl.formatMessage), []);
  const periodList = useMemo<IPeriodList[]>(() => getPeriodList(intl.formatMessage), []);
  const selectedPeriod = useMemo<string>(() => selectedPeriods[0], [selectedPeriods]);
  const selectCandleModeText = useMemo(() => {
    const target = candleModleList.find((item) => item.key === candleModle);
    return target?.label;
  }, [candleModle, candleModleList]);

  const nestStructureSelectedText = useRef<string>('');

  const onSelectPeriod = (info: any, extra: ISelectPeriodExtra = {}) => {
    const { parentKey } = extra;

    const { changePeriodType, changePeriod } = props;
    const [type, nextPeriod] = info.key.split(hyphen);

    nestStructureSelectedText.current = parentKey ? info.domEvent.target.innerText : '';
    setSelectedPeriods([parentKey || info.key]);
    changePeriodType(type);
    changePeriod(nextPeriod);
  };

  const onSelectCandleMode = (info) => {
    changeCandleModle(info.key);
  };

  return (
    <ul styleName="list">
      {
        periodList.map((item) => (
          <li
            key={item.key}
            styleName={ClassNames('items', {
              'items-active': item.key === selectedPeriod,
            })}
            onClick={() => !item.children && onSelectPeriod({ key: item.key })}
          >
            {
              item.children
                ? (
                  <Dropdown
                    overlay={(
                      <Menu
                        items={item.children}
                        selectedKeys={selectedPeriods}
                        onClick={(info: any) => onSelectPeriod(info, { parentKey: item.key })}
                      />
                    )}
                    placement="bottom"
                    arrow
                  >
                    <span styleName="dropdown-items">
                      {nestStructureSelectedText.current || item.label}
                    </span>
                  </Dropdown>
                )
                : item.label
            }
          </li>
        ))
      }

      {
        periodType === periodTypeDict.k
        && (
          <li styleName="items">
            <Dropdown
              overlay={(
                <Menu
                  items={candleModleList}
                  selectedKeys={selectedCandleModleList}
                  onClick={onSelectCandleMode}
                />
              )}
              placement="bottom"
              arrow
            >
              <span styleName="dropdown-items-candle-modle">
                {selectCandleModeText}
              </span>
            </Dropdown>
          </li>
        )
      }
    </ul>
  );
};

export default Chart;
