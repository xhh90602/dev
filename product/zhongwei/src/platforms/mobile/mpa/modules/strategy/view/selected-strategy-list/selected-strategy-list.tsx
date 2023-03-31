/* eslint-disable prefer-const */
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useGetState } from 'ahooks';
import './selected-strategy-list.scss';
import Loading from '@/platforms/mobile/components/combination/loading';
import { CommonApi, getQuoData } from '@/api/module-api/strategy';
import { InfiniteScroll, PullToRefresh, Toast } from 'antd-mobile';
import { sleep } from 'antd-mobile/es/utils/sleep';
import StrategyItemCard from '@/platforms/mobile/mpa/modules/strategy/components/strategy-item-card';
import Empty from '@/platforms/mobile/components/combination/empty';

const StrategyHome: React.FC = () => {
  const [pages, setPages, getPages] = useGetState<any>({ pageNum: 1, pageSize: 20 });
  const [list, setList] = useState<any>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState(true);
  const { formatMessage } = useIntl();

  // 下拉刷新
  const onRefresh = async () => {
    await sleep(500);
    window.location.reload();
  };

  const getStockParamsFormat = (res) => {
    const temp: any = [];
    if (res && res.length) {
      res.forEach((item) => {
        if (item?.top2Stks && item?.top2Stks.length) {
          item.top2Stks.forEach((ele) => {
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
  const getStockInfo = (params) => {
    const paramsList = getStockParamsFormat(params);
    if (paramsList && paramsList.length) {
      try {
        getQuoData({
          ReqType: 1200,
          ReqID: 1,
          Data: paramsList,
        }).then((res: any) => {
          if (res && res.Status === 0 && res?.Data && res?.Data.length) {
            const resData = res.Data;
            params.forEach((item) => {
              if (item?.top2Stks && item?.top2Stks.length) {
                item.top2Stks.forEach((ele) => {
                  const idx = resData.findIndex(
                    (a) => `${a.Market}` === `${ele.subMarket}` && `${a.Code}` === `${ele.code}`,
                  );
                  if (idx > -1) {
                    ele.Name = resData[idx]?.Name;
                    ele.Name_T = resData[idx]?.Name_T;
                    ele.MonthRise = resData[idx]?.MonthRise || 0;
                  }
                });
              }
            });
            setList([...list, ...params]);
          }
          setLoading(false);
        }).catch((err) => {
          setLoading(false);
          Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err.message}` });
        });
      } catch (err: any) {
        setLoading(false);
        Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err}` });
      }
    } else {
      setList([...list, ...params]);
      setLoading(false);
    }
  };

  const getList = async () => {
    if (!hasMore) return;
    try {
      let { pageNum, pageSize } = getPages();
      await CommonApi({ mf: 9, sf: 17, body: { pageSize, pageNum } }).then((res: any) => {
        const { code, body } = res;
        if (code === 0 && body?.strategys && body?.strategys.length) {
          if (!body?.strategys.length || body?.strategys.length !== pageSize) {
            setHasMore(false);
          }
          getStockInfo(body.strategys);
        } else {
          setHasMore(false);
          setLoading(false);
        }
        setPages({ pageSize, pageNum: pageNum + 1 });
      }).catch((err) => {
        setHasMore(false);
        Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err.message}` });
      });
    } catch (err: any) {
      setHasMore(false);
      Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err}` });
    }
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

  return (
    <div styleName="selected-strategy-list">
      <PullToRefresh onRefresh={async () => onRefresh()}>
        <InfiniteScroll
          threshold={50}
          loadMore={async () => getList()}
          hasMore={hasMore}
        >
          {
            list && list.length ? (
              <>
                <div styleName="card-box">
                  {
                    list.map((item, index) => (
                      <StrategyItemCard key={item.id} item={item} index={index} />
                    ))
                  }
                </div>
                {
                  list && list.length > 0 && !hasMore && (
                    <div styleName="not-more">
                      ~
                      {formatMessage({ id: 'notMore' })}
                      ~
                    </div>
                  )
                }
              </>
            ) : (
              tipDom()
            )
          }
        </InfiniteScroll>
      </PullToRefresh>
    </div>
  );
};

export default StrategyHome;
