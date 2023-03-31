import { useEffect, useState, useMemo } from 'react';
import { Checkbox, Popover, Toast } from 'antd-mobile';
import { useGetState } from 'ahooks';
import {
  querySnapshot,
  QUOTE_CATEGORY_FIELD,
  getClassNameByPriceChange,
  getMarketCategoryTag,
} from '@dz-web/quote-client';
import { useQuoteClient } from '@dz-web/quote-client-react';
import { toPlaceholder, toPositiveSign, toPercent } from '@dz-web/o-orange';
import { toFixedNum } from '@/utils/quote-num';
import { goToSymbolPage, sessionStorageGetItem } from '@mobile/helpers/native/msg';

import TableList, { ITableItemColumns } from '@mobile/components/table-list/table-list';
import NoMessage from '@mobile/components/no-message/no-message';

import { queryFilterStockList } from '@/api/module-api/filter-stock';
import { parseReqParamsObj } from '../../helpers/req';
import { useConditionStore } from '../../model';

import './filter-result.scss';

const generateKey = (item: any) => `${item.marketId}_${item.code}`;

const currency = {
  HK: 'hk',
  US: 'us',
  CN: 'cn',
  SH: 'cn',
  SZ: 'cn',
};
interface FilterResultProps {
  isEdit?: boolean;
  isSelectAll?: boolean;
  isShowFilterResult?: boolean;
  limitSelectStock?: number;
  filterResultCallback: (list: any[]) => void;
}

