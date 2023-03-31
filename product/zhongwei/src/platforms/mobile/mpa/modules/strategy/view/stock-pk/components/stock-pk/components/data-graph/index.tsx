import React, { memo, useState, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import Chart from '@/platforms/mobile/mpa/modules/strategy/components/chart';
import Empty from '@/platforms/mobile/components/combination/empty';
import Loading from '@/platforms/mobile/components/combination/loading';
import TitleCard from '../title-card';
import './index.scss';

const DataGraph: React.FC<any> = memo((props: any) => {
  const {
    list,
    stockList = [],
    isLoading,
    colors,
    legend,
    selectItem = null,
    chartCycle = null,
    setCycle = () => null,
  } = props;
  const [open, setOpen] = useState(true);
  const [data, setData] = useState<any>([]);
  const { formatMessage } = useIntl();

  useEffect(() => {
    let temp: any = [];
    if (list && list.length && selectItem) {
      const { echartType } = selectItem;
      if (echartType === 'line') {
        list.forEach((item) => {
          temp.push(item?.lds || 0);
        });
      } else {
        temp = [...list];
      }
    }
    if (JSON.stringify(temp) !== JSON.stringify(data)) {
      setData([...temp]);
    }
  }, [list]);

  const hsTrendTabs = [
    {
      name: formatMessage({ id: 'nearly_a_month' }), // 近一月
      type: '1M',
    },
    {
      name: formatMessage({ id: 'nearly_march' }), // 近三月
      type: '3M',
    },
    {
      name: formatMessage({ id: 'last_six_months' }), // 近6月
      type: '6M',
    },
    {
      name: formatMessage({ id: 'nearly_year' }), // 近1年
      type: '1Y',
    },
    {
      name: formatMessage({ id: 'last_march_year' }), // 近3年
      type: '3Y',
    },
  ];

  const names = useMemo(() => (stockList.map((item) => item.name)), [stockList]);

  const tipDom = useMemo(() => {
    if (isLoading) {
      return (
        <div styleName="loading">
          <Loading text="" />
        </div>
      );
    }
    if (!isLoading && !data.length) {
      return (
        <div styleName="empty-box">
          <Empty type="strategy" />
        </div>
      );
    }
    return null;
  }, [data]);

  return (
    <div styleName="data-graph">
      <div styleName="data-graph-box">
        <div styleName="graph-box">
          <TitleCard
            showText
            title={(selectItem && selectItem?.name) || ''}
            open={open}
            showTitle={stockList && stockList.length}
            setOpen={(bool) => setOpen(bool)}
          />
          {
            tipDom
          }
          {
            open && selectItem && selectItem.echartType === 'line' && (
              data && data.length ? (
                <>
                  <Chart
                    type="closPrice"
                    data={data}
                    selectItem={selectItem}
                    names={names}
                    colors={colors}
                    legend={legend}
                  />
                  <div styleName="switch-condition">
                    <ol styleName="hs-tabs">
                      {hsTrendTabs.map((item) => (
                        <li
                          key={item.type}
                          onClick={() => setCycle(item.type)}
                          styleName={`hs-tabs-item ${item.type === chartCycle ? 'hs-tabs-item--active' : ''}`}
                        >
                          {item.name}
                        </li>
                      ))}
                    </ol>
                  </div>
                </>
              ) : null
            )
          }
          {
            open && selectItem && selectItem.echartType === 'bar' && (
              <>
                {
                  data && data.length ? (
                    <Chart
                      type="turnover"
                      data={data}
                      selectItem={selectItem}
                      names={names}
                      colors={colors}
                      legend={legend}
                    />
                  ) : null
                }
                <p />
              </>
            )
          }
        </div>
      </div>
    </div>
  );
});

export default DataGraph;
