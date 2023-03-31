import React, { memo, useState, useEffect } from 'react';
import { getCombinationList } from '@/api/module-api/combination';
import { openNativePage, NativePages, PageType } from '@/platforms/mobile/helpers/native/msg';
import { Toast } from 'antd-mobile';
import { useIntl } from 'react-intl';
import { useGetState } from 'ahooks';
import Empty from '@/platforms/mobile/components/combination/empty';
import Loading from '@/platforms/mobile/components/combination/loading';
import CombinationCard from '@/platforms/mobile/components/combination/combination-card';
import IconMore from '@/platforms/mobile/images/icon_zh_more.svg';

import './index.scss';

const StrategyClass: React.FC<any> = memo(() => {
  const [pages, setPages, getPage] = useGetState<any>({ pageNum: 0, pageSize: 5 });
  const [list, setList] = useState<any>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const { formatMessage } = useIntl();

  // 更多跳转
  const goMorePage = () => {
    openNativePage({
      pageType: PageType.NATIVE,
      path: NativePages.combination,
      fullScreen: true,
      data: {
        callbackEvent: 'COMMON_CALLBACK',
        callbackParams: { callbackEventName: 'combination', type: 1 },
      },
    });
  };

  // 数据格式化
  const chartFormat = (li) => {
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
  let flag = true;
  const getList = async (scroll = false) => {
    if (!flag) return;
    flag = false;
    try {
      await getCombinationList({
        listType: 1,
        ...getPage(),
        pageNum: (getPage().pageNum + 1),
      }).then((res: any) => {
        if (res && res.code === 0) {
          const { pageNum, pageSize } = res.result;
          if (res.result && res.result.data && res.result.data.length) {
            let temp = [];
            const resData = res?.result?.data || [];
            if (scroll) {
              temp = (list && list.length && list.concat(resData)) || resData;
            } else {
              temp = res?.result?.data;
            }
            temp.forEach((item: any) => {
              item.chartData = chartFormat(item.yieldCurveVOList);
            });
            setList(temp);
            setPages({ pageNum, pageSize });
            flag = true;
          } else {
            flag = true;
          }
        } else {
          flag = true;
        }
        setLoading(false);
      }).catch((err) => {
        flag = true;
        setLoading(false);
        Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err.message}` });
      });
    } catch (error) {
      flag = true;
      setLoading(false);
      Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${error}` });
    }
  };

  useEffect(() => {
    getList();
  }, []);

  const tipDom = () => {
    if ((!list || !list.length) && !isLoading) {
      return (
        <div styleName="empty-box">
          <Empty text={formatMessage({ id: 'tip1' })} type="strategy" />
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
    <div styleName="wrap">
      <div styleName="title-box">
        <div styleName="title">{formatMessage({ id: 'selected_portfolio' })}</div>
        <img src={IconMore} alt="" onClick={() => goMorePage()} />
      </div>
      <div styleName="selected-portfolio">
        {
          list && list.length ? (
            <CombinationCard data={list} type={1} />
          ) : (
            tipDom()
          )
        }
      </div>
    </div>
  );
});

export default StrategyClass;
