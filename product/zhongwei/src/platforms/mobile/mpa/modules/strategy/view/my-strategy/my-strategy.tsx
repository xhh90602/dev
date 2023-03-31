/* eslint-disable prefer-const */
import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { DotLoading, InfiniteScroll, PullToRefresh, Toast } from 'antd-mobile';
import { useGetState } from 'ahooks';
import { sleep } from 'antd-mobile/es/utils/sleep';
import { pageOnShow } from '@/platforms/mobile/helpers/native/register';
import Empty from '@/platforms/mobile/components/combination/empty';
import { CommonApi, getQuoData } from '@/api/module-api/strategy';
import Loading from '@/platforms/mobile/components/combination/loading';
import MyStrategyCard from './components/my-strategy-card';
import './my-strategy.scss';

const StrategyHome: React.FC = () => {
  const [list, setList] = useState<any>([]);
  const [pages, setPages, getPages] = useGetState<any>({ pageNum: 0, pageSize: 10 });
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setLoading] = useState<boolean>(true);
  const { formatMessage } = useIntl();

  const getStockParamsFormat = (res) => {
    const temp: any = [];
    if (res && res.length) {
      res.forEach((item) => {
        if (item?.top3Stks && item?.top3Stks.length) {
          item.top3Stks.forEach((ele) => {
            const obj: any = {};
            obj.Code = ele.code;
            obj.Market = ele.subMarket;
            temp.push(obj);
          });
        }
      });
      return temp;
    }
    return temp;
  };

  // 获取股票信息
  const getStockInfo = (params, cb) => {
    try {
      getQuoData({
        ReqType: 1200,
        ReqID: 1,
        Data: getStockParamsFormat(params),
      }).then((res: any) => {
        if (res && res.Status === 0 && res?.Data && res?.Data.length) {
          const resData = res.Data;
          params.forEach((item) => {
            if (item?.top3Stks && item?.top3Stks.length) {
              item.top3Stks.forEach((ele) => {
                const idx = resData.findIndex(
                  (a) => `${a.Market}` === `${ele.subMarket}` && `${a.Code}` === `${ele.code}`,
                );
                if (idx > -1) {
                  ele.Name = resData[idx].Name;
                  ele.Name_T = resData[idx].Name_T;
                  ele.Price = resData[idx].Price;
                  ele.RiseRate = resData[idx].RiseRate || 0;
                }
              });
            }
          });
          setList([...list, ...params]);
          cb();
        }
        setLoading(false);
      }).catch((err) => {
        setLoading(false);
        setHasMore(false);
        Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err.message}` });
      });
    } catch (err: any) {
      setLoading(false);
      setHasMore(false);
      Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err}` });
    }
  };

  // 获取我的策略
  const getList = async (cb = () => null) => {
    if (!hasMore) return;
    try {
      let { pageSize, pageNum } = getPages();
      pageNum += 1;
      await CommonApi({ mf: 9, sf: 15, body: { pageSize, pageNum } }).then((res: any) => {
        if (res && res.code === 0 && res?.body) {
          if (res?.body?.strategys.length) {
            getStockInfo([...res.body.strategys], cb);
          } else {
            setHasMore(false);
          }
          setPages({ pageSize, pageNum });
        } else {
          setHasMore(false);
        }
        setLoading(false);
      }).catch((err) => {
        setLoading(false);
        setHasMore(false);
        Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err.message}` });
      });
    } catch (err: any) {
      setLoading(false);
      setHasMore(false);
      Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err}` });
    }
  };

  const getPromise = () => new Promise<void>((resolve: any) => {
    getList(() => resolve());
  });

  const editInfo = (data) => {
    const { id, type, name } = data;
    const temp = [...list];
    if (type === 'del') {
      const idx = temp.findIndex((item) => item.id === id);
      if (idx > -1) {
        temp.splice(idx, 1);
      }
      setList([...temp]);
    }
    if (type === 'rename') {
      const idx = temp.findIndex((item) => item.id === id);
      if (idx > -1) {
        temp[idx].name = name;
      }
      setList([...temp]);
    }
  };

  // 下拉刷新
  const onRefresh = async () => {
    await sleep(500);
    window.location.reload();
  };

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

  useEffect(() => {
    pageOnShow(() => {
      setLoading(true);
      setHasMore(true);
      setList([]);
      setPages({ pageNum: 0, pageSize: 10 });
      getList();
    });
  }, []);

  return (
    <div styleName="my-strategy">
      <PullToRefresh onRefresh={async () => onRefresh()}>
        {
          list && list.length ? list.map((item) => (
            <div styleName="my-strategy-item" key={item.id}>
              <MyStrategyCard item={item} editInfo={(e) => editInfo(e)} />
            </div>
          )) : (
            tipDom()
          )
        }
        <InfiniteScroll
          threshold={50}
          hasMore={hasMore}
          loadMore={async () => getPromise()}
        >
          {
            hasMore && (
              <>
                <span>{formatMessage({ id: 'loading' })}</span>
                <DotLoading />
              </>
            )
          }
          {
            list && list.length > 0 && !hasMore && (
              <div styleName="not-more">
                ~
                {formatMessage({ id: 'notMore' })}
                ~
              </div>
            )
          }
        </InfiniteScroll>
      </PullToRefresh>
    </div>
  );
};

export default StrategyHome;