const FilterResult: React.FC<FilterResultProps> = (props) => {
  const {
    isEdit,
    isSelectAll,
    isShowFilterResult,
    limitSelectStock,
    filterResultCallback,
  } = props;
  const conditionValueList = useConditionStore((state) => state.valueList);
  const conditionLength = useConditionStore((state) => state.valueLength);
  const conditionValue = useConditionStore((state) => state.value);
  const region = useConditionStore((state) => state.region);
  const resultTotal = useConditionStore((state) => state.resultTotal);

  const { wsClient, isWsClientReady } = useQuoteClient();

  const [pageNum, setPageNum] = useState(1);
  const [checkedDict, setCheckedDict] = useState({});
  const [stockList, setStockList, getStockList] = useGetState<any[]>([]);
  const checkIsSelected = (item: any) => !!checkedDict[generateKey(item)];
  const [pkMarket, setPkMarket] = useState<string>('');

  const selectItem = (item) => {
    const isSelected = checkIsSelected(item);
    if (limitSelectStock && limitSelectStock > 0) {
      const market = getMarketCategoryTag(item?.marketId) || '';
      if (!pkMarket) {
        setPkMarket(currency[market]);
      }
      const data = stockList.filter((ele) => checkIsSelected(ele));
      // 股票pk只能添加相同市场股票
      if (pkMarket === currency[market]) {
        if ((Object.keys(data).length > (limitSelectStock - 1))) {
          setCheckedDict({ ...checkedDict, [generateKey(item)]: false });
          Toast.show({ content: '最多添加4只股票' });
        } else {
          setCheckedDict({ ...checkedDict, [generateKey(item)]: !isSelected });
        }
      } else {
        Toast.show({ content: '只能添加相同市场股票' });
      }
    } else {
      setCheckedDict({ ...checkedDict, [generateKey(item)]: !isSelected });
    }
  };

  const onReachBottom = () => {
    setPageNum(pageNum + 1);
  };

  const onRowClick = ({ rowData }) => {
    goToSymbolPage({ market: rowData.marketId, code: rowData.code });
  };

  useEffect(() => {
    const data = stockList.filter((item) => checkIsSelected(item));
    filterResultCallback(data);
  }, [stockList, checkedDict]);

  useEffect(() => {
    setPageNum(1);
  }, [conditionValue]);

  useEffect(() => {
    if (!isWsClientReady) return;
    if (!isShowFilterResult) return;
    queryFilterStockList({
      conditions: [
        ...parseReqParamsObj(conditionValue),
        { dimension: 'region', val: [region] },
      ],
      pageSize: 30,
      pageNum,
    })
      .then((res) => {
        const { stocks = [] } = res.body;

        querySnapshot(wsClient, {
          symbols: stocks.map((item) => ([item.sub_market, item.code])),
          fields: [QUOTE_CATEGORY_FIELD.QUOTE, QUOTE_CATEGORY_FIELD.INFO],
        }).then((ress) => {
          setStockList(pageNum === 1 ? ress : [...getStockList(), ...ress]);
        });
      })
      .catch((err) => {
        Toast.show({ content: `接口异常: ${err.message}` });
      });
  }, [pageNum, isShowFilterResult, isWsClientReady]);

  useEffect(() => {
    const select = {};
    stockList.forEach((item) => {
      select[generateKey(item)] = isSelectAll;
    });
    setCheckedDict({ ...select });
  }, [isSelectAll]);

  useEffect(() => {
    sessionStorageGetItem({ key: 'stockList' }).then((res) => {
      if (res && res?.key && res?.value) {
        const list = res?.value || [];
        const obj: any = {};
        list.forEach((item, index) => {
          console.log('item', item);
          if (index === 0) {
            setPkMarket((item.market).toLocaleLowerCase());
          }
          obj[generateKey(item)] = true;
        });
        console.log('obj', obj);
        setCheckedDict({ ...checkedDict, ...obj });
      }
    });
  }, []);

  const columns = useMemo<ITableItemColumns[]>(() => [
    {
      label: '名称代码',
      dataKey: 'name',
      width: '60%',
      titleClassName: 'table-header-cell',
      className: 'table-body-cell',
      render: ({ rowData }) => (
        <div styleName="name-code-cell" className="flex-l-c">
          {isEdit && (
            <div styleName="name-code-checkbox" onClick={(e) => e.stopPropagation()}>
              <Checkbox
                onChange={() => selectItem(rowData)}
                checked={checkIsSelected(rowData)}
              />
            </div>
          )}

          <div styleName="stock-info">
            <div styleName="name">{rowData.name}</div>
            <div styleName="code">{rowData.code}</div>
          </div>
        </div>
      ),
    },
    {
      label: '最新价',
      dataKey: 'now',
      width: '20%',
      align: 'right',
      titleClassName: 'table-header-cell',
      className: 'table-body-cell num-font',
      render: ({ rowData }) => {
        const { priceRise, now, dec } = rowData;
        return (
          <span className={getClassNameByPriceChange(priceRise)}>
            {toFixedNum(now, dec)}
          </span>
        );
      },
    },
    {
      label: '涨跌幅',
      dataKey: 'priceLimit',
      titleClassName: 'table-header-cell',
      className: 'table-body-cell num-font',
      width: '20%',
      align: 'right',
      render: ({ rowData }) => (
        <div className={getClassNameByPriceChange(rowData.priceRise)}>
          {
            toPlaceholder(toPositiveSign(toPercent(rowData.priceRiseRate, { multiply: 100 })))
          }
        </div>
      ),
    },
  ], [isEdit, stockList, checkedDict]);

  return (
    <div styleName="container" className="filter-result-page">
      {
        conditionValueList && conditionValueList.length ? (
          <div styleName="scroll-text-container">
            {conditionValueList.map((item) => (
              <Popover
                content={`${item.title}：${item.conditionName}`}
                trigger="click"
                placement="bottomRight"
                key={item.dimension}
                styleName="con-popover"
              >
                <div styleName="text-box">
                  <div styleName="key">{item.title}</div>
                  {
                    item.periodText
                    && (
                      <div styleName="key">{item.periodText}</div>
                    )
                  }
                  <div styleName="value" className="num-font">
                    {item.conditionName}
                  </div>
                </div>
              </Popover>
            ))}
          </div>
        ) : null
      }

      <div styleName="table-container">
        <div styleName="result-total">
          共
          <span className="num-font">{conditionLength}</span>
          个条件，选出
          <span className="num-font">{resultTotal}</span>
          只票
        </div>

        <div styleName="table-box">
          <TableList
            data={stockList}
            scrollbg={false}
            wrapperPadding={['0.32rem', '0.32rem']}
            hiddenBox={<NoMessage />}
            columns={columns}
            titleHeight={40}
            columnHeight={40}
            onFooter={onReachBottom}
            onRowClick={onRowClick}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterResult;
