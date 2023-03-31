import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useIntl } from 'react-intl';
import { useGetState } from 'ahooks';
import { getClassNameByPriceChange, getMarketCategoryTag } from '@dz-web/quote-client';
import { InfiniteScroll, Picker, Toast } from 'antd-mobile';
import { userConfigContext } from '@mobile/helpers/entry/native';
import { getQuoData } from '@/api/module-api/strategy';
import Empty from '@/platforms/mobile/components/combination/empty';
import Loading from '@/platforms/mobile/components/combination/loading';
import IconDown from '@/platforms/mobile/images/icon_arrow_down.svg';
import IconUp from '@/platforms/mobile/images/icon_arrow_up.svg';
import IconSZ from '@/platforms/mobile/images/icon_SZ.svg';
import IconSH from '@/platforms/mobile/images/icon_SH.svg';
import IconHK from '@/platforms/mobile/images/icon_HK.svg';
import IconUS from '@/platforms/mobile/images/icon_US.svg';
import IconDefa from '@/platforms/mobile/images/icon_sort_default.png';
import IconAsc from '@/platforms/mobile/images/icon_sort_asc.png';
import IconDesc from '@/platforms/mobile/images/icon_sort_desc.png';
import Tabs from './components/tabs';
import TableList from './components/table-list';
import './large-order-analysis.scss';

const typeEmenu = {
  119: 'ExBigNetAmount', // 超大单净额
  125: 'ExBigChange', // 超大单换手率10强
  126: 'BigChange', // 大单换手率10强
  111: 'ExBigBuyAmount', // 超大单买入金额10强
  113: 'BigBuyAmount', // 大单买入金额10强
  128: 'TradeCounts', // 成交笔数10强
  129: 'AmountPerTrade', // 每笔金额10强
  130: 'StockPerTrade', // 每笔股数10强
  131: 'BuyRate', // 买入比例10强
};

