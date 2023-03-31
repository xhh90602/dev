import React, { memo, useCallback, useEffect, useState } from 'react';
import { PageType, openNewPage } from '@/platforms/mobile/helpers/native/msg';
import Tabs from '@/platforms/mobile/components/tabs/tabs';
import IconEnabledQuota from '@mobile/images/high-quotation/icon_enabled_quotation.svg';
import IconMore from '@mobile/images/high-quotation/icon_more.svg';
import HKBg from '@mobile/images/high-quotation/hk_quota_item_bg.svg';
import USBg from '@mobile/images/high-quotation/us_quota_item_bg.svg';
import HKPageBg from '@mobile/images/high-quotation/page_view_bg_hk.svg';
import USPageBg from '@mobile/images/high-quotation/page_view_bg_us.svg';
import { postQuoteList, postPurchasedQuoteList } from '@/api/module-api/quotation';
import { FormattedMessage, useIntl } from 'react-intl';
import FullScreenPageView from '@/platforms/mobile/components/full-screen-page-view/full-screen-page-view';
import './high-quotation.scss';

const QuotaProductList = memo((props: { currency: string }) => {
  const { currency } = props;
  const { formatMessage } = useIntl();

  const getPeriodName = (val) => {
    switch (val) {
      case 1:
        return formatMessage({ id: 'day' });
      case 2:
        return formatMessage({ id: 'month' });
      case 3:
        return formatMessage({ id: 'week' });
      default:
        return val;
    }
  };

  const [list, setList] = useState<
    {
      autoRenew: boolean; // 自动续订[true:是 ; false:否]
      currency: 'HKD' | 'USD';
      description: string;
      haveSpecialOffer: boolean; // 是否有优惠[true:是 ; false:否]
      id: string;
      img: string;
      isBuy: boolean; // 是否已购[true:是 ; false:否]
      name: string;
      period: 1 | 2 | 3; // 套餐周期[1:天,2:月,3:周]
      price: number;
      specialEndDate: string; // 优惠结束时间
      specialPrice: number; // 优惠单价
      specialStartDate: string; // 优惠开始时间
    }[]
  >([]);

  const fetchList = () => {
    postQuoteList().then((res) => {
      console.log(res);
      if (res.code === 0) {
        setList(res.result);
      }
    });
  };

  useEffect(() => {
    fetchList();
  }, []);

  const buy = (quota) => {
    openNewPage({
      path: `submit-quotation-order.html?id=${quota.id}&renew=${quota.autoRenew}`,
      title: formatMessage({ id: '提交订单' }),
      fullScreen: false,
      pageType: 1,
    });
  };

  const isHK = currency === 'HKD';

  const bg = isHK ? HKBg : USBg;

  return (
    <>
      {list
        .filter((l) => l.currency === currency)
        .map((item) => (
          <div key={item.id} styleName="quotation-card">
            <img src={bg} alt="" />
            <div styleName="name">{item.name}</div>
            <div styleName="price" className="num-font">
              <span styleName="num">{item.haveSpecialOffer ? item.specialPrice : item.price}</span>
              {`${item.currency}/${getPeriodName(item.period)}`}
              {item.haveSpecialOffer && (
                <span styleName="special">{`${item.price + item.currency}/${getPeriodName(item.period)}`}</span>
              )}
            </div>
            <div styleName="description">{item.description}</div>
            <div
              styleName="buy-btn"
              className="num-font"
              onClick={() => {
                buy(item);
              }}
            >
              <FormattedMessage id="buy" />
            </div>
          </div>
        ))}
    </>
  );
});

const mktOptions = [
  {
    title: <FormattedMessage id="hk_stock" />,
    key: 'HKD',
  },
  {
    title: <FormattedMessage id="us_stock" />,
    key: 'USD',
  },
];

