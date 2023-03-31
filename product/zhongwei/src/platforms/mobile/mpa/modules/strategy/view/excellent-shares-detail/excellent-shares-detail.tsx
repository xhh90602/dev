/* eslint-disable prefer-const */
import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useGetState } from 'ahooks';
import { getQuoData, getPopularStockList } from '@/api/module-api/strategy';
import { InfiniteScroll, DotLoading, PullToRefresh, Toast } from 'antd-mobile';
import { sleep } from 'antd-mobile/es/utils/sleep';
import {
  sessionStorageGetItem,
  sessionStorageRemoveItem,
  settingNavigationTitle,
} from '@/platforms/mobile/helpers/native/msg';
import Empty from '@/platforms/mobile/components/combination/empty';
import Loading from '@/platforms/mobile/components/combination/loading';
import StockCard from '@/platforms/mobile/mpa/modules/strategy/components/stock-item-card';
import Dialog from './components/dialog';

import './excellent-shares-detail.scss';

const StrategyHome: React.FC = () => {
  const [list, setList] = useState<any>([]);
  const [pages, setPages, getPages] = useGetState<any>({ pageNum: 0, pageSize: 10 });
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [show, setShow] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [stockItem, setStockItem] = useState<any>(null);
  const { formatMessage } = useIntl();

  const fixed = (num) => (+num ? +(+num * 100).toFixed(2) : 0);

  const dataFormat = (dataList, data) => {
    const temp: any = [];
    dataList.forEach((item) => {
      const obj: any = {};
      const idx = data.findIndex(
        (ele) => `${ele.Code}` === `${item.stockCode}` && `${ele.Market}` === `${item.marketCode}`,
      );
      if (idx > -1) {
        obj.Code = item.stockCode;
        obj.Market = item.marketCode;
        obj.peopleQuantity = item?.peopleQuantity || 0;
        obj.MonthRise = fixed(data[idx]?.MonthRise || 0);
        obj.Name = data[idx]?.Name || '';
        obj.Name_T = data[idx]?.Name_T || '';
        temp.push(obj);
      }
    });
    setList((ls) => ([...ls, ...temp]));
    flag = true;
  };

  // 获取股票信息
  let flag = true;
  const getStockInfo = (dataList) => {
    try {
      getQuoData({
        ReqType: 1200,
        ReqID: 1,
        Data: dataList.map((item) => ({ Market: item.marketCode, Code: item.stockCode })),
      }).then((res: any) => {
        if (res && res.Status === 0 && res?.Data && res?.Data.length) {
          const data = res.Data;
          dataFormat(dataList, data);
        }
        setLoading(false);
      }).catch((err) => {
        flag = false;
        setLoading(false);
        setHasMore(false);
        Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err.message}` });
      });
    } catch (err: any) {
      flag = true;
      setLoading(false);
      setHasMore(false);
      Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err}` });
    }
  };

  // 获取推荐人数
  const getStocksNumList = async () => {
    if (!hasMore || !flag) return;
    flag = false;
    try {
      let { pageNum, pageSize } = getPages();
      pageNum += 1;
      await getPopularStockList({ pageSize, pageNum }).then((res) => {
        if (res && res.code === 0 && res.result) {
          const data = res.result;
          if (data.length !== pageSize) setHasMore(false);
          setPages(() => ({ ...getPages(), pageNum }));
          getStockInfo(data);
        } else {
          setHasMore(false);
        }
      }).catch((err) => {
        flag = true;
        setLoading(false);
        setHasMore(false);
        Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err.message}` });
      });
    } catch (error) {
      flag = true;
      setLoading(false);
      setHasMore(false);
      Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${error}` });
    }
  };

  const itemClick = (item) => {
    setStockItem({ ...item });
  };

  // 下拉刷新
  const onRefresh = async () => {
    await sleep(500);
    window.location.reload();
  };

  useEffect(() => {
    if (stockItem) {
      setShow(true);
    }
  }, [stockItem]);

  useEffect(() => {
    settingNavigationTitle({ name: formatMessage({ id: 'high_quality_stock' }) });
    sessionStorageGetItem({ key: 'excellentStock' }).then((res) => {
      if (res && res?.key && res?.value) {
        setStockItem({ ...res?.value });
      } else {
        setStockItem(null);
      }
    });
    sessionStorageRemoveItem({ key: 'excellentStock' });
  }, []);

  const tipDom = () => {
    if (!list.length && !isLoading) {
      return (
        <div styleName="empty-box">
          <Empty type="strategy" />
        </div>
      );
    }
    return (
      <div styleName="loading-page">
        <Loading text="" />
      </div>
    );
  };

  return (
    <div styleName={show ? 'ohd excellent-shares-detail' : 'excellent-shares-detail'}>
      <PullToRefresh onRefresh={async () => onRefresh()}>
        {
          list && list.length ? (
            list.map((item) => (
              <div
                styleName="card-box"
                key={`${item?.Code}-${item?.Market}`}
              >
                <StockCard item={item} itemClick={() => itemClick(item)} />
              </div>
            ))
          ) : (tipDom())
        }
      </PullToRefresh>
      <InfiniteScroll
        hasMore={hasMore}
        threshold={50}
        loadMore={async () => getStocksNumList()}
      >
        {
          list.length && hasMore ? (
            <>
              <span>{formatMessage({ id: 'loading' })}</span>
              <DotLoading />
            </>
          ) : null
        }
        {
          list && list.length > 0 && !hasMore ? (
            <div styleName="not-more">
              ~
              {formatMessage({ id: 'notMore' })}
              ~
            </div>
          ) : null
        }
      </InfiniteScroll>
      <Dialog
        show={show}
        data={stockItem}
        closeClick={() => {
          setStockItem(null);
          setShow(false);
        }}
      />
    </div>
  );
};

export default StrategyHome;
