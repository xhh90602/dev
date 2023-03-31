import { useState, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { editUrlParams } from '@/utils/navigate';
import { returnJavaMarket } from '@/utils';
import { COMBINATION_POSITION_ROUTERS } from '@mobile-mpa/modules/combination-position/routers';
import { openNewPage, PageType } from '@mobile/helpers/native/msg';
import {
  marketCodeName,
  currentPriceAndCost,
  positionHeldAvailable,
  opsitionGainAndLoss,
  todayProfitAndLoss,
  marketValue,
  assetsAccountedFor,
  proportionoOfSourceCombination,
  difference,
} from '@mobile-mpa/modules/combination-position/components/table-column/table-column';

import useGetWidth from '@/hooks/useGetWidth';
import TableList from '@mobile/components/table-list/table-list';
import NoMessage from '@mobile/components/no-message/no-message';
import TableExpand from '@mobile-mpa/modules/combination-position/components/table-expand/table-expand';
import './combination-position-table.scss';

interface IProps {
  list: Record<string, any>[];
  pid: number;
}

const ALL_MARKET_CODE = 'ALL';

const CombinationPositionTable: React.FC<IProps> = (props) => {
  const { list = [], pid } = props;

  const { formatMessage } = useIntl();
  const { domRef, expandWidth } = useGetWidth();
  const [currentMarket, setCurrentMarket] = useState<string>(ALL_MARKET_CODE);

  const dataList = useMemo(() => {
    if (currentMarket === ALL_MARKET_CODE) return list;

    return list.filter((item) => returnJavaMarket(item.smallMarket) === currentMarket);
  }, [currentMarket]);

  const getTableExpand = ({ rowData }) => {
    const cfg = [
      {
        styleName: 'buy',
        label: formatMessage({ id: 'buy_text' }),
        handleClick: () => {
          const { id, stockCode, smallMarket } = rowData;
          const route = editUrlParams(
            {
              id,
              pid: String(pid),
              code: stockCode,
              market: smallMarket,
            },
            COMBINATION_POSITION_ROUTERS.COMBINATION_TRADE_BUY,
          );

          return openNewPage({
            replace: false,
            pageType: PageType.HTML,
            path: `combination-position.html#${route}`,
          });
        },
      },
      {
        styleName: 'sell',
        label: formatMessage({ id: 'sell_text' }),
        handleClick: () => {
          const { id, stockCode, smallMarket } = rowData;
          const route = editUrlParams(
            {
              id,
              pid: String(pid),
              code: stockCode,
              market: smallMarket,
            },
            COMBINATION_POSITION_ROUTERS.COMBINATION_TRADE_SELL,
          );

          return openNewPage({
            replace: false,
            pageType: PageType.HTML,
            path: `combination-position.html#${route}`,
          });
        },
      },
      {
        styleName: 'warehouse',
        label: formatMessage({ id: 'warehouse_record' }),
        handleClick: () => {
          const { id, stockName, stockCode, tradeMarket } = rowData;
          const route = editUrlParams(
            {
              id,
              pid: String(pid),
              name: encodeURIComponent(stockName),
              code: stockCode,
              market: tradeMarket,
            },
            COMBINATION_POSITION_ROUTERS.STOCK_WAREHOUSE_RECORD,
          );

          return openNewPage({
            replace: false,
            pageType: PageType.HTML,
            path: `combination-position.html#${route}`,
          });
        },
      },
    ];

    return <TableExpand width={expandWidth} expandCfg={cfg} />;
  };

  return (
    <div styleName="combination-position-table" ref={domRef}>
      <TableList
        data={dataList}
        addDom={getTableExpand}
        hiddenBox={<NoMessage />}
        columns={[
          marketCodeName({ domRef, callback: (code: string) => setCurrentMarket(code) }),
          currentPriceAndCost(),
          positionHeldAvailable(),
          opsitionGainAndLoss(),
          todayProfitAndLoss(),
          marketValue(),
          assetsAccountedFor(),
          proportionoOfSourceCombination(),
          difference(),
        ]}
      />
    </div>
  );
};

export default CombinationPositionTable;
