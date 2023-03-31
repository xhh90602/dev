import { getUrlParam } from '@/utils';
import Tabs from '@mobile/components/tabs/tabs';
import { useEffect, useMemo, useRef, useState } from 'react';
import EntrustTable from '@mobile/components/entrust-table/entrust-table';
import DateIntervalModal from '@mobile/components/date-interval-modal/date-interval-modal';
import FilterModal from '@mobile/components/filter-modal/filter-modal';
import IconSvg from '@mobile/components/icon-svg';

import { formatToString } from '@/utils/date';
import './order-list.scss';
import { useResetState, useSetState } from 'ahooks';
import dayjs from 'dayjs';
import { FormattedMessage } from 'react-intl';
import { PageType, openNewPage } from '@/platforms/mobile/helpers/native/msg';

const commodity = [{
  label: <FormattedMessage id="all" />,
  key: 'all',
}, {
  label: <FormattedMessage id="all_make_bargain" />,
  key: '3',
}, {
  label: <FormattedMessage id="part_make_bargain" />,
  key: '2',
}, {
  label: <FormattedMessage id="already_revoke" />,
  key: '4',
}, {
  label: <FormattedMessage id="order_fail" />,
  key: '6',
}];

const tradeDirection = [
  {
    label: <FormattedMessage id="all" />,
    key: 'all',
  },
  {
    label: <FormattedMessage id="buying" />,
    key: 'B',
  },
  {
    label: <FormattedMessage id="sale" />,
    key: 'S',
  },
];

enum ORDER_TYPE {
  ENTRUST = 'entrust',
  HISTORY = 'history'
}

function getActive() {
  const {
    active = ORDER_TYPE.ENTRUST,
  } = getUrlParam() as { active: string };
  return active;
}

const orderType = [
  {
    title: <FormattedMessage id="await_make_bargain_order" />,
    key: ORDER_TYPE.ENTRUST,
  },
  {
    title: <FormattedMessage id="history_order" />,
    key: ORDER_TYPE.HISTORY,
  },
];

const OrderList = () => {
  const [activeKey, setActiveKey] = useState(getActive());

  const [dateRange, setDateRange] = useSetState({
    startDate: new Date((new Date().getTime() - (30 - 1) * 24 * 60 * 60 * 1000)),
    endDate: new Date(),
  });
  const [visible, setVisible] = useState(false);

  const tabChange = (key) => {
    setActiveKey(key);
    setVisible(false);
    setFilterVisible(false);
  };

  const [filterVisible, setFilterVisible] = useState(false);
  const [filterForm, setFilterForm, resetFilterForm] = useResetState({
    status: 'all',
    bs: 'all',
  });

  const filterList = [
    {
      label: <FormattedMessage id="state" />,
      key: 'commodity',
      list: commodity,
      value: filterForm.status,
      onChange: ({ key }) => {
        setFilterForm({
          ...filterForm,
          status: key,
        });
      },
    },
    {
      label: <FormattedMessage id="trade_direction" />,
      key: 'tradeDirection',
      list: tradeDirection,
      value: filterForm.bs,
      onChange: ({ key }) => {
        setFilterForm({
          ...filterForm,
          bs: key,
        });
      },
    },
  ];

  const [historyReqBody, setHistoryReqBody] = useSetState<any>({
    bs: filterForm.bs === 'all' ? undefined : filterForm.bs,
    status: filterForm.status === 'all' ? undefined : filterForm.status,
    startDate: dayjs(dateRange.startDate).format('YYYY-MM-DD'),
    endDate: dayjs(dateRange.endDate).format('YYYY-MM-DD'),
  });

  useEffect(() => {
    setHistoryReqBody({
      startDate: dayjs(dateRange.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(dateRange.endDate).format('YYYY-MM-DD'),
    });
  }, [dateRange]);
  const filterLabel = useMemo(
    () => (
      historyReqBody.bs && historyReqBody.status ? 'filter_result' : 'all_order'),
    [historyReqBody],
  );

  const tableRef = useRef<HTMLDivElement>(null);

  return (
    <div styleName="order-list">
      {/* tab栏 */}
      <Tabs
        activeKey={activeKey}
        list={orderType}
        onChange={tabChange}
        className="bold-bg basic-card"
        styleName="tab"
      />
      {/* 历史订单搜索 */}
      {
        activeKey === ORDER_TYPE.HISTORY && (
          <div className="m-b-20" styleName="search-form">
            <div
              styleName="date"
              className={`search-form-btn ${visible ? 'orange-border' : ''}`}
              onClick={() => {
                setVisible(!visible);
                setFilterVisible(false);
              }}
            >
              <span className="f-bold">
                {formatToString(dateRange.startDate, 'dd/MM/yyyy')}
              </span>
              <span styleName="middle" className="t-desc">
                <FormattedMessage id="to" />
              </span>
              <span className="f-bold">
                {formatToString(dateRange.endDate, 'dd/MM/yyyy')}
              </span>
              <span className={`arrow ${visible ? 'arrow-active' : ''}`} />
            </div>
            <div
              styleName="order"
              className={`search-form-btn f-bold ${filterVisible ? 'orange-border' : ''}`}
              onClick={() => {
                setVisible(false);
                setFilterVisible(!filterVisible);
              }}
            >
              <FormattedMessage id={filterLabel} />
              <span className={`arrow ${filterVisible ? 'arrow-active' : ''}`} />
            </div>

            <div
              className="search-form-btn"
              onClick={() => {
                openNewPage({
                  path: 'global_search',
                  pageType: PageType.NATIVE,
                });
              }}
            >
              <IconSvg path="icon_search" />
            </div>
          </div>
        )
      }
      {/* 表格 */}
      <div styleName="card-table" ref={tableRef}>
        <FilterModal
          container={tableRef.current}
          filterList={filterList}
          visible={filterVisible}
          onReset={() => {
            resetFilterForm();
          }}
          onOk={() => {
            setHistoryReqBody({
              bs: filterForm.bs === 'all' ? undefined : filterForm.bs,
              status: filterForm.status === 'all' ? undefined : filterForm.status,
            });
            setFilterVisible(false);
          }}
          onClose={() => {
            setFilterForm({
              bs: filterForm.bs ? 'all' : filterForm.bs,
              status: filterForm.status ? 'all' : filterForm.status,
            });
            setFilterVisible(false);
          }}
        />
        <DateIntervalModal
          container={tableRef.current}
          defalutKey="1month"
          start={dateRange.startDate}
          end={dateRange.endDate}
          max={new Date()}
          onCancel={() => {
            setVisible(false);
          }}
          onOk={(r) => {
            console.log(r);
            setDateRange({
              startDate: r.startTime,
              endDate: r.endTime,
            });
            setVisible(false);
          }}
          visible={visible}
        />
        {
          activeKey === ORDER_TYPE.ENTRUST && (
            <EntrustTable
              type="today"
              templateCode="order-entrust"
              wrapperPadding={['0.3rem', '0.3rem']}
            />
          )
        }
        {
          activeKey === ORDER_TYPE.HISTORY && (
          <EntrustTable
            type="history"
            wrapperPadding={['0.3rem', '0.3rem']}
            historyReqBody={historyReqBody}
          />
          )
        }
      </div>
    </div>
  );
};

export default OrderList;
