import React, { memo, useState, useEffect, useContext } from 'react';
import { useIntl } from 'react-intl';
import { DotLoading, InfiniteScroll, Toast } from 'antd-mobile';
import { useGetState } from 'ahooks';
import {
  addOptional,
  deleteOptional,
  goToSymbolPage,
  NativePages,
  openNativePage,
  PageType,
} from '@/platforms/mobile/helpers/native/msg';
import { userConfigContext } from '@/platforms/mobile/helpers/entry/native';
import { getClassNameByPriceChange, getMarketCategoryTag } from '@dz-web/quote-client';
import { addFollow, cancelFollow, getSelf } from '@/api/module-api/combination';
import Empty from '@/platforms/mobile/components/combination/empty';
import Loading from '@/platforms/mobile/components/combination/loading';
import IconMoney from '@/platforms/mobile/images/icon_money.png';
import IconClose from '@/platforms/mobile/images/icon_close_01.svg';
import IconHK from '@/platforms/mobile/images/icon_HK.svg';
import IconSZ from '@/platforms/mobile/images/icon_SZ.svg';
import IconUS from '@/platforms/mobile/images/icon_US.svg';
import IconSH from '@/platforms/mobile/images/icon_SH.svg';
import IconCN from '@/platforms/mobile/images/icon_CN.svg';
import Iconzx from '@/platforms/mobile/images/icon_not_select_stock.svg';
import { getPopularStockDetail } from '@/api/module-api/strategy';
import Iconqx from '@/platforms/mobile/images/icon_self_select_stock.svg';
import IconYes from '@/platforms/mobile/images/icon_yes.svg';
import DefaultAvatar from '@/platforms/mobile/images/default_avatar.svg';

import './index.scss';
import { pageOnShow } from '@/platforms/mobile/helpers/native/register';

