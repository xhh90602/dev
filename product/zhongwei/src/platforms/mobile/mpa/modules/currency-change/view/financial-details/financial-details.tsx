import './financial-details.scss';
import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import DateIntervalModal from '@/platforms/mobile/components/date-interval-modal/date-interval-modal';
import IconSvg from '@/platforms/mobile/components/icon-svg';
import { sliceString, toThousands } from '@/utils';
import { getFundFlow } from '@/api/module-api/trade';
import { groupBy, sum, toPairs } from 'lodash-es';
import { FormattedMessage, useIntl } from 'react-intl';
import Loading from '@/platforms/mobile/components/loading/loading';
import NoMessage from '@/platforms/mobile/components/no-message/no-message';
import PopupSelector from '../../components/popup-selector/popup-selector';

const now = new Date();
const typeList = [
  {
    label: <FormattedMessage id="all" />,
    key: '',
    icon: '',
  },
  {
    label: <FormattedMessage id="stock_trade" />,
    key: '1',
    icon: 'financial-details/icon_stock_trade',
  },
  {
    label: <FormattedMessage id="money_in_out" />,
    key: '2',
    icon: 'financial-details/icon_crj',
  },
  {
    label: <FormattedMessage id="stock_access" />,
    key: '3',
    icon: '',
  },
  {
    label: <FormattedMessage id="other" />,
    key: '4',
    icon: 'financial-details/icon_other',
  },
];
const ioTypeList = [
  {
    label: <FormattedMessage id="all" />,
    key: '',
  },
  {
    label: <FormattedMessage id="income" />,
    key: 'C',
  },
  {
    label: <FormattedMessage id="expend" />,
    key: 'O',
  },
];

const CurrencyChangeHistory = () => {
  const { formatMessage } = useIntl();

  const [startTime, setStartTime] = useState(now);
  const [endTime, setEndTime] = useState(now);
  const [type, setType] = useState(typeList[0].key);
  const [ioType, setIoType] = useState(ioTypeList[0].key);
  const [visibleType, setVisableType] = useState<'type' | 'state' | 'date' | ''>('');
  const closePopup = () => {
    setVisableType('');
  };

  const filterList = [
    {
      label: <FormattedMessage id="all_business" />,
      onclick: () => {
        setVisableType('type');
      },
    },
    {
      label: <FormattedMessage id="in_out_type" />,
      onclick: () => {
        setVisableType('state');
      },
    },
    {
      label: <FormattedMessage id="all_date" />,
      onclick: () => {
        setVisableType('date');
      },
    },
  ];

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { code, result } = await getFundFlow({
        type,
        ioType,
        startData: dayjs(startTime).format('YYYY-MM-DD'),
        endData: dayjs(endTime).format('YYYY-MM-DD'),
      });
      if (code === 0) {
        const finalData = toPairs(groupBy(
          result.map((item) => ({ ...item, groupDate: dayjs(item.tradeDate).format('YYYY年MM月') })),
          'groupDate',
        )).map((item) => ({
          date: item[0],
          list: item[1],
          income: sum(item[1].map((v) => (v.inType === 'C' ? Math.abs(v.amount) : 0))),
          expend: sum(item[1].map((v) => (v.inType === 'O' ? -Math.abs(v.amount) : 0))),
        }));
        setData(finalData);
      }
    } catch (error) {
      console.log('🚀 ~ file: financial-details.tsx:191 ~ fetchData ~ error', error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
    console.log('🚀 ~ file: financial-details.tsx:123 ~ CurrencyChangeHistory ~ type:', type);
  }, [type, ioType, startTime, endTime]);

  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div styleName="container">
      <div styleName="popup-selector">
        {filterList.map((item) => (
          <div key={item.label.props.id} styleName="popup-selector-btn" onClick={item.onclick}>
            {item.label}
          </div>
        ))}
      </div>
      <div ref={contentRef} styleName="content">
        <DateIntervalModal
          container={contentRef.current}
          selectListKey={['today', '1month', '3month']}
          start={startTime}
          end={endTime}
          visible={visibleType === 'date'}
          onCancel={closePopup}
          onOk={(r) => {
            setStartTime(r.startTime);
            setEndTime(r.endTime);
            closePopup();
          }}
        />
        <PopupSelector
          title={formatMessage({ id: 'trade_state' })}
          selected={type}
          visible={visibleType === 'type'}
          list={typeList}
          onConfirm={(value) => {
            if (value !== type) setType(value);
            closePopup();
          }}
          onClose={closePopup}
        />
        <PopupSelector
          title={formatMessage({ id: 'type' })}
          selected={ioType}
          visible={visibleType === 'state'}
          list={ioTypeList}
          onConfirm={(value) => {
            if (value !== ioType) setIoType(value);
            closePopup();
          }}
          onClose={closePopup}
        />
        <Loading isLoading={loading} bgColor="transparent">
          {data.length === 0 && <NoMessage />}
          {data.map((item) => (
            <>
              <div styleName="card-title">{item.date}</div>
              <div styleName="card-content">
                <div styleName="icome-expend" className="flex-c-between num-font">
                  <span>
                    <FormattedMessage id="flow_in" />
                    ：
                    {toThousands(sliceString(item.income))}
                    HKD
                  </span>
                  <span>
                    <FormattedMessage id="flow_out" />
                    ：
                    {toThousands(sliceString(item.expend))}
                    HKD
                  </span>
                </div>
                {item.list.map((detail) => (
                  <div styleName="detail-item">
                    <span styleName="type-icon">
                      <IconSvg path={
                        typeList.find((s) => s.key === detail.type)?.icon || 'financial-details/icon_other'
                        }
                      />
                    </span>
                    <div styleName="type-detail">
                      <div styleName="type-name">{detail.typeDescription}</div>
                      {detail.stockName}
                      {detail.stockCode}
                      {dayjs(detail.tradeDate).format('MM/DD HH:mm:ss')}
                    </div>
                    <div styleName="price-detail">
                      <div styleName={detail.price > 0 ? 'income' : 'expend'}>
                        {detail.amount > 0 && '+' }
                        {detail.amount < 0 && '-' }
                        {toThousands(sliceString(Math.abs(detail.amount)))}
                        HKD
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ))}
        </Loading>
      </div>
    </div>
  );
};

export default CurrencyChangeHistory;
