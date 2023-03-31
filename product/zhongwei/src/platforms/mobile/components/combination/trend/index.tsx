import React, { memo, useState, useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import { getCombiYieIdCurve } from '@/api/module-api/combination';
import LineChart from '@/platforms/mobile/components/combination/lineChart';

import './index.scss';

const Trend: React.FC<any> = memo((props: any) => {
  const { portfolioId } = props;
  const { formatMessage } = useIntl();
  const [dateType, setDateType] = useState('1');
  const [data, setData] = useState<any>(null);

  const timer = useRef<any>(null);

  const hsTrendTabs = [
    {
      name: formatMessage({ id: 'nearly_a_week' }),
      type: '0',
    },
    {
      name: formatMessage({ id: 'nearly_a_month' }),
      type: '1',
    },
    {
      name: formatMessage({ id: 'nearly_march' }),
      type: '2',
    },
    {
      name: formatMessage({ id: 'created_so_far' }),
      type: '3',
    },
  ];

  // 数据格式化
  const chartFormat = (li) => {
    const temp: any = [];
    li.forEach((item: any, index) => {
      const obj: any = {};
      const date: any = [];
      const value: any = [];
      if (item.yieldCurveVOList && item.yieldCurveVOList.length) {
        item.yieldCurveVOList.forEach((ele: any) => {
          value.push(+(ele.profitRatio * 100).toFixed(2));
          if (index === 0) {
            date.push(ele.settlementDate);
          }
        });
        obj.name = formatMessage({ id: `zs${item.benchmarkIndex}` });
        obj.date = date;
        obj.value = value;
        temp.push(obj);
      }
    });
    return temp;
  };

  // 获取收益走势数据
  const getCombiDetailYieIdCurve = () => {
    getCombiYieIdCurve({
      portfolioId,
      dateType,
    }).then((res: any) => {
      if (res && res.code === 0 && res?.result) {
        setData(chartFormat(res.result));
      }
    });
  };

  const Interval = () => {
    setInterval(() => {
      getCombiDetailYieIdCurve();
    }, 300000);
  };

  useEffect(() => {
    clearInterval(timer.current);
    if (portfolioId) {
      getCombiDetailYieIdCurve();
      if (dateType === '0') {
        Interval();
      }
    }
    return () => {
      clearInterval(timer.current);
    };
  }, [portfolioId, dateType]);

  return (
    <div styleName="warp">
      <div styleName="title">{formatMessage({ id: 'income_trend' })}</div>
      <ol styleName="hs-tabs">
        {hsTrendTabs.map((item) => (
          <li
            key={item.type}
            onClick={() => setDateType(item.type)}
            styleName={`hs-tabs-item ${item.type === dateType ? 'hs-tabs-item--active' : ''}`}
          >
            {item.name}
          </li>
        ))}
      </ol>
      <LineChart data={(data && data) || []} title={`${formatMessage({ id: 'cumulative_yield' })}(%)`} />
    </div>
  );
});

export default Trend;