const OversellAnalyze: React.FC = () => {
  const [mkt, setMkt] = useState('HKD');
  const { formatMessage } = useIntl();
  const mktChange = (key: string) => {
    console.log('股票类型切换：', key);
    setMkt(key);
  };

  const [purchasedNum, setPurchasedNum] = useState(0);

  const fetchPurchasedQuote = () => {
    postPurchasedQuoteList().then((res) => {
      if (res.code === 0) {
        setPurchasedNum(res.result.length);
      }
    });
  };

  useEffect(() => {
    fetchPurchasedQuote();
  }, []);

  const hkfunDesTableData: () => {
    key: string;
    list: { text: string; desc?: string; key: number }[];
  }[] = useCallback(() => {
    let list = [
      [
        { text: formatMessage({ id: 'function_of_quotation' }) },
        { text: formatMessage({ id: 'LV0延时行情' }) },
        { text: formatMessage({ id: 'LV1标准行情' }), desc: '纳斯达克' },
      ],
      [
        { text: formatMessage({ id: '数据时效性' }) },
        { text: formatMessage({ id: '延时15~20分钟' }) },
        { text: formatMessage({ id: '实时' }) },
      ],
      [
        { text: formatMessage({ id: 'refurbish_mode' }) },
        { text: formatMessage({ id: '自动更新' }) },
        { text: formatMessage({ id: '自动更新' }) },
      ],
      [
        { text: formatMessage({ id: '覆盖交易所' }) },
        { text: formatMessage({ id: '单一交易所' }) },
        { text: formatMessage({ id: '单一交易所' }) },
      ],
      [
        { text: formatMessage({ id: '买卖盘档位' }) },
        { text: formatMessage({ id: '无' }) },
        { text: formatMessage({ id: '一档' }) },
      ],
      [
        { text: formatMessage({ id: '成交明细' }) },
        { text: formatMessage({ id: '无' }) },
        { text: formatMessage({ id: '全部显示' }) },
      ],
    ];
    if (mkt === 'HKD') {
      list = [
        [
          { text: formatMessage({ id: 'function_of_quotation' }) },
          { text: formatMessage({ id: 'BMP基础行情' }) },
          { text: formatMessage({ id: 'LV2高级行情' }) },
        ],
        [
          { text: formatMessage({ id: '数据时效性' }) },
          { text: formatMessage({ id: '实时' }) },
          { text: formatMessage({ id: '实时' }) },
        ],
        [
          { text: formatMessage({ id: 'refurbish_mode' }) },
          { text: formatMessage({ id: '手动更新' }) },
          { text: formatMessage({ id: '自动更新' }) },
        ],
        [
          { text: formatMessage({ id: '买卖盘档位' }) },
          { text: formatMessage({ id: '无' }) },
          { text: formatMessage({ id: '10档' }) },
        ],
        [
          { text: formatMessage({ id: '经纪商' }) },
          { text: formatMessage({ id: '无' }) },
          { text: formatMessage({ id: 'have' }) },
        ],
        [
          { text: formatMessage({ id: '成交明细' }) },
          { text: formatMessage({ id: '无' }) },
          { text: formatMessage({ id: '全部显示' }) },
        ],
        [
          { text: formatMessage({ id: '自选列表' }) },
          { text: formatMessage({ id: '20只以后延迟' }) },
          { text: formatMessage({ id: '全部实时自动更新' }) },
        ],
      ];
    }
    return list.map((item, index) => ({
      key: mkt + index,
      list: item.map((ite, i) => ({ ...ite, key: new Date().getUTCMilliseconds() + i })),
    }));
  }, [mkt]);

  const jumpList = () => {
    openNewPage({
      path: 'quotation-list.html',
      pageType: PageType.HTML,
      title: formatMessage({ id: '购买记录' }),
    });
  };

  const jumpEnterList = () => {
    openNewPage({
      path: 'enter-quote-list.html',
      pageType: PageType.HTML,
      title: formatMessage({ id: 'price_in_effect' }),
    });
  };

  return (
    <FullScreenPageView
      title={formatMessage({ id: '高级行情' })}
      right={<div onClick={jumpList}>{formatMessage({ id: '购买记录' })}</div>}
      backgroundImg={mkt.toLocaleLowerCase() === 'hkd' ? HKPageBg : USPageBg}
    >
      <div styleName={`content ${mkt.toLocaleLowerCase()}`}>
        <div styleName="enabled-quotation" onClick={jumpEnterList}>
          <img styleName="icon-enabled-quota" src={IconEnabledQuota} alt="" />
          <span className="flex-1">
            <FormattedMessage id="price_in_effect" />
          </span>
          <span styleName="num" className="num-font">
            {purchasedNum}
          </span>
          <img styleName="icon-more" src={IconMore} alt="" />
        </div>
        <Tabs styleName="mtk-tab" activeKey={mkt} list={mktOptions} onChange={mktChange} />
        <QuotaProductList currency={mkt} />
        <div styleName="fun-des-title">{formatMessage({ id: '功能说明' })}</div>
        <div styleName="fun-des-content">
          {hkfunDesTableData().map((data) => (
            <div styleName="row" key={data.key}>
              {data.list.map((item) => (
                <div styleName="cell" key={item.key}>
                  {item.text}
                  {item.desc && (
                    <>
                      <br />
                      <span styleName="desc">{item.desc}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div styleName="fun-des-context">
          {formatMessage({ id: '功能介绍' })}
          <br />
          {formatMessage({ id: 'des1' })}
          <br />
          {formatMessage({ id: 'des2' })}
          <br />
          {formatMessage({ id: 'des3' })}
          <br />
          {formatMessage({ id: 'des4' })}
        </div>
      </div>
    </FullScreenPageView>
  );
};

export default OversellAnalyze;
