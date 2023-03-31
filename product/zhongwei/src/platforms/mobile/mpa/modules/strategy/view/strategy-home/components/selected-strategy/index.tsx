import React, { memo, useState, useEffect } from 'react';
import { openNewPage, PageType } from '@/platforms/mobile/helpers/native/msg';
import Loading from '@/platforms/mobile/components/combination/loading';
import { Toast } from 'antd-mobile';
import { useIntl } from 'react-intl';
import { CommonApi, getQuoData } from '@/api/module-api/strategy';
import IconMore from '@/platforms/mobile/images/icon_zh_more.svg';
import StrategyItemCard from '@/platforms/mobile/mpa/modules/strategy/components/strategy-item-card';
import Empty from '@/platforms/mobile/components/combination/empty';

import './index.scss';

const StrategyClass: React.FC<any> = memo(() => {
  const [list, setList] = useState<any>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const { formatMessage } = useIntl();

  // 跳转
  const goMorePage = () => {
    openNewPage({
      fullScreen: false,
      pageType: PageType.HTML,
      path: 'selected-strategy-list.html',
      replace: false,
    });
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
            setList([...params]);
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
      setList([...params]);
      setLoading(false);
    }
  };

  const getList = () => {
    try {
      CommonApi({ mf: 9, sf: 17, body: { pageNum: 1, pageSize: 5 } }).then((res: any) => {
        if (res && res.code === 0 && res?.body?.strategys && res?.body?.strategys.length) {
          getStockInfo(res.body?.strategys);
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

  useEffect(() => {
    getList();
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
        <div styleName="title">{formatMessage({ id: 'strategy_selection' })}</div>
        <img src={IconMore} alt="" onClick={() => goMorePage()} />
      </div>
      <div styleName="selected-strategy">
        {
          list && list.length ? (
            <div styleName="item-box">
              {
                list.map((item) => (
                  <StrategyItemCard key={item.id} item={item} />
                ))
              }
            </div>
          ) : (
            tipDom()
          )
        }
      </div>
    </div>
  );
});

export default StrategyClass;
