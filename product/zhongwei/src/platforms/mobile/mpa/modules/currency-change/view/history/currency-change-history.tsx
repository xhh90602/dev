import './currency-change-history.scss';
import { useMemo, useRef, useState } from 'react';
import { useResetState } from 'ahooks';
import TableList from '@/platforms/mobile/components/table-list/table-list';
import DateIntervalModal from '@/platforms/mobile/components/date-interval-modal/date-interval-modal';
import { CheckCircleFill, CloseCircleFill } from 'antd-mobile-icons';
import { sliceString } from '@/utils/num';
import PopupSelector from '../../components/popup-selector/popup-selector';

import { currencyList } from '../index/currency-change';

const now = new Date();

const statusList = [
  {
    label: '全部',
    key: 'all',
  },
  {
    label: '已兑换',
    key: '1',
  },
  {
    label: '兑换处理中',
    key: '2',
  },
  {
    label: '兑换处理失败',
    key: '3',
  },
];
const CurrencyChangeHistory = () => {
  const [startTime, setStartTime] = useState(now);
  const [endTime, setEndTime] = useState(now);
  const [dateVisible, setDateVisible] = useState(false);

  const [statusVisable, setStatusVisable] = useState(false);
  const [status, setStatus, resetStatus] = useResetState(statusList[0].key);

  const [currencyVisable, setCurrencyVisable] = useState(false);
  const [currency, setCurrency, resetCurrency] = useResetState('all');

  const hasFilterModal = useMemo(() => [dateVisible, statusVisable, currencyVisable].some((v) => v === true), [
    dateVisible,
    statusVisable,
    currencyVisable,
  ]);

  const filterList = [
    {
      name: '全部时间',
      width: '2.76rem',
      onclick: () => {
        if (hasFilterModal) return;
        setDateVisible(!dateVisible);
      },
    },
    {
      name: '全部状态',
      onclick: () => {
        if (hasFilterModal) return;
        setStatusVisable(!statusVisable);
      },
    },
    {
      name: '全部币种', // 仅买入币种
      onclick: () => {
        if (hasFilterModal) return;
        setCurrencyVisable(!currencyVisable);
      },
    },
  ];

  const cloumn = [
    {
      label: <div className="padding-th-column">方向</div>,
      dataKey: 'buyCurrency',
      align: 'left',
      width: '20%',
      render: ({ rowData }) => (
        <div styleName="cell-item direction">
          {rowData.sellCurrency}
          兑
          {rowData.buyCurrency}
        </div>
      ),
    },
    {
      label: <div className="padding-th-column">卖出金额</div>,
      dataKey: 'sellPrice',
      align: 'right',
      width: '30%',
      render: ({ rowData }) => (
        <div className="num-font" styleName="cell-item">
          {sliceString(rowData.sellPrice)}
          {rowData.sellCurrency}
        </div>
      ),
    },
    {
      label: <div className="padding-th-column">买入金额</div>,
      dataKey: 'buyPrice',
      align: 'right',
      width: '30%',
      render: ({ rowData }) => (
        <div className="num-font" styleName="cell-item">
          {sliceString(rowData.buyPrice)}
          {rowData.buyCurrency}
        </div>
      ),
    },
    {
      label: <div className="padding-th-column">状态</div>,
      dataKey: 'status',
      align: 'right',
      width: '20%',
      render: ({ rowData }) => (
        <div styleName="cell-item" style={{ color: rowData.status ? 'var(--rise-color)' : 'var(--fail-color)' }}>
          {rowData.status === 1 && <CheckCircleFill />}
          {rowData.status === 3 && <CloseCircleFill />}
          &nbsp;
          {statusList.find((item) => item.key === rowData.status.toString())?.label}
        </div>
      ),
    },
  ];

  const data = [
    {
      sellCurrency: 'HKD',
      buyCurrency: 'USD',
      sellPrice: '32145646',
      buyPrice: '1233',
      status: 1,
    },
    {
      sellCurrency: 'HKD',
      buyCurrency: 'USD',
      sellPrice: '32145646',
      buyPrice: '1233',
      status: 1,
    },
  ];

  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div styleName="container">
      <div styleName="popup-selector">
        {filterList.map((item) => (
          <div
            key={item.name}
            styleName="popup-selector-btn"
            style={{ width: item.width || '' }}
            onClick={item.onclick}
          >
            {item.name}
          </div>
        ))}
      </div>
      <div ref={contentRef} styleName="content">
        <DateIntervalModal
          container={contentRef.current}
          selectListKey={['today', '1week', '1month']}
          start={startTime}
          end={endTime}
          visible={dateVisible}
          onCancel={() => {
            setDateVisible(false);
          }}
          onOk={(r) => {
            setStartTime(r.startTime);
            setEndTime(r.endTime);
            setDateVisible(false);
          }}
        />
        <PopupSelector
          title="交易状态"
          selected={status}
          visable={statusVisable}
          list={statusList}
          onConfirm={(value) => {
            if (value !== status) setStatus(value);
            setStatusVisable(false);
          }}
          onReset={() => {
            resetStatus();
            setStatusVisable(false);
          }}
          onClose={() => {
            setStatusVisable(false);
          }}
        />
        <PopupSelector
          title="币种"
          selected={currency}
          visable={currencyVisable}
          list={[{ label: '全部', key: 'all' }].concat(currencyList)}
          onConfirm={(value) => {
            if (value !== status) setCurrency(value);
            setCurrencyVisable(false);
          }}
          onReset={() => {
            resetCurrency();
            setCurrencyVisable(false);
          }}
          onClose={() => {
            setCurrencyVisable(false);
          }}
        />
        <TableList wrapperPadding={['0.3rem', '0.3rem']} data={data} columns={cloumn} />
      </div>
    </div>
  );
};

export default CurrencyChangeHistory;
