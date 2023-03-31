import React, { useState, useMemo, useRef, useContext } from 'react';
import ClassNames from 'classnames';
import { useIntl } from 'react-intl';
import { isUSSymbol, isIndexSymbol, US_INTRADAY_TYPE, KLineAdjMode } from '@dz-web/quote-client';
import { Dropdown } from 'antd-mobile';

import { quoteChartContext } from '../../contexts/quote-chart';
import {
  getPeriodList, Period, PeriodType, IPeriodList,
  concatPeriodType, hyphen, getCandleModle, periodTypeDict,
  getUSIntradayTypeList, timePeriodDict,
} from '../../constant/period';

import './period-tabs.scss';

interface IProps {
  changePeriodType: (periodType: PeriodType) => void;
  changePeriod: (period: Period) => void;
  changeCandleModle: (v: KLineAdjMode) => void;
  setUSIntradayType: (v: US_INTRADAY_TYPE) => void;
}

interface ISelectPeriodExtra {
  parentKey?: string,
}

const PeriodTabs: React.FC<IProps> = (props) => {
  const {
    changeCandleModle,
    setUSIntradayType,
  } = props;
  const { formatMessage } = useIntl();

  const {
    market: marketId, periodType, period, candleModle, USIntradayType,
  } = useContext(quoteChartContext);
  const isUS = useMemo(() => isUSSymbol(marketId), [marketId]);
  const isIndex = useMemo(() => isIndexSymbol(marketId), [marketId]);
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([concatPeriodType(periodType, period)]);

  const selectedCandleModleList: string[] = useMemo(() => [String(candleModle)], [candleModle]);
  const candleModleList = useMemo(() => getCandleModle(formatMessage), []);

  const USIntradayTypeList = useMemo(() => getUSIntradayTypeList(formatMessage), []);
  const USIntradayTypeText = useMemo(() => {
    const target = USIntradayTypeList.find((item) => item.key === USIntradayType);
    return target?.label;
  }, [USIntradayType, USIntradayTypeList]);

  const periodList = useMemo<IPeriodList[]>(() => getPeriodList(formatMessage), []);
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

  console.log(periodType, period, selectedPeriods, selectedPeriod, '<-- periodType, period');

  const onSelectCandleMode = (info) => {
    changeCandleModle(info.key);
  };

  const onSelectUSIntraday = (info) => {
    setUSIntradayType(info.key);
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
              // <Dropdown
              //   overlay={(
              //     <Menu
              //       items={item.children}
              //       selectedKeys={selectedPeriods}
              //       onClick={(info: any) => onSelectPeriod(info, { parentKey: item.key })}
              //     />
              //   )}
              //   placement="bottom"
              // >
              //   <span styleName="dropdown-items">
              //     {nestStructureSelectedText.current || item.label}
              //   </span>
              // </Dropdown>

                  <Dropdown>
                    <Dropdown.Item key="sorter" title={nestStructureSelectedText.current || item.label}>
                      <div>
                        排序内容
                        <br />
                        排序内容
                        <br />
                        排序内容
                        <br />
                        排序内容
                        <br />
                      </div>
                    </Dropdown.Item>
                  </Dropdown>
                )
                : item.label
            }
          </li>
        ))
      }

      {/* {
        (periodType === periodTypeDict.k && !isIndex)
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
            >
              <span>
                {selectCandleModeText}
              </span>
            </Dropdown>
          </li>
        )
      }

      {
        (isUS && period === timePeriodDict.one_day && !isIndex) && (
          <li styleName="items">
            <Dropdown
              overlay={(
                <Menu
                  items={USIntradayTypeList}
                  selectedKeys={selectedCandleModleList}
                  onClick={onSelectUSIntraday}
                />
              )}
              placement="bottom"
            >
              <span>
                {USIntradayTypeText}
              </span>
            </Dropdown>
          </li>
        )
      } */}
    </ul>
  );
};

export default PeriodTabs;