const Dialog = memo((props: any) => {
  const {
    show = false,
    data = null,
    closeClick = () => null,
  } = props;
  const [pages, setPages, getPages] = useGetState<any>({ pageNum: 0, pageSize: 10 });
  const userConfig = useContext<any>(userConfigContext);
  const [list, setList] = useState<any>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [lang, setLang] = useState<string>('zh-CN');
  const [selfList, setSelfList] = useState<any>([]);
  const { formatMessage } = useIntl();

  // 跳转到股票详情
  const goStock = () => {
    goToSymbolPage({ market: data.Market, code: data.Code });
  };

  // 获取自选股列表
  const getSelfList = async () => {
    getSelf({}).then((res) => {
      if (res && res.code === 0 && res?.result.length) {
        setSelfList([...res.result[0].stocks]);
      }
    });
  };

  // 获取热门推荐分析师列表
  let flag = true;
  const getRecommendList = async () => {
    if (!hasMore || !flag) return;
    flag = false;
    try {
      const { pageNum, pageSize } = getPages();
      await getPopularStockDetail({
        marketCode: data.Market,
        stockCode: data.Code,
        pageSize,
        pageNum: pageNum + 1,
      }).then((res: any) => {
        if (res && res.code === 0 && res?.result) {
          const { result } = res;
          if ((result && result.length) || result.length !== pageSize) {
            setHasMore(false);
          }
          setPages(() => ({ pageNum: pageNum + 1, pageSize: 10 }));
          setList((d) => ([...d, ...result]));
        }
        setLoading(false);
        flag = true;
      }).catch((err) => {
        flag = true;
        setLoading(false);
        Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err.message}` });
      });
    } catch (err: any) {
      flag = true;
      setLoading(false);
      Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err}` });
    }
  };

  // 获取股票是否已经添加到自选
  const getStockIsSelf = () => {
    const { Market, Code } = data;
    const idx = selfList.findIndex((ele) => `${ele.stockCode}` === `${Code}` && `${ele.marketCode}` === `${Market}`);
    if (idx > -1) {
      return true;
    }
    return false;
  };

  // 关系：空数组无关系 1好友 2已关注 3被关注 4 自己 5 已添加好友等待对方同意 6游客，未注册
  const addFollowClick = (row) => {
    if (row?.relations) {
      // 已关注的状态，取消关注
      if (row.relations.length && row.relations.includes(2)) {
        cancelFollow({
          hisId: row.cusNo,
        }).then((res: any) => {
          if (res && res.code === 0) {
            list.forEach((item) => {
              if (item.id === row.id) {
                const rIdx = item.relations.indexOf(2);
                item.relations.splice(rIdx, 1);
                Toast.show({
                  content: `${formatMessage({ id: 'cancelText' })}
                  ${formatMessage({ id: 'focus_on' })}
                  ${formatMessage({ id: 'success' })}`,
                });
              }
            });
            setList([...list]);
          }
        });
      }
      // 未关注的状态，添加关注
      if (!row.relations.length || (row.relations.length && !row.relations.includes(2))) {
        addFollow({
          hisId: row.cusNo,
        }).then((res: any) => {
          if (res && res.code === 0) {
            list.forEach((item) => {
              if (item.id === row.id) {
                item.relations.push(2);
                Toast.show({
                  content: `${formatMessage({ id: 'focus_on' })}${formatMessage({ id: 'success' })}`,
                });
              }
            });
            setList([...list]);
          }
        });
      }
    }
  };

  // 添加自选
  const selfClick = async () => {
    const { Market, Code } = data;
    if (getStockIsSelf()) {
      await deleteOptional({ smallMarket: Market, code: Code }).then(() => {
        Toast.show({ content: formatMessage({ id: 'del_self_stock_success' }) });
      });
    } else {
      await addOptional({ smallMarket: Market, code: Code }).then(() => {
        Toast.show({ content: formatMessage({ id: 'add_success' }) });
      });
    }
  };

  useEffect(() => {
    if (userConfig) {
      const { language } = userConfig;
      setLang(language || 'zh-CN');
    }
  }, [userConfig]);

  useEffect(() => {
    getSelfList();

    pageOnShow(() => {
      getSelfList();
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    setPages(() => ({ pageNum: 0, pageSize: 10 }));
    setList([]);
    setHasMore(true);
    if (data) {
      getStockIsSelf();
    }
  }, [data]);

  const getStockName = () => {
    if (lang === 'zh-CN') {
      return data?.Name;
    }
    return data?.Name_T;
  };

  const dataFormat = (num) => {
    if (+num) {
      if (+num > 0) {
        return `+${(+num).toFixed(2)}%`;
      }
      return `${(+num).toFixed(2)}%`;
    }
    return '0.00%';
  };

  const fixed = (num) => (+num ? +(+num).toFixed(2) : 0);

  const getMarketIMG = () => {
    switch (getMarketCategoryTag(data.Market)) {
      case 'HK':
        return IconHK;
      case 'SZ':
        return IconSZ;
      case 'SH':
        return IconSH;
      case 'US':
        return IconUS;
      default:
        return IconCN;
    }
  };

  const openWuquanCenter = ({ id, roleCode }) => {
    openNativePage({
      pageType: PageType.NATIVE,
      path: NativePages.weiquan_center,
      fullScreen: true,
      data: { hisId: id, roleCode },
    });
  };

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

  const roleMessage = (item) => {
    if (item && item?.roleCode) {
      return formatMessage({ id: item.roleCode });
    }
    return '';
  };

  return show && (
    <div styleName="dialog">
      <div styleName="mask" />
      {/* dialog-rise-bg , dialog-fall-bg */}
      <div
        styleName="dialog-box"
        className={(data?.MonthRise || 0) > 0 ? 'dialog-rise-bg' : 'dialog-fall-bg'}
      >
        <img styleName="icon-money" src={IconMoney} alt="" />
        <div styleName="icon-close-box">
          <img styleName="icon-close" src={IconClose} alt="" onClick={() => closeClick()} />
        </div>
        <div styleName="stock-box">
          <div className="stock-title">
            {`${data?.peopleQuantity || 0}次${formatMessage({ id: 'recommend' })}`}
          </div>
          <div styleName="row">
            <div styleName="item" onClick={() => goStock()}>
              <div styleName="l">
                <div styleName="stock-name">{getStockName()}</div>
                <div styleName="stock-info">
                  <img src={getMarketIMG()} alt="" />
                  {data?.Code || ''}
                </div>
              </div>
              <div styleName="r">
                <div styleName="box">
                  <div
                    styleName="ups-and-downs-num"
                    className={getClassNameByPriceChange(dataFormat(fixed(data?.MonthRise)))}
                  >
                    {dataFormat(fixed(data?.MonthRise))}
                  </div>
                  <div styleName="text">{formatMessage({ id: 'increase_this_month' })}</div>
                </div>
                {
                  getStockIsSelf() ? (
                    <img src={Iconqx} alt="" onClick={() => selfClick()} />
                  ) : (
                    <img src={Iconzx} alt="" onClick={() => selfClick()} />
                  )
                }
              </div>
            </div>
          </div>
        </div>
        <div styleName="fxs-box">
          <div className="fxs-title">{formatMessage({ id: 'analyst_view' })}</div>
          <div styleName="fxs-row">
            {
              list && list.length ? (
                list.map((item) => (
                  <div styleName="item" key={`${item.id}-${item.cusNo}`}>
                    <div styleName="user-box">
                      <div styleName="l" onClick={() => openWuquanCenter(item)}>
                        <div styleName="avatar-box">
                          <img styleName="avatar" src={item?.avatar || DefaultAvatar} alt="" />
                          <img styleName="avatar-tag" src={item?.tagIcon || ''} alt="" />
                        </div>
                        <div styleName="user-info">
                          <div styleName="name">{item?.nickname || ''}</div>
                          <div styleName="type-text">{roleMessage(item)}</div>
                        </div>
                      </div>
                      <div styleName="r" onClick={() => addFollowClick(item)}>
                        {
                          item?.relations && item.relations.length && item.relations.includes(2) ? (
                            <div styleName="btn active">
                              <img src={IconYes} alt="" />
                              {formatMessage({ id: 'focus_on' })}
                            </div>
                          ) : (
                            <div styleName="btn">{formatMessage({ id: 'focus_on' })}</div>
                          )
                        }
                      </div>
                    </div>
                    <div styleName="content-text">{item?.introduction || ''}</div>
                  </div>
                ))
              ) : (tipDom())
            }
            <InfiniteScroll
              hasMore={hasMore}
              loadMore={async () => getRecommendList()}
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
          </div>
        </div>
      </div>
    </div>
  );
});

export default Dialog;
