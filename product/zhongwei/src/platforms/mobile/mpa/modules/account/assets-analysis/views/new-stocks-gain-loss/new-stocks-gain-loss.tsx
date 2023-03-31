import BasicCard from '@/platforms/mobile/components/basic-card/basic-card';
import { CURRENCY_TYPE } from '@/platforms/mobile/constants/config';
import { sliceString } from '@/utils';
import { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import iconMore from '@mobile/images/icon_zh_more.svg';
import ProfitLossTable from '../../components/profit-loss-table/profit-loss-table';
import PieChart from '../../components/pieChart';
import './new-stocks-gain-loss.scss';

const GainLossAnalysis = () => {
  const { formatMessage } = useIntl();
  const [currency, setCurrency] = useState(CURRENCY_TYPE.HKD);
  const pieColors1 = ['#2F9BFA', '#EAEDF7'];
  const pieColors2 = ['#06B899', '#DA070E'];
  const pieData1 = () => {
    const temp: any = [];
    return [
      { value: 3, name: formatMessage({ id: 'win_ballot' }), label: { show: true } },
      { value: 3, name: formatMessage({ id: 'failed_win_bid' }) },
    ];
  };
  const pieData2 = () => {
    const temp: any = [];
    return [
      { value: 246245.22, name: formatMessage({ id: 'profit' }), label: { show: true } },
      { value: 24500.22, name: formatMessage({ id: 'loss' }) },
    ];
  };
  return (
    <div styleName="new-stocks-gain-loss" className="flex-stretch-t flex-column">
      <BasicCard>
        <div className="f-s-26 flex-c-between">
          <div className="color-basic">
            <FormattedMessage id="total_revenue" />
            <span className="num-font">
              (
              {currency}
              )
            </span>
          </div>
          <div className="color-assist">
            <FormattedMessage id="yield" />
          </div>
        </div>
        <div className="flex-c-between f-bold num-font f-s-36 m-t-20">
          <span className="color-basic">{sliceString(134123.23, { sign: true })}</span>
          <span className="color-rise">
            {sliceString(123.23, { sign: true })}
            %
          </span>
        </div>
        <div className="f-s-24 color-remark m-t-20">
          <FormattedMessage id="data_extent" />
          ：2022/02/01~2022/09/21
        </div>
      </BasicCard>
      <div className="flex-c-between">
        <span className="color-basic f-s-32 f-bold">
          <FormattedMessage id="subscription_analysis" />
        </span>
        <span className="f-s-26 color-desc">
          <FormattedMessage id="subscription_history" />
          {' '}
          <img width={5} src={iconMore} alt="" />
        </span>
      </div>
      <BasicCard className="flex-c-between">
        <div className="flex-1">
          <div className="color-basic f-s-30 f-bold t-c">
            <FormattedMessage id="lot_winning_rate" />
          </div>
          <div styleName="pie-chart-box">
            <PieChart data={pieData1()} radius={['60%', '100%']} top="10" bottom="0" colors={pieColors1} />
          </div>
          <div styleName="pie-chart-hint">
            {pieData1().map((item, i) => (
              <div key={item.name} className="flex-c-between color-basic">
                <span styleName="dot" className="m-r-10" style={{ background: pieColors1[i] }} />
                <span className="flex-1">{item.name}</span>
                <span className="num-font">
                  {item.value}
                  次
                </span>
              </div>
            ))}
          </div>
        </div>
        <div styleName="pie-box-split-line" />
        <div className="flex-1">
          <div className="color-basic f-s-30 f-bold t-c">
            <FormattedMessage id="new_win_rate" />
          </div>
          <div styleName="pie-chart-box">
            <PieChart data={pieData2()} radius={['60%', '100%']} top="10" bottom="0" colors={pieColors2} />
          </div>

          <div styleName="pie-chart-hint">
            {pieData2().map((item, i) => (
              <div key={item.name} className="flex-c-between color-basic">
                <span styleName="dot" className="m-r-10" style={{ background: pieColors2[i] }} />
                <span className="flex-1">{item.name}</span>
                <span className="num-font">{sliceString(i > 0 ? -item.value : item.value, { sign: true })}</span>
              </div>
            ))}
          </div>
        </div>
      </BasicCard>
      <div styleName="full-width-bottom-box" className="flex-1">
        <div className="f-s-32 f-bold m-b-20">
          <FormattedMessage id="profit_and_loss_detail" />
        </div>
        <ProfitLossTable
          showDataKeys={[
            'stockName',
            'income',
            'incomeRatio',
            'firstIncome',
            'winningStatus',
            'positionStatus',
            'holdDays',
            'issuePrice',
            'averageSellPrice',
            'winningRatio',
            'buyMultiple',
            'buyStatus',
          ]}
        />
      </div>
    </div>
  );
};

export default GainLossAnalysis;
