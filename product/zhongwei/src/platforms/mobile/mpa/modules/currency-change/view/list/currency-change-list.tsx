import DateIntervalModal from '@/platforms/mobile/components/date-interval-modal/date-interval-modal';
import FilterModal from '@/platforms/mobile/components/filter-modal/filter-modal';
import NoMessage from '@/platforms/mobile/components/no-message/no-message';
import TableList, { ITableItemColumns } from '@/platforms/mobile/components/table-list/table-list';
import { CURRENCY_TYPE } from '@/platforms/mobile/constants/config';
import { formatToString } from '@/utils/date';
import { useSetState } from 'ahooks';
import { useMemo, useRef, useState } from 'react';
import './currency-change-list.scss';

const currencyList = [
  {
    label: '全部币种',
    key: 'all',
  },
  {
    label: '港币',
    key: CURRENCY_TYPE.HKD,
  },
  {
    label: '人民币',
    key: CURRENCY_TYPE.CNY,
  },
  {
    label: '美元',
    key: CURRENCY_TYPE.USD,
  },
];

const statusList = [
  {
    label: '全部状态',
    key: 'all',
  },
  {
    label: '状态1',
    key: '1',
  },
  {
    label: '状态2',
    key: '2',
  },
];

const now = new Date();

const itemCommon = {
};

const itemColumns:ITableItemColumns[] = [
  {
    label: '方向',
    align: 'left',
    dataKey: 's',
    render: () => (<div styleName="filter-list-card-item" className="f-bold f-s-26">港币兑美元</div>),
    width: '25%',
  },
  {
    label: '卖出金额',
    align: 'right',
    dataKey: 'ss',
    render: () => (<div styleName="filter-list-card-item" className="f-s-26">232,435.33HKD</div>),
    width: '30%',
  },
  {
    label: '买入金额',
    align: 'right',
    dataKey: 'sss',
    render: () => (<div styleName="filter-list-card-item">100.21USD</div>),
    width: '25%',
  },
  {
    label: '状态',
    align: 'right',
    dataKey: 'ssss',
    render: () => (<div styleName="filter-list-card-item">已兌換</div>),
    width: '15%',
  },
];

const CurrencyChangeList = () => {
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterStatusVisible, setFilterStatusVisible] = useState(false);
  const [filterForm, setFilterForm] = useSetState({
    status: statusList[0],
    currency: currencyList[0],
  });

  const [startTime, setStartTime] = useState(now);
  const [endTime, setEndTime] = useState(now);
  const [visible, setVisible] = useState(false);

  const openModal = (type = 'status') => {
    const typeObj = {
      status: filterStatusVisible,
      time: visible,
      currency: filterVisible,
    };

    setFilterStatusVisible(type === 'status' ? !typeObj.status : false);
    setFilterVisible(type === 'currency' ? !typeObj.currency : false);
    setVisible(type === 'time' ? !typeObj.time : false);
  };

  const filterStatusList = [{
    label: '状态',
    list: statusList,
    value: filterForm.status.key,
    onChange: (v) => {
      setFilterForm({ status: v });
    },
  },
  ];

  const filterCurrencyList = [
    {
      label: '币种',
      list: currencyList,
      value: filterForm.currency.key,
      onChange: (v) => {
        setFilterForm({ currency: v });
      },
    },
  ];

  const filterList = useMemo(() => {
    if (filterStatusVisible) return filterStatusList;
    return filterCurrencyList;
  }, [filterStatusVisible, filterVisible, filterForm]);

  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div styleName="page">
      <div className="m-20-0" styleName="filter-box">
        <div styleName="time-filter" onClick={() => openModal('time')}>
          指定时间
          <span className="arrow" />
        </div>
        <div styleName="currency-filter" onClick={() => openModal()}>
          {filterForm.status.label}
          <span className="arrow" />
        </div>
        <div styleName="currency-filter" onClick={() => openModal('currency')}>
          {filterForm.currency.label}
          <span className="arrow" />
        </div>
      </div>
      <div ref={contentRef} style={{ position: 'relative' }} styleName="list-card">
        <FilterModal
          container={contentRef.current}
          filterList={filterList}
          visible={filterVisible || filterStatusVisible}
          onReset={() => {
            setFilterVisible(false);
            setFilterStatusVisible(false);
          }}
          onOk={(data) => {
            setFilterVisible(false);
            setFilterStatusVisible(false);
          }}
          onClose={() => {
            setFilterVisible(false);
            setFilterStatusVisible(false);
          }}
        />
        <DateIntervalModal
          container={contentRef.current}
          start={startTime}
          end={endTime}
          onCancel={() => {
            setVisible(false);
          }}
          onOk={(r) => {
            console.log(r);

            setStartTime(r.startTime);
            setEndTime(r.endTime);
            setVisible(false);
          }}
          visible={visible}
        />
        <TableList
          data={[{}, {}]}
          columns={itemColumns.map((v) => ({ ...itemCommon, ...v }))}
          hiddenBox={<NoMessage />}
          wrapperPadding={[0, 37]}
        />
      </div>
    </div>
  );
};

export default CurrencyChangeList;
