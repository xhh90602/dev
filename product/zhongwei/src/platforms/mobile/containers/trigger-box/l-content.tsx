import { TRADE_ORDER_TYPE } from '@/constants/trade';
import { TRIGGER_L_OPTION, TRIGGER_L_TYPE } from '@/constants/trigger-trade';
import { Grid, Popover } from 'antd-mobile';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { add, floatNumStr, mul, strToNumber, sub } from '@/utils';
import { toFixed } from '@dz-web/o-orange';
import { getClassNameByPriceChange } from '@dz-web/quote-client';
import CountInput from '@mobile/components/count-input/count-input';
import Tabs from '@mobile/components/tabs/tabs';

import './trigger-box.scss';

const currentPriceList = [
  {
    text: <FormattedMessage id="newest_price" />, // '最新价',
    key: 'nowPrice',
    id: TRIGGER_L_TYPE.N,
  },
  {
    text: <FormattedMessage id="last_closing_price" />, // '昨收价',
    key: 'prevClose',
    id: TRIGGER_L_TYPE.Y,
  },
  {
    text: <FormattedMessage id="opening_price" />, // '开盘价',
    key: 'openPrice',
    id: TRIGGER_L_TYPE.O,
  },
  {
    text: <FormattedMessage id="cose_price" />, // '成本价',
    key: 'costPrice',
    id: TRIGGER_L_TYPE.C,
  },
];

const lTabList = [
  { title: <FormattedMessage id="rise" />, key: TRIGGER_L_OPTION.U },
  { title: <FormattedMessage id="lower" />, key: TRIGGER_L_OPTION.D },
];

interface IContent {
  bs: TRADE_ORDER_TYPE,
  priceInfo: any;
  setlRatio: (v: string | number) => void;
  setLType: (v: string | number) => void;
  lRatio: any;
  lType: string;
  lOption: TRIGGER_L_OPTION;
  setLOption: (v: string) => void;
  setExecutePrice: (v: string) => void;
  setLTypePrice: (v) => void;
  setLPrice: (v) => void;
}

const LContent = (props: IContent) => {
  const {
    bs,
    lRatio,
    setlRatio,
    lType,
    priceInfo,
    setLType,
    lOption,
    setLOption,
    setExecutePrice,
    setLTypePrice,
    setLPrice,
  } = props;

  const { formatMessage } = useIntl();

  const [f, setF] = useState(false);

  const currentPrice = useMemo(() => currentPriceList.find((v) => v.id === lType)?.key || 'nowPrice', [lType]);

  const price = useMemo(() => priceInfo[currentPrice] ?? 0, [priceInfo, currentPrice]);

  const currentPriceNode = useMemo(
    () => currentPriceList.find((v) => currentPrice === v.key)?.text || <FormattedMessage id="newest_price" />,
    [currentPrice],
  );

  const [countPrice, setCountPrice] = useState<string | number>(0);

  useEffect(() => {
    const cp = lOption === TRIGGER_L_OPTION.U
      ? toFixed(mul(add(1, lRatio / 100), price))
      : toFixed(mul(sub(1, lRatio / 100), price));
    console.log('🚀 ~ file: l-content.tsx:80 ~ useEffect ~ price', price);
    setLTypePrice(toFixed(price));
    setLPrice(cp);
    setExecutePrice(cp);
    setCountPrice(cp);
  }, [lRatio, lOption, price]);

  return (
    <div styleName="l-content">
      <Grid styleName="padding" columns={10}>
        <Grid.Item span={4} styleName="label">
          <FormattedMessage id="distance" />
        </Grid.Item>
        <Grid.Item span={6} styleName="content">
          <div className="t-r">
            <Popover.Menu
              actions={currentPriceList
                .filter((item) => (bs === TRADE_ORDER_TYPE.BUY ? item.key !== 'costPrice' : true))
                .map((c) => ({
                  ...c,
                  text: <div className={c.key === currentPrice ? 't-normal' : ''}>{c.text}</div>,
                }))}
              placement="bottom"
              onAction={(node: any) => {
                setLType(node.id);
              }}
              trigger="click"
            >
              <div>
                <span styleName="select-text">
                  {currentPriceNode}
                  {` (${price ? toFixed(price) : '--'})`}
                </span>
                <span className="arrow" />
              </div>
            </Popover.Menu>
          </div>
        </Grid.Item>
      </Grid>
      <div className="line" />
      <Grid styleName="padding-end" columns={13}>
        <Grid.Item span={5}>
          <Tabs
            styleName="padding-tab"
            className="bold-bg basic-card"
            list={lTabList}
            activeKey={lOption}
            onChange={(v) => {
              setLOption(v);
            }}
          />
        </Grid.Item>
        <Grid.Item span={8}>
          <div className="t-r">
            <div
              styleName="grid-input m-t-10"
              className={getClassNameByPriceChange(lOption === TRIGGER_L_OPTION.U ? 1 : -1)}
            >
              <CountInput
                size={32}
                weight="bold"
                placeholder={formatMessage({ id: 'min_unit' })}
                value={f ? lRatio : `${lRatio}%`}
                plus={() => {
                  const value = add(strToNumber(lRatio), 1);
                  if (value >= 100) return;
                  setlRatio(value);
                }}
                minus={() => {
                  setlRatio(sub(strToNumber(lRatio), 1));
                }}
                change={(v) => {
                  const value = v.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1') || 0;

                  if (!v) {
                    setlRatio(0);
                    return;
                  }

                  setlRatio(floatNumStr(Number(value) >= 99.99 ? 99.99 : value));
                }}
                focus={() => {
                  setF(true);
                }}
                blur={() => {
                  setF(false);
                  setlRatio(strToNumber(lRatio));
                }}
              />
              <div styleName="price-text" className="t-desc">
                <FormattedMessage id="trigger_price_2" />
                &nbsp;&nbsp;
                {countPrice || '--'}
              </div>
            </div>
          </div>
        </Grid.Item>
      </Grid>
    </div>
  );
};

export default LContent;
