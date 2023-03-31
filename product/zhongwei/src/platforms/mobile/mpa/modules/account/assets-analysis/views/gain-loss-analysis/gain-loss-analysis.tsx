import BasicCard from '@/platforms/mobile/components/basic-card/basic-card';
import Tabs from '@/platforms/mobile/components/tabs/tabs';
import { CURRENCY_TYPE } from '@/platforms/mobile/constants/config';
import { sliceString } from '@/utils';
import { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import ProfitLossTable from '../../components/profit-loss-table/profit-loss-table';
import './gain-loss-analysis.scss';

const GainLossAnalysis = () => {
  const { formatMessage } = useIntl();
  const tabList = [
    {
      title: formatMessage({ id: 'hk_stocks' }),
      key: CURRENCY_TYPE.HKD,
      children: null,
    },
    {
      title: formatMessage({ id: 'us_stocks' }),
      key: CURRENCY_TYPE.USD,
      children: null,
    },
    {
      title: formatMessage({ id: 'shsz_stocks' }),
      key: CURRENCY_TYPE.CNY,
      children: null,
    },
  ];
  const [currency, setCurrency] = useState(CURRENCY_TYPE.HKD);
  const [riseIncome, setRiseIncome] = useState([
    {
      stockName: '阿里巴巴',
      stockCode: '099882',
      income: 35243.23,
    },
    {
      stockName: '阿里巴巴',
      stockCode: '099882',
      income: 35243.23,
    },
    {
      stockName: '阿里巴巴',
      stockCode: '099882',
      income: 35243.23,
    },
    {
      stockName: '阿里巴巴',
      stockCode: '099882',
      income: 35243.23,
    },
    {
      stockName: '阿里巴巴',
      stockCode: '099882',
      income: 35243.23,
    },
  ]);
  const [fallIncome, setfallIncome] = useState([
    {
      stockName: '阿里巴巴',
      stockCode: '099882',
      income: -35243.23,
    },
    {
      stockName: '阿里巴巴',
      stockCode: '099882',
      income: -35243.23,
    },
    {
      stockName: '阿里巴巴',
      stockCode: '099882',
      income: -35243.23,
    },
    {
      stockName: '阿里巴巴',
      stockCode: '099882',
      income: -35243.23,
    },
    {
      stockName: '阿里巴巴',
      stockCode: '099882',
      income: -35243.23,
    },
  ]);
  return (
    <div styleName="gain-loss-analysis" className="flex-stretch-t flex-column">
      <Tabs
        className="center-tab"
        activeKey={currency}
        list={tabList}
        onChange={(v) => {
          setCurrency(v as CURRENCY_TYPE);
        }}
      />
      <BasicCard>
        <div className="f-s-26 color-basic">
          <FormattedMessage id="total_revenue" />
          <span className="num-font">
            (
            {currency}
            )
          </span>
        </div>
        <div className="num-font f-s-38 color-basic f-bold m-t-10">{sliceString(134123.23, { sign: true })}</div>
        <div className="flex-c-between m-t-20">
          <span className="color-assist f-s-24 m-r-15">
            <FormattedMessage id="total_earnings" />
          </span>
          <span className="color-rise f-s-30 flex-1 num-font">{sliceString(134123.23, { sign: true })}</span>
          <span className="color-assist f-s-24 m-r-15">
            <FormattedMessage id="total_earnings" />
          </span>
          <span className="color-fall f-s-30 num-font">{sliceString(-134123.23, { sign: true })}</span>
        </div>
        <div className="f-s-24 color-remark m-t-20">
          <FormattedMessage id="data_extent" />
          ：2022/02/01~2022/09/21
        </div>
      </BasicCard>
      <div className="color-basic f-s-32 f-bold">
        <FormattedMessage id="profit_and_loss_ranking" />
      </div>
      <div className="flex-c-between">
        <BasicCard className="rise-income-card flex-1">
          <div className="color-rise f-s-28 f-bold">
            <FormattedMessage id="profit_top5" />
          </div>
          {riseIncome.map((item) => (
            <div key={item.stockCode} className="flex-c-between m-t-25">
              <div>
                <div className="f-s-24">{item.stockName}</div>
                <div className="num-font color-assist f-s-22">{item.stockCode}</div>
              </div>
              <div className="num-font f-s-26">{sliceString(item.income, { sign: true })}</div>
            </div>
          ))}
        </BasicCard>
        <BasicCard className="fall-income-card flex-1">
          <div className="color-fall f-s-28 f-bold">
            <FormattedMessage id="loss_top5" />
          </div>
          {fallIncome.map((item) => (
            <div key={item.stockCode} className="flex-c-between m-t-25">
              <div>
                <div className="f-s-24">{item.stockName}</div>
                <div className="num-font color-assist f-s-22">{item.stockCode}</div>
              </div>
              <div className="num-font f-s-26">{sliceString(item.income, { sign: true })}</div>
            </div>
          ))}
        </BasicCard>
      </div>
      <div styleName="full-width-bottom-box" className="flex-1">
        <div className="f-s-32 f-bold m-b-20">
          <FormattedMessage id="profit_and_loss_detail" />
        </div>
        <ProfitLossTable
          showDataKeys={[
            'stockName',
            'income',
            'totalRise',
            'positionMarkerValue',
            'totalInAccountPrice',
            'totalOutAccountPrice',
            'tradeFee',
          ]}
        />
      </div>
    </div>
  );
};

export default GainLossAnalysis;
