import TableList from '@mobile/components/table-list/table-list';

import './profit-loss-table.scss';
import useGetWidth from '@/hooks/useGetWidth';
import { memo, useState } from 'react';
import NoMessage from '@/platforms/mobile/components/no-message/no-message';
import { FormattedMessage, useIntl } from 'react-intl';
import { setColumn, setSingleValColItem } from './helper/table-column';

const columns = [
  setColumn({
    label: [<FormattedMessage id="name" />, <FormattedMessage id="code" />],
    align: 'left',
    dataKey: 'stockName',
    render: (props) => (
      <div>
        {setSingleValColItem('stockName', { className: 'f-bold', size: 26 })(props)}
        {setSingleValColItem('stockCode', { className: 'color-desc', size: 24 })(props)}
      </div>
    ),
  }),
  setColumn({
    label: <FormattedMessage id="profit_loss_amount" />,
    dataKey: 'income',
    sortable: true,
    colItemProps: {
      riseFullColor: true,
    },
  }),
  setColumn({
    label: <FormattedMessage id="yield" />,
    dataKey: 'incomeRatio',
    sortable: true,
    colItemProps: {
      riseFullColor: true,
      suffix: '%',
    },
  }),
  setColumn({
    label: <FormattedMessage id="first_day_gain" />,
    dataKey: 'firstIncome',
    sortable: true,
    colItemProps: {
      thousands: true,
    },
  }),
  setColumn({
    label: <FormattedMessage id="successful_signing_status" />,
    dataKey: 'winningStatus',
    render: ({ rowData }) => {
      const map = [
        { name: <FormattedMessage id="win_ballot" />, val: 1 },
        { name: <FormattedMessage id="failed_win_bid" />, val: 0 },
      ];
      const suffix = rowData.winningStatus === 1 ? (
        <>
          10
          <FormattedMessage id="stock" />
        </>
      ) : '';
      return setSingleValColItem('winningStatus', { map, suffix })({ rowData });
    },
  }),
  setColumn({
    label: <FormattedMessage id="position_status" />,
    dataKey: 'positionStatus',
    render: ({ rowData }) => {
      const map = [
        { name: <FormattedMessage id="stock_cleared" />, val: 1 },
        { name: <FormattedMessage id="position" />, val: 2 },
      ];
      const { winningStatus, positionStatus } = rowData;
      const text = '--';
      if (winningStatus === 1) {
        const suffix = winningStatus === 1 && positionStatus === 2 ? (
          <>
            10
            <FormattedMessage id="stock" />
          </>
        ) : '';
        return setSingleValColItem('positionStatus', { map, suffix })({ rowData });
      }
      return text;
    },
  }),
  setColumn({
    label: <FormattedMessage id="days_held" />,
    dataKey: 'holdDays',
    sortable: true,
    colItemProps: {
      thousands: true,
    },
  }),
  setColumn({
    label: <FormattedMessage id="issue_price" />,
    dataKey: 'issuePrice',
    sortable: true,
    colItemProps: {
      thousands: true,
    },
  }),
  setColumn({
    label: <FormattedMessage id="average_selling_price" />,
    dataKey: 'averageSellPrice',
    sortable: true,
    colItemProps: {
      thousands: true,
    },
  }),
  setColumn({
    label: <FormattedMessage id="lot_winning_rate" />,
    dataKey: 'winningRatio',
    sortable: true,
    colItemProps: {
      suffix: '%',
    },
  }),
  setColumn({
    label: <FormattedMessage id="multiple_of_subscription" />,
    dataKey: 'buyMultiple',
    sortable: true,
    colItemProps: {
      thousands: true,
    },
  }),
  setColumn({
    label: <FormattedMessage id="method_of_Subscription" />,
    dataKey: 'buyStatus',
    render: ({ rowData }) => {
      const map = [
        { name: <FormattedMessage id="cash_subscription" />, val: 0 },
        { name: <FormattedMessage id="finan_subscription" />, val: 1 },
      ];
      return setSingleValColItem('buyStatus', { map })({ rowData });
    },
  }),
  setColumn({
    label: <FormattedMessage id="cumulative_amount_of_account_entry" />,
    dataKey: 'totalInAccountPrice',
    sortable: true,
    colItemProps: {
      thousands: true,
    },
  }),
  setColumn({
    label: <FormattedMessage id="accumulated_disbursement_amount" />,
    dataKey: 'totalOutAccountPrice',
    sortable: true,
    colItemProps: {
      thousands: true,
    },
  }),
  setColumn({
    label: <FormattedMessage id="transaction_cost" />,
    dataKey: 'tradeFee',
    sortable: true,
    colItemProps: {
      thousands: true,
    },
  }),
];
interface IProps {
  showDataKeys: string[];
}

const ProfitLossTable = (props: IProps) => {
  const { showDataKeys } = props;
  const { domRef } = useGetWidth();
  const [data, setData] = useState([
    {
      stockName: '阿里巴巴-W',
      stockCode: '09988',
      income: 13102.22, // 盈亏金额
      positionMarkerValue: 100000, // 持仓市值
      totalRise: 10000, // 总盈利
      totalFull: 10000, // 总亏损
      incomeRatio: 4.58, // 收益率
      firstIncome: 1234, // 首日涨幅
      actualIncome: 1234, // 暗盘涨幅
      winningStatus: 1, // 中签状态
      positionStatus: 2, // 持仓状态
      holdDays: 1234, // 持有天数
      issuePrice: 1234, // 发行价
      averageSellPrice: 1234, // 平均卖出价
      winningRatio: 10.11, // 中签率
      buyMultiple: 123, // 申购倍数
      buyStatus: 1, // 认购方式
      totalInAccountPrice: 1234, // 累计入账金额
      totalOutAccountPrice: 1234, // 累计出账金额
      tradeFee: 1234, // 交易费用
    },
  ]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="swiper-no-swiping" ref={domRef}>
      <TableList
        data={data}
        isLoading={loading}
        hiddenBox={<NoMessage />}
        columns={columns.filter((col) => showDataKeys.includes(col.dataKey))}
        colClassName="padding-column color-text f-s-28"
        colTitleClassName="padding-column"
      />
    </div>
  );
};

export default memo(ProfitLossTable);
