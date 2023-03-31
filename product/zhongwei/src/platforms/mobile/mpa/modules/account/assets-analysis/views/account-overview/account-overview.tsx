import DateIntervalModal from '@/platforms/mobile/components/date-interval-modal/date-interval-modal';
import IconArrowDown from '@mobile/images/icon_arrow_down.svg';
import BasicCard from '@/platforms/mobile/components/basic-card/basic-card';
import Tabs from '@mobile/components/tabs/tabs';
import useGetCapital from '@/hooks/trade/use-get-capital';
import { CURRENCY_TYPE } from '@/platforms/mobile/constants/config';
import { Popover } from 'antd-mobile';
import { memo, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import dayjs from 'dayjs';
import { sliceString } from '@/utils';
import { random } from 'lodash-es';
import './account-overview.scss';
import BorrowingBalanceCharts from '@mobile/components/borrowing-balance';
import CurrencyDom from '@mobile/components/currency-dom/currency-dom';
import PieChart from '../../components/pieChart';
import LineChart from '../../components/lineChart';

const now = dayjs();

const weekList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const colors = ['#FAB02F', '#80E09B', '#7879F1', '#EA8749', '#529AF3', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'];
/** 行情/股票分布 */
const BusinessStocks = memo(() => {
  const { formatMessage } = useIntl();

  const tabList = [
    {
      title: <FormattedMessage id="industrial_distribution" />,
      key: 'business',
      children: null,
    },
    {
      title: <FormattedMessage id="distribution_of_stock_rights" />,
      key: 'stocks',
      children: null,
    },
  ];

  const [active, setActive] = useState('business');

  const dataFormat = () => {
    const temp: any = [];
    return [
      { value: 10, name: formatMessage({ id: 'cash' }) },
      { value: 40, name: formatMessage({ id: 'consumption_sector' }) },
      { value: 20, name: formatMessage({ id: 'oil_and_gas' }) },
      { value: 15, name: formatMessage({ id: 'precious_metal' }) },
      { value: 5, name: formatMessage({ id: 'new_energy' }) },
    ];
  };
  return (
    <BasicCard>
      <Tabs
        className="center-tab"
        activeKey={active}
        list={tabList}
        onChange={(v) => {
          setActive(v);
        }}
      />
      <div styleName="hs-trend-box">
        <div styleName="hs-trend-chart">
          <PieChart data={dataFormat() || []} />
        </div>
        <div styleName="hs-trend-list">
          <div styleName="hs-trend-list-box">
            {dataFormat().map((item, idx) => (
              <div styleName="item" key={item.name}>
                <div styleName="stock-name-box">
                  <span style={{ backgroundColor: colors[idx] }} />
                  <div styleName="stock-name">{item.name}</div>
                </div>
                <div styleName="stock-ratio">{`${((item.value / 100) * 100).toFixed(0)}%`}</div>
                <div styleName="stock-value">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BasicCard>
  );
});

/** 借款金额 */
const BorrowingBalance = memo((props: { currency: string; moneyInfo: Record<string, any> }) => {
  const { currency, moneyInfo } = props;
  const [value, setValue] = useState(30);

  return (
    <BasicCard styleName="borrowing-balance">
      <div className="flex-c-between">
        <div className="f-s-28 color-text">
          <FormattedMessage id="borrowing_balance" />
          <span className="num-font">
            (
            {currency}
            )
          </span>
        </div>
        <div className="f-s-34 f-bold num-font color-basic">{moneyInfo.debtAmount}</div>
      </div>
      <BorrowingBalanceCharts />
    </BasicCard>
  );
});

/** 收益率走势 */
const YieldTrend = memo((props: { rangeDate: string[]; currency: string }) => {
  const { rangeDate, currency } = props;
  const data = () => {
    const temp = [...Array(10)];
    return [
      { name: '测试1', value: temp.map((v) => random(-100, 100)), date: temp.map((v, i) => i + 1) },
      { name: '测试2', value: temp.map((v) => random(-100, 100)), date: temp.map((v, i) => i + 1) },
      { name: '测试3', value: temp.map((v) => random(-100, 100)), date: temp.map((v, i) => i + 1) },
      { name: '测试4', value: temp.map((v) => random(-100, 100)), date: temp.map((v, i) => i + 1) },
    ];
  };
  return (
    <BasicCard>
      <div className="f-s-32 f-bold color-basic m-b-20">
        <FormattedMessage id="yield_trend" />
      </div>
      <div className="flex-c-between f-s-24 color-assist">
        <span>

          <FormattedMessage id="accumulated_income" />
          (
          {currency}
          )
        </span>
        <span>
          <FormattedMessage id="yield" />

        </span>
      </div>
      <div className="flex-c-between f-s-34 color-rise num-font">
        <span>{sliceString(24256.23, { sign: true })}</span>
        <span>
          {sliceString(23.75, { sign: true })}
          %
        </span>
      </div>
      <LineChart data={data()} />
    </BasicCard>
  );
});

/** 总资产走势 */
const TotalAssetTrend = memo((props: { rangeDate: string[]; currency: string; moneyInfo: Record<string, any> }) => {
  const { rangeDate, currency, moneyInfo } = props;
  const data = () => {
    const temp = [...Array(10)];
    return [
      { name: '测试1', value: temp.map((v) => random(-100, 100)), date: temp.map((v, i) => i + 1) },
      { name: '测试2', value: temp.map((v) => random(-100, 100)), date: temp.map((v, i) => i + 1) },
      { name: '测试3', value: temp.map((v) => random(-100, 100)), date: temp.map((v, i) => i + 1) },
      { name: '测试4', value: temp.map((v) => random(-100, 100)), date: temp.map((v, i) => i + 1) },
    ];
  };
  return (
    <BasicCard>
      <div className="f-s-32 f-bold color-basic m-b-20">
        <FormattedMessage id="trend_of_total_assets" />

        <span className="num-font f-s-26 color-assist m-l-10">
          {now.format('YYYY/MM/DD')}
          &nbsp;
          <FormattedMessage id={weekList[now.format('d')]} />
        </span>
      </div>
      <div className="f-s-24 color-assist num-font">

        <FormattedMessage id="total_assets" />
        (
        {currency}
        )
      </div>
      <div className="flex-c-between f-s-34 num-font">
        <span>{sliceString(moneyInfo.totalAsset)}</span>
      </div>
      <LineChart data={data()} />
    </BasicCard>
  );
});

const AccountOverview = () => {
  const { formatMessage } = useIntl();

  const currencyList = [
    {
      label: formatMessage({ id: 'HKD' }),
      key: CURRENCY_TYPE.HKD,
    },
    {
      label: formatMessage({ id: 'CNY' }),
      key: CURRENCY_TYPE.CNY,
    },
    {
      label: formatMessage({ id: 'USD' }),
      key: CURRENCY_TYPE.USD,
    },
  ];

  const [currency, setCurrency] = useState(currencyList[1]);
  const moneyInfo = useGetCapital(currency.key);

  const tabList = [
    {
      title: <FormattedMessage id="today" />,
      key: 'today',
      children: null,
    },
    {
      title: <FormattedMessage id="Last_5_days" />,
      key: '5day',
      children: null,
    },
    {
      title: <FormattedMessage id="Last_1_month" />,
      key: '1month',
      children: null,
    },
    {
      title: <FormattedMessage id="Year_to_date" />,
      key: 'year',
      children: null,
    },
    {
      title: <FormattedMessage id="total_revenue" />,
      key: 'all',
      children: null,
    },
    {
      title: <img style={{ width: '0.2rem', verticalAlign: 'middle' }} src={IconArrowDown} alt="" />,
      key: 'custom',
      children: null,
      onClick: () => {
        console.log(123);
      },
    },
  ];

  const [active, setActive] = useState('today');
  const [dateVisible, setDateVisible] = useState(false);
  const [rangeDate, setRangeDate] = useState<string[]>([now.format('YYYY-MM-DD'), now.format('YYYY-MM-DD')]);

  return (
    <div styleName="account-overview">
      <BasicCard>
        <div className="flex-c-between">
          <div className="f-s-28 color-text">
            <FormattedMessage id="total_assets" />
            <Popover.Menu
              actions={currencyList.map((v) => ({
                text: <CurrencyDom currency={v.key} text={v.label + v.key} />,
                key: v.key,
                onClick: () => {
                  setCurrency(v);
                },
              }))}
              placement="bottom"
              trigger="click"
            >
              <span className="num-font">
                (
                {currency.key}
                )
                <span className="arrow" />
              </span>
            </Popover.Menu>
          </div>
          <div className="f-s-34 f-bold num-font color-basic">{sliceString(moneyInfo.totalAsset)}</div>
        </div>
      </BasicCard>
      <BusinessStocks />
      <BorrowingBalance currency={currency.key} moneyInfo={moneyInfo} />
      <Tabs
        activeKey={active}
        list={tabList}
        onChange={(v) => {
          if (v === 'custom') {
            setDateVisible(!dateVisible);
          } else {
            setActive(v);
          }
        }}
      />
      <YieldTrend rangeDate={rangeDate} currency={currency.key} />
      <TotalAssetTrend rangeDate={rangeDate} currency={currency.key} moneyInfo={moneyInfo} />

      <DateIntervalModal
        selectListKey={[]}
        start={new Date(rangeDate[0])}
        end={new Date(rangeDate[1])}
        visible={dateVisible}
        onCancel={() => {
          setDateVisible(false);
        }}
        onOk={(r) => {
          setActive('custom');
          setRangeDate([r.startTime, r.endTime].map((time) => dayjs(time).format('YYYY-MM-DD')));
          setDateVisible(false);
        }}
      />
    </div>
  );
};

export default AccountOverview;
