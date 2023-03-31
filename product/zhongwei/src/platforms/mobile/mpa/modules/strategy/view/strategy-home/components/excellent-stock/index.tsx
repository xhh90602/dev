import React, { memo, useState, useEffect } from 'react';
import { nativeOpenPage } from '@/platforms/mobile/helpers/native/url';
import { useIntl } from 'react-intl';
import { getQuoData, getStocksPeopleNumberList } from '@/api/module-api/strategy';
import Empty from '@/platforms/mobile/components/combination/empty';
import IconMore from '@/platforms/mobile/images/icon_zh_more.svg';
import StockCard from '@/platforms/mobile/mpa/modules/strategy/components/stock-item-card';
import Loading from '@/platforms/mobile/components/combination/loading';
import { sessionStorageSetItem } from '@/platforms/mobile/helpers/native/msg';
import './index.scss';
import { Toast } from 'antd-mobile';

const AnalystRecommendation: React.FC<any> = memo(() => {
  const [list, setList] = useState<any>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const { formatMessage } = useIntl();

  // 跳转
  const goMorePage = () => {
    nativeOpenPage('excellent-shares-detail.html');
  };

  const fixed = (num) => (+num ? +(+num * 100).toFixed(2) : 0);

  // 获取推荐人数
  const getStocksNumList = (dataList) => {
    try {
      const stockList = dataList.map((item) => ({ stockCode: item.Code, marketCode: item.Market }));
      getStocksPeopleNumberList({ stockList }).then((res) => {
        if (res && res.code === 0 && res.result) {
          const data = res.result;
          dataList.forEach((item) => {
            const idx = data.findIndex((ele) => ele.stockCode === item.Code && ele.marketCode === item.Market);
            if (idx > -1) {
              item.peopleQuantity = data[idx]?.peopleQuantity || '';
            }
          });
          setList(dataList || []);
        } else {
          setList(dataList || []);
        }
        setLoading(false);
      });
    } catch (err) {
      setLoading(false);
      Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err}` });
    }
  };

  // 获取股票信息
  const getStockInfo = (dataList) => {
    try {
      getQuoData({
        ReqType: 1200,
        ReqID: 1,
        Data: dataList,
      }).then((res: any) => {
        if (res && res.Status === 0 && res?.Data && res?.Data.length) {
          const data = res.Data;
          dataList.forEach((item) => {
            const idx = data.findIndex((ele) => ele.Code === item.Code && ele.Market === item.Market);
            if (idx > -1) {
              item.MonthRise = fixed(data[idx]?.MonthRise || 0);
              item.Name = data[idx]?.Name || '';
              item.Name_T = data[idx]?.Name_T || '';
              item.peopleQuantity = 0;
            }
          });
          getStocksNumList(dataList);
          setList(dataList || []);
        } else {
          setLoading(false);
        }
      }).catch((err) => {
        setLoading(false);
        Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err.message}` });
      });
    } catch (err: any) {
      setLoading(false);
      Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err}` });
    }
  };

  // 获取推荐股票
  const getStockList = () => {
    try {
      getQuoData({
        ReqType: 1202,
        ReqID: 1,
        Data: {
          Category: 1,
          Market: 2057,
          Type: 321,
          Desc: 1,
          Count: 3,
          StartPos: 0,
          FiterST: 0,
        },
      }).then((res: any) => {
        if (res && res.Status === 0 && res?.Data && res?.Data?.Body.length) {
          const dataList = res.Data.Body;
          getStockInfo(dataList);
        } else {
          setList([]);
        }
      }).catch((err) => {
        setLoading(false);
        Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err.message}` });
      });
    } catch (err: any) {
      setLoading(false);
      Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err}` });
    }
  };

  const itemClick = (row) => {
    sessionStorageSetItem({ key: 'excellentStock', value: { ...row } });
    nativeOpenPage('excellent-shares-detail.html');
  };

  useEffect(() => {
    getStockList();
  }, []);

  const tipDom = () => {
    if (isLoading) {
      return (
        <div styleName="loading-page">
          <Loading text="" />
        </div>
      );
    }
    return (
      <div styleName="empty-box">
        <Empty type="strategy" />
      </div>
    );
  };

  return (
    <div styleName="wrap">
      <div styleName="title-box">
        <div styleName="title">{formatMessage({ id: 'high_quality_stock' })}</div>
        <img src={IconMore} alt="" onClick={() => goMorePage()} />
      </div>
      <div styleName="excellent-stock">
        {
          list && list.length ? list.map((item) => (
            <StockCard item={item} key={`${item?.Code}-${item?.Market}`} itemClick={(row) => itemClick(row)} />
          )) : (
            tipDom()
          )
        }
      </div>
    </div>
  );
});

export default AnalystRecommendation;