const LargeOrderAnalysis: React.FC = () => {
  const [list, setList] = useState<any>([]);
  const [oldList, setoldList] = useState<any>([]);
  const [classType, setClassType] = useState<number>(1);
  const [show, setShow] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [dateType, setDateType] = useState<number>(1);
  const [sortType, setSortType] = useState<string>('defa');
  const [hasMore, setHasMore, getHasMore] = useGetState<boolean>(true);
  const [isInit, setInit] = useState<boolean>(true);
  const [pages, setPages, getPage] = useGetState<any>({ pageNum: 0, pageSize: 10 });
  const [BlockID, setBlockID] = useState<any>(); // '1999,2000,43000'
  const [lang, setLang] = useState('zh-CN');
  const [fieldType, setFieldType] = useState<number>(119);
  const [marketList, setMarketList] = useState<any>([]);
  const [moduleType, setModuleType] = useState<any>({ 125: true });
  const userConfig = useContext<any>(userConfigContext);
  const { formatMessage } = useIntl();

  const tabList = [
    { id: '1', name: formatMessage({ id: 'large_order_statistics' }) },
    { id: '2', name: formatMessage({ id: 'large_order_ranking' }) },
  ];

  const hsTrendTabs = [
    {
      name: '1日',
      type: '1',
    },
    {
      name: '3日',
      type: '3',
    },
    {
      name: '5日',
      type: '5',
    },
    {
      name: '10日',
      type: '10',
    },
  ];

  const fixed = ({ value = 0, unit = 100 }) => {
    if (unit === 100) {
      return (value ? (value * unit).toFixed(2) : 0.00);
    }
    if (unit === 10000) {
      return (value ? (value / unit).toFixed(2) : 0.00);
    }
    return value;
  };

  const SortTypeTransform = { defa: IconDefa, asc: IconAsc, desc: IconDesc };

  // 市场转换
  const tradeMarketTransform = { HK: IconHK, SZ: IconSZ, SH: IconSH, US: IconUS };

  const itemClick = (type) => {
    const temp = {};
    temp[type] = !moduleType[type];
    setFieldType(type);
    setModuleType(temp);
  };

  // 排序
  const dataSort = (sort = sortType) => {
    if (sort === 'asc') {
      const temp = oldList.sort((a, b) => a.ExBigNetAmount - b.ExBigNetAmount);
      setList([...temp]);
    }
    if (sort === 'desc') {
      const temp = oldList.sort((a, b) => b.ExBigNetAmount - a.ExBigNetAmount);
      setList([...temp]);
    }
    if (sort === 'defa') {
      setList([...oldList]);
    }
  };

  const block = () => {
    if (classType === 1) {
      return `${BlockID}`;
    }
    return '1999';
  };

  // 获取列表
  let flag = true;
  const getList = async (isScoll = false) => {
    if (!flag || !getHasMore()) return;
    flag = false;
    try {
      const { pageSize, pageNum } = getPage();
      const StartPos = pageNum * pageSize;
      await getQuoData({
        ReqType: 1225,
        ReqID: 1,
        Data: {
          BlockID: block(),
          Type: fieldType,
          Desc: 1,
          StartPos,
          Count: pageSize,
          TimeBase: dateType,
        },
      }).then((res: any) => {
        flag = true;
        setLoading(false);
        if (res && res.Status === 0 && res?.Data && res?.Data.length) {
          let temp: any = [];
          if (isScoll) {
            temp = list.concat(res.Data);
          } else {
            temp = res.Data || [];
          }
          if (res.Data.length !== pageSize) {
            setHasMore(false);
          }
          setSortType('defa');
          setList([...temp]);
          setoldList([...temp]);
          setPages({ ...getPage(), pageNum: pageNum + 1 });
        } else {
          setHasMore(false);
        }
        setLoading(false);
        setInit(false);
        flag = true;
      }).catch((err) => {
        setLoading(false);
        setList(list.length ? list : []);
        setoldList(list.length ? list : []);
        Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err.message}` });
        flag = true;
      });
    } catch (err: any) {
      setLoading(false);
      setList(list.length ? list : []);
      setoldList(list.length ? list : []);
      Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err}` });
      flag = true;
    }
  };

  const marketFormat = (data) => {
    let temp: any = [];
    if (data && data.length) {
      temp = data.map((item) => {
        const label = lang === 'zh-CN' ? item.BlockName : item.BlockName_T;
        return { value: item.BlockID, label };
      });
    }
    setMarketList((d: any) => {
      setBlockID(d[0]?.value || temp[0]?.value);
      return [...d, ...temp];
    });
  };

  // 获取市场
  const getMarketList = (data) => new Promise((resolve, reject) => {
    try {
      getQuoData({
        ReqType: 1203,
        ReqID: 1,
        Data: { ...data },
      }).then((res: any) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
        Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err.message}` });
      });
    } catch (err: any) {
      reject(err);
      Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err}` });
    }
  });

  const onConfirm = (res) => {
    setBlockID(res[0]);
  };

  const sortClick = () => {
    let sort = '';
    if (sortType === 'defa') {
      sort = 'asc';
    }
    if (sortType === 'asc') {
      sort = 'desc';
    }
    if (sortType === 'desc') {
      sort = 'defa';
    }
    setSortType(sort);
    dataSort(sort);
  };

  const tabsChange = (res) => {
    if (+res === 1) {
      setFieldType(119);
    } else {
      setFieldType(125);
    }
    setClassType(+res);
    setDateType(1);
  };

  const blockName = useMemo(() => {
    if (classType === 1 && marketList && marketList.length) {
      return marketList.filter((item) => item.value === BlockID)[0].label;
    }
    return '';
  }, [BlockID]);

  useEffect(() => {
    setHasMore(true);
    if (!BlockID) return;
    flag = true;
    setLoading(true);
    new Promise((resolve) => {
      setPages({ pageNum: 0, pageSize: 10 });
      setList([]);
      setoldList([]);
      resolve(true);
    }).then((res) => {
      if (res) {
        getList();
      }
    });
  }, [dateType, fieldType, BlockID]);

  const params = [
    {
      BlockID: '41000',
      Type: 201,
      Desc: 1,
      StartPos: 1,
      Count: -1,
      Level: 3,
    },
    {
      BlockID: '41000',
      Type: 201,
      Desc: 1,
      StartPos: 1,
      Count: -1,
      Level: 4,
    },
  ];

  useEffect(() => {
    const reqList: any = [];
    params.forEach((item) => {
      reqList.push(getMarketList(item));
    });
    Promise.all(reqList).then((res: any) => {
      if (res && res[0].Status === 0 && res[0]?.Data && res[0]?.Data.length) {
        if (res && res[1].Status === 0 && res[1]?.Data && res[1]?.Data.length) {
          marketFormat([...res[0].Data, ...res[1].Data]);
        } else {
          marketFormat([...res[0].Data]);
        }
      } else if (res && res[1].Status === 0 && res[1]?.Data && res[1]?.Data.length) {
        marketFormat([...res[1].Data]);
      } else {
        marketFormat([]);
      }
    });
  }, []);

  useEffect(() => {
    if (userConfig) {
      setLang(userConfig?.language || 'zh-CN');
    }
  }, [userConfig]);

  const listDom = useMemo(() => {
    if (isLoading) {
      return (
        <div styleName="loading">
          <Loading />
        </div>
      );
    }
    if (list && list.length) {
      return (
        list.map((item) => (
          <div styleName="item" key={`${item.name}-${item.Market}-${item.Code}-${item.Now}`}>
            <div styleName="stock-info c1">
              <div styleName="name">{item.Name}</div>
              <div styleName="market-code">
                <img styleName="market" src={tradeMarketTransform[getMarketCategoryTag(item?.Market) || '']} alt="" />
                <div styleName="code">{item.Code}</div>
              </div>
            </div>
            <div styleName="price c2">{(item.Now).toFixed(2)}</div>
            <div
              styleName="value c3"
              className={getClassNameByPriceChange(fixed({ value: item.ExBigNetAmount, unit: 10000 }))}
            >
              {fixed({ value: item.ExBigNetAmount, unit: 10000 })}
            </div>
          </div>
        ))
      );
    }
    return (
      <div styleName="empty-box">
        <Empty type="strategy" />
      </div>
    );
  }, [list]);

  return (
    <div styleName="large-order-analysis">
      <div styleName="sticky">
        <div styleName="tabs">
          <Tabs tabList={tabList} tabsChange={(res) => tabsChange(res)} />
        </div>
        {
          classType === 1 && (
            <div styleName="select">
              <div styleName="select-box" onClick={() => setShow(!show)}>
                <div styleName="text">{blockName}</div>
                <img src={show ? IconUp : IconDown} alt="" />
              </div>
            </div>
          )
        }
        <div styleName="hs-tabs-box">
          <ol styleName="hs-tabs">
            {hsTrendTabs.map((item) => (
              <li
                key={item.type}
                onClick={() => setDateType(+item.type)}
                styleName={`hs-tabs-item ${+item.type === dateType ? 'hs-tabs-item-active' : ''}`}
              >
                {item.name}
              </li>
            ))}
          </ol>
        </div>
      </div>
      {
        classType === 1 && (
          <div styleName="content">
            <div styleName="header">
              <div styleName="item c1">{formatMessage({ id: 'name_code' })}</div>
              <div styleName="item c2">{formatMessage({ id: 'latest_price' })}</div>
              <div styleName="item c3" onClick={() => sortClick()}>
                {formatMessage({ id: 'super_large_order' })}
                <img styleName="sort" src={SortTypeTransform[sortType]} alt="" />
              </div>
            </div>
            <div styleName="item-module">
              <div styleName="item-box">
                {listDom}
              </div>
              <InfiniteScroll
                threshold={0}
                loadMore={async () => {
                  if (!isInit && !isLoading && BlockID) {
                    getList(true);
                  }
                }}
                hasMore={getHasMore()}
              >
                {
                  !getHasMore() && list.length ? (
                    <span>
                      ~
                      {formatMessage({ id: 'notMore' })}
                      ~
                    </span>
                  ) : null
                }
              </InfiniteScroll>
            </div>
          </div>
        )
      }
      {
        classType === 2 && (
          <div styleName="order-content">
            {/* 超大单换手率10强 */}
            <div styleName="item-module">
              <div
                styleName="title-box"
                onClick={() => itemClick(125)}
              >
                <div styleName="title">{formatMessage({ id: 'super_large_order_10' })}</div>
                <img src={moduleType?.[125] ? IconUp : IconDown} alt="" />
              </div>
              <div styleName={moduleType?.[125] ? 'table-box block' : 'table-box hide'}>
                <TableList list={list} field={typeEmenu[125]} label={formatMessage({ id: 'turnover_rate' })} />
              </div>
            </div>
            {/* 大单换手率10强 */}
            <div styleName="item-module">
              <div
                styleName="title-box"
                onClick={() => itemClick(126)}
              >
                <div styleName="title">{formatMessage({ id: 'top_10_super_single_turnover_rate' })}</div>
                <img src={moduleType?.[126] ? IconUp : IconDown} alt="" />
              </div>
              <div styleName={moduleType?.[126] ? 'table-box block' : 'table-box hide'}>
                <TableList list={list} field={typeEmenu[126]} label={formatMessage({ id: 'turnover_rate' })} />
              </div>
            </div>
            {/* 超大单买入金额10强 */}
            <div styleName="item-module">
              <div
                styleName="title-box"
                onClick={() => itemClick(111)}
              >
                <div styleName="title">
                  {formatMessage({ id: 'top_10_companies_with_super_large_purchase_amount' })}
                </div>
                <img src={moduleType?.[111] ? IconUp : IconDown} alt="" />
              </div>
              <div styleName={moduleType?.[111] ? 'table-box block' : 'table-box hide'}>
                <TableList list={list} field={typeEmenu[111]} label={formatMessage({ id: 'amount_wy' })} />
              </div>
            </div>
            {/* 大单买入金额10强 */}
            <div styleName="item-module">
              <div
                styleName="title-box"
                onClick={() => itemClick(113)}
              >
                <div styleName="title">{formatMessage({ id: 'top_10_large_order_purchase_amount' })}</div>
                <img src={moduleType?.[113] ? IconUp : IconDown} alt="" />
              </div>
              <div styleName={moduleType?.[113] ? 'table-box block' : 'table-box hide'}>
                <TableList list={list} field={typeEmenu[113]} label={formatMessage({ id: 'amount_wy' })} />
              </div>
            </div>
            {/* 成交笔数10强 */}
            <div styleName="item-module">
              <div
                styleName="title-box"
                onClick={() => itemClick(128)}
              >
                <div styleName="title">{formatMessage({ id: 'top_10_deals' })}</div>
                <img src={moduleType?.[128] ? IconUp : IconDown} alt="" />
              </div>
              <div styleName={moduleType?.[128] ? 'table-box block' : 'table-box hide'}>
                <TableList list={list} field={typeEmenu[128]} label={formatMessage({ id: 'bi_wb' })} />
              </div>
            </div>
            {/* 每笔金额10强 */}
            <div styleName="item-module">
              <div
                styleName="title-box"
                onClick={() => itemClick(129)}
              >
                <div styleName="title">{formatMessage({ id: 'top_10_amount' })}</div>
                <img src={moduleType?.[129] ? IconUp : IconDown} alt="" />
              </div>
              <div styleName={moduleType?.[129] ? 'table-box block' : 'table-box hide'}>
                <TableList list={list} field={typeEmenu[129]} label={formatMessage({ id: 'amount_wy' })} />
              </div>
            </div>
            {/* 每笔股数10强 */}
            <div styleName="item-module">
              <div
                styleName="title-box"
                onClick={() => itemClick(130)}
              >
                <div styleName="title">{formatMessage({ id: 'top_10_gushu' })}</div>
                <img src={moduleType?.[130] ? IconUp : IconDown} alt="" />
              </div>
              <div styleName={moduleType?.[130] ? 'table-box block' : 'table-box hide'}>
                <TableList list={list} field={typeEmenu[130]} label={formatMessage({ id: 'gs_wb' })} />
              </div>
            </div>
            {/* 买入比例10强 */}
            <div styleName="item-module">
              <div
                styleName="title-box"
                onClick={() => itemClick(131)}
              >
                <div styleName="title">{formatMessage({ id: 'top_10_buy' })}</div>
                <img src={moduleType?.[131] ? IconUp : IconDown} alt="" />
              </div>
              <div styleName={moduleType?.[131] ? 'table-box block' : 'table-box hide'}>
                <TableList list={list} field={typeEmenu[131]} label={formatMessage({ id: 'bl_wb' })} />
              </div>
            </div>
          </div>
        )
      }
      <Picker
        style={{
          '--title-font-size': '13px',
          '--header-button-font-size': '13px',
          '--item-font-size': '13px',
          '--item-height': '30px',
          height: '350px',
        }}
        columns={[marketList]}
        visible={show}
        onClose={() => {
          setShow(false);
        }}
        onConfirm={(res) => onConfirm(res)}
      />
    </div>
  );
};

export default LargeOrderAnalysis;
