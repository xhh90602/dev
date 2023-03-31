/* eslint-disable max-len */
import React, { memo, useState, useEffect } from 'react';
import { getCombinationList } from '@/api/module-api/combination';
import { useIntl } from 'react-intl';
import { InfiniteScroll, DotLoading, PullToRefresh } from 'antd-mobile';
import { nativeOpenPage } from '@/platforms/mobile/helpers/native/url';
import { pageOnShow } from '@/platforms/mobile/helpers/native/register';
import { useGetState } from 'ahooks';
import IconCreate from '@/platforms/mobile/images/icon_create_btn.svg';
import IconEdit from '@/platforms/mobile/images/icon_edit.svg';
import IconZhAdd from '@/platforms/mobile/images/icon_zh_add.svg';
import Empty from '@/platforms/mobile/components/combination/empty';
import CombinationCard from '@/platforms/mobile/components/combination/combination-card';
import Loading from '@/platforms/mobile/components/combination/loading';

import './index.scss';

const List: React.FC<any> = memo((props: any) => {
  const { type = 1, switchTab = () => null } = props;
  const [pages, setPages, getPage] = useGetState<any>({ pageNum: 0, pageSize: 10 });
  const [list, setList] = useState<any>([]);
  const [isLoading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const { formatMessage } = useIntl();

  // 数据格式化
  const chartFormat = (li) => {
    if (!li || li.length === 0) return [];
    const data: any = [];
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
        data.push(obj);
      }
    });
    return data;
  };

  // 获取列表数据
  const getList = async (scroll = false) => {
    if (!hasMore) return;
    try {
      await getCombinationList({
        listType: type,
        ...getPage(),
        pageNum: (getPage().pageNum + 1),
      }).then((res: any) => {
        setLoading(false);
        if (res && res.code === 0) {
          const { pageNum, pageSize } = res.result;
          if (res.result && res.result.data && res.result.data.length) {
            let temp: any = [];
            const resData = res?.result?.data || [];
            if (scroll) {
              temp = [...list, ...resData];
            } else {
              temp = [...resData];
            }
            temp.forEach((item: any) => {
              item.chartData = chartFormat(item.yieldCurveVOList);
            });
            setList(temp);
            setPages({ pageNum, pageSize });
          } else {
            setHasMore(false);
          }
        } else {
          setHasMore(false);
        }
      }).catch(() => {
        setHasMore(false);
      });
    } catch (error) {
      setHasMore(false);
    }
  };

  const notDateTip = () => {
    let text = '';
    if (type === 1) {
      text = formatMessage({ id: 'tip1' });
    }
    if (type === 2) {
      text = formatMessage({ id: 'tip2' });
    }
    if (type === 3) {
      text = formatMessage({ id: 'tip3' });
    }
    return text;
  };

  useEffect(() => {
    pageOnShow(() => {
      new Promise((resolve) => {
        setList(() => []);
        setPages(() => {
          resolve(true);
          return { pageNum: 0, pageSize: 10 };
        });
      }).then(async (res) => {
        if (res) {
          setHasMore(true);
        }
      });
    });
  }, []);

  // 下拉刷新
  const onRefresh = async () => {
    new Promise((resolve) => {
      setList(() => []);
      setPages(() => {
        resolve(true);
        return { pageNum: 0, pageSize: 10 };
      });
    }).then(async (res) => {
      if (res) {
        setHasMore(true);
      }
    });
  };

  return (
    <PullToRefresh onRefresh={async () => onRefresh()}>
      <div styleName="wrap">
        {
          list && list.length ? (
            <CombinationCard data={list} type={+type} />
          ) : (
            <>
              {
                !list.length && !isLoading ? (
                  <div styleName="empty-box"><Empty text={notDateTip()} /></div>
                ) : (
                  <div styleName="loading-page">
                    <Loading text={formatMessage({ id: 'loading' })} />
                  </div>
                )
              }
              {
                type === 3 ? (
                  <div styleName="tip-text" onClick={() => switchTab(1)}>
                    {formatMessage({ id: 'go_quickly' })}
                    <span>{formatMessage({ id: 'featured_combination' })}</span>
                    {formatMessage({ id: 'subscribe' })}
                  </div>
                ) : null
              }
              {
                type === 2 ? (
                  <div styleName="create-btn" onClick={() => nativeOpenPage('create-combination.html')}>
                    <img src={IconCreate} alt="" />
                    {formatMessage({ id: 'create_portfolio' })}
                  </div>
                ) : null
              }
            </>
          )
        }
      </div>

      <InfiniteScroll
        styleName={type === 2 && list && list.length > 0 ? 'infinite-scroll-box tool-bar-active' : 'infinite-scroll-box'}
        threshold={50}
        hasMore={hasMore}
        loadMore={async () => getList(true)}
      >
        {
          list && list.length && hasMore ? (
            <>
              <span>{formatMessage({ id: 'loading' })}</span>
              <DotLoading />
            </>
          ) : null
        }
        {
          list && list.length > 0 && !hasMore && (
            <span>
              ~
              {formatMessage({ id: 'notMore' })}
              ~
            </span>
          )
        }
      </InfiniteScroll>
      {/* 新建组合 && 编辑组合 */}
      {
        type === 2 && list && list.length > 0 ? (
          <div styleName={list.length >= 2 ? 'fixed-bar tool-bar' : 'tool-bar'}>
            <div styleName="tool-bar-box">
              <div styleName="item" onClick={() => nativeOpenPage('create-combination.html', true)}>
                <img styleName="icon" src={IconZhAdd} alt="" />
                {formatMessage({ id: 'create_combination' })}
              </div>
              <div styleName="item" onClick={() => nativeOpenPage('combination-edit-list.html')}>
                <img styleName="icon" src={IconEdit} alt="" />
                {formatMessage({ id: 'edit_stock_text' })}
              </div>
            </div>
          </div>
        ) : null
      }
    </PullToRefresh>
  );
});

export default List;
