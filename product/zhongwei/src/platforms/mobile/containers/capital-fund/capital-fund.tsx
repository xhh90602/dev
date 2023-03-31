/* eslint-disable react/destructuring-assignment */
/* eslint-disable func-names */
import { FormattedMessage, useIntl } from 'react-intl';
import { MouseEventHandler, useCallback, useMemo, useState } from 'react';
import { Popover, Toast } from 'antd-mobile';

import BasicCard from '@/platforms/mobile/components/basic-card/basic-card';
import { getClassNameByPriceChange } from '@dz-web/quote-client';
import TradeTip from '@mobile/components/trade-tip/trade-tip';
import { JavaMarket, sliceString } from '@/utils';
import Tabs from '@mobile/components/tabs/tabs';
import IndexPositionTable from '@mobile/components/index-position-table/index-position-table';

import ContractionArea from '@mobile/components/contraction-area/contraction-area';
import useGetCapital from '@/hooks/trade/use-get-capital';
import { useSelector } from 'react-redux';
import { AlignType, capitalList, IRenderTemplate } from '@/platforms/mobile/constants/capital-list';
import IconSvg from '@mobile/components/icon-svg';
import { currencyList } from '@mobile/constants/trade';
import EntrustTable from '@mobile/components/index-entrust-table/index-entrust-table';
import BaseModal from '@/platforms/mobile/components/basic-modal/basic-modal';
import useProfitLoss from '@/hooks/trade/use-profit-loss';
import { getPosition } from '@/api/module-api/trade';
import TriggerTable from '../trigger-table/trigger-table';

import './capital-fund.scss';
import { normalCall, openNewPage, PageType, sharePage, CShareType, shareSourceType } from '../../helpers/native/msg';
import { RootState } from '../../model/store';
import { useTradeStore } from '../../model/trade-store';
import MessageReminder from '../../components/message-reminder/message-reminder';

const { navList = [] } = window.GLOBAL_CONFIG.TRADE_CONFIG;

const CapitalFund = () => {
  const { formatMessage } = useIntl();

  const [currency, setCurrency] = useState('HKD');

  const moneyList = useGetCapital(currency, true);

  const [currentActive, setCurrentActive] = useState<'position' | 'entrust' | 'condition'>('position');

  const [hide, setHide] = useState(true);

  // const positionList = useSelector((s: RootState) => s.trade.positionList);
  const entrustList = useSelector((s: RootState) => s.trade.entrustList);
  const triggerList = useTradeStore((state) => state.triggerList);
  const positionTotal = useTradeStore((state) => state.positionTotal);

  const tabList = [
    {
      title: `${formatMessage({ id: 'position' })}(${positionTotal})`,
      key: 'position',
      table: IndexPositionTable,
      children: null,
    },
    {
      title: `${formatMessage({ id: 'await_make_bargain_order' })}(${entrustList.length})`,
      key: 'entrust',
      table: EntrustTable,
      children: null,
    },
    {
      title: `${formatMessage({ id: 'await_trigger_condition' })}(${triggerList.length})`,
      key: 'condition',
      table: TriggerTable,
      children: null,
    },
  ];

  const capitalTable = useCallback((d) => tabList.map((item) => (
    <div
      styleName="c-table"
      style={{ display: item.key === currentActive ? 'block' : 'none' }}
      key={item.key}
    >
      <item.table type="today" tradeMarket={d.tradeMarket} className="contain-bg" />
    </div>
  )), [currentActive]);

  const { currencyDataList } = useProfitLoss({ isPoll: true });

  const [label, setLabel] = useState('');

  const navItemClick = (item: {
    label: string;
    icon: string;
    url: string;
    title: string;
    fullUrl?: string;
    fullScreen?: boolean;
    native?: boolean;
  }) => {
    const { url, fullUrl, title, fullScreen, native } = item;
    const path = fullUrl || url;
    if (item.label === '货币兑换') {
      setLabel(item.label);
      return;
    }
    if (!path) {
      Toast.show({
        content: formatMessage({ id: 'receive_income' }),
      });
      return;
    }
    openNewPage(
      {
        pageType: native ? PageType.NATIVE : PageType.HTML,
        path,
        title: formatMessage({ id: title || item.label }),
        fullScreen,
      },
      !fullUrl,
    );
  };

  // 资产今日/持仓盈亏分享
  const assetsShare = () => {
    sharePage({
      shareType: CShareType.Data,
      info: {
        // 今日盈亏
        profitLoss: String(moneyList.profit),
        // 今日盈亏比率
        profitLossPct: String(moneyList.profitRatio),
        // 总盈亏
        totalProfitLoss: String(moneyList.totalIncome),
        // 总盈亏比率
        totalProfitLossPct: String(moneyList.totalIncomeRatio),
        // 分享来源
        shareSource: shareSourceType.AssetsAccount,
      },
    });
  };

  // 股票市场盈亏分享
  const stockShare = (stock) => {
    console.log('====>', stock);
    let shareSourceTypes: any = null;
    if (stock.currency === 'CNY') {
      console.log('==========');
      shareSourceTypes = shareSourceType.SHSZAccount;
      getPosition({
        tradeMarket: [JavaMarket.SZMK, JavaMarket.SHMK],
      })
        .then((res) => {
          console.log(res);
          if (res.code === 0) {
            const data = res.result.map((item) => ({
              code: item.stockCode,
              name: item.stockName,
              costPrice: Number(item.costPrice),
              price: Number(item.lastPrice),
              profitLossPct: item.floatingPLPercent,
            }));
            // 假数据
            // const data = [1, 2, 3, 4, 5, 6].map((item) => ({
            //   code: `00000${item}`,
            //   name: `播放IE苏${item}`,
            //   costPrice: 100 + item,
            //   price: 200 + item,
            //   profitLossPct: `${item}0%`,
            // }));
            console.log(data);
            sharePage({
              shareType: CShareType.Data,
              info: {
                // 今日盈亏
                profitLoss: String(stock.todayPL),
                // 今日盈亏比率
                profitLossPct: stock.todayPLRat,
                // 总盈亏
                totalProfitLoss: stock.totalPL,
                // 总盈亏比率
                totalProfitLossPct: stock.totalPLRat,
                // 分享来源
                shareSource: shareSourceTypes,
                // 持仓列表数据
                holdingStocks: data as any,
              },
            });
          }
        });
    } else if (stock.currency === 'HKD') {
      shareSourceTypes = shareSourceType.HKAccount;
      getPosition({
        tradeMarket: [JavaMarket.HKEX],
      })
        .then((res) => {
          console.log('====>', res, 'res');
          if (res.code === 0) {
            const data = res.result.map((item) => ({
              code: item.stockCode,
              name: item.stockName,
              costPrice: Number(item.costPrice),
              price: Number(item.lastPrice),
              profitLossPct: item.floatingPLPercent,
            }));
            console.log(data);
            sharePage({
              shareType: CShareType.Data,
              info: {
                // 今日盈亏
                profitLoss: String(stock.todayPL),
                // 今日盈亏比率
                profitLossPct: stock.todayPLRat,
                // 总盈亏
                totalProfitLoss: stock.totalPL,
                // 总盈亏比率
                totalProfitLossPct: stock.totalPLRat,
                // 分享来源
                shareSource: shareSourceTypes,
                // 持仓列表数据
                holdingStocks: data,
              },
            });
          }
        });
    } else {
      shareSourceTypes = shareSourceType.USAccount;
    }
  };

  const gotoAccountDetail = () => {
    openNewPage({
      pageType: PageType.HTML,
      path: 'account-details.html',
      fullScreen: true,
    });
  };

  const stop: MouseEventHandler<any> = (e) => {
    e.stopPropagation();
  };

  return (
    <div styleName="index">
      {/* 资产信息 */}
      <BasicCard className="m-15 link-bg">
        <div styleName="capital-info" onClick={gotoAccountDetail}>
          {/* 总资产 */}
          <div styleName="currency-info capital-white-info">
            <div styleName="title">
              <div styleName="title-check" onClick={stop}>
                <Popover.Menu
                  actions={currencyList.map((c) => ({
                    ...c,
                    text: <div className={c.key === currency ? 't-normal' : ''}>{c.text}</div>,
                  }))}
                  placement="bottom-end"
                  onAction={(node) => {
                    setCurrency((node as { key }).key);
                  }}
                  trigger="click"
                >
                  <div>
                    <FormattedMessage id="total_asset" />
                    (
                    {currency}
                    )
                    <span className="arrow" />
                  </div>
                </Popover.Menu>
                <div
                  styleName="icon"
                  onClick={() => {
                    setHide(!hide);
                  }}
                >
                  <IconSvg path={hide ? 'icon_eyes' : 'icon_eyes_close'} />
                </div>
              </div>
              <div styleName="title-share" onClick={stop}>
                <IconSvg
                  path="icon_share"
                  click={() => {
                    assetsShare();
                  }}
                />
                <span>
                  <FormattedMessage id="today_income" />
                </span>
              </div>
            </div>
            <div styleName="title-content">
              <div styleName="count" onClick={stop}>{hide ? `${sliceString(moneyList.totalAsset)}` : '***'}</div>
              <div onClick={stop}>
                <span className={`m-20-0 ${getClassNameByPriceChange(moneyList.profitRatio)}`} styleName="rate">
                  {hide ? `${sliceString(moneyList.profitRatio, { sign: true })}%` : '***'}
                </span>
                <span className={getClassNameByPriceChange(moneyList.profit)}>
                  {hide ? sliceString(moneyList.profit, { sign: true }) : '***'}
                </span>
              </div>
            </div>
          </div>
          {/* 资金详情明细 */}
          <ContractionArea className="basic-card">
            <div styleName="info-list">
              {capitalList.map((item: IRenderTemplate) => {
                // eslint-disable-next-line @typescript-eslint/no-shadow
                const { label: Label, content, align = 'left', key } = item;
                return (
                  <div styleName="info-item" className={AlignType[align]} key={key}>
                    <div styleName="label">
                      <Label {...moneyList} />
                      {/* {label(moneyList)} */}
                    </div>
                    <div>{hide ? content<any>(moneyList) : '***'}</div>
                  </div>
                );
              })}
            </div>
          </ContractionArea>
          {/* 近一日盈亏 */}
          <TradeTip
            className="t-link"
            openTip
            close={false}
            tip={(
              <div className="flex-c-between">
                <div>
                  <FormattedMessage id="nearly_one_day" />
                  <FormattedMessage id="profit_loss" />
                  <span className="f-bold">
                    <FormattedMessage id="beat_the_platform" />
                    90%
                  </span>
                  <FormattedMessage id="user" />
                </div>
                <div>
                  <span className="m-r-15">
                    <FormattedMessage id="see_details" />
                  </span>
                  <span className="line-arrow" />
                </div>
              </div>
            )}
            onClick={stop}
          />
        </div>
      </BasicCard>
      {/* 金刚区 */}
      <BasicCard className="m-15">
        <BaseModal
          visible={label === '货币兑换'}
          title={formatMessage({ id: 'hint' })}
          confirmText={formatMessage({ id: 'contact_the_customer_service' })}
          cancelText={formatMessage({ id: 'cancel' })}
          onCancel={() => setLabel('')}
          onConfirm={() => {
            setLabel('');
            normalCall([{
              name: `${formatMessage({ id: 'tel_name' })}（${formatMessage({ id: 'hk' })}）`,
              tel: '+852 2213 1888',
            }]);
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <FormattedMessage id="change_currency_modal_text" />
          </div>
        </BaseModal>
        <div styleName="nav-list">
          {navList.map(
            (nav) => (
              <div
                key={nav.icon}
                styleName="nav-item"
                onClick={() => navItemClick(nav)}
              >
                <div>
                  <IconSvg path={nav.icon} />
                </div>
                <div>
                  <FormattedMessage id={nav.label} />
                </div>
              </div>
            ),
          )}
        </div>
      </BasicCard>
      {/* 订单tab（持仓，待成交，待触发） */}
      <div className="basic-card m-15" styleName="trade-table">
        <div styleName="table-tabs">
          <Tabs
            activeKey={currentActive}
            list={tabList}
            onChange={(v) => {
              setCurrentActive(v as 'position' | 'entrust' | 'condition');
            }}
          />
        </div>
      </div>
      {/* 交易详情 */}
      {currencyDataList.map((d) => (
        <BasicCard className="m-15 m-t-20 m-b-30" key={d.icon}>
          <div styleName="currency-contain" className="basic-card">
            <div className="basic-card p-t-30 p-x-30">
              <div styleName="currency-box">
                <div styleName="currency-icon">
                  <div>
                    <IconSvg path={d.icon} />
                    <span className="p-x-10">
                      {d.text}
                    </span>
                    <span className="t-desc">
                      (
                      {d.currency}
                      )
                    </span>
                  </div>
                  <div>{sliceString(d.totalMarketValue)}</div>
                </div>
                <div styleName="high-low">
                  <div styleName="title-share">
                    <IconSvg
                      path="icon_share"
                      click={() => {
                        stockShare(d);
                      }}
                    />
                    <span>
                      <FormattedMessage id="today_income" />
                    </span>
                  </div>
                  <div>
                    <div>
                      <span className={`m-20-0 ${getClassNameByPriceChange(d.todayPLRat)}`} styleName="rate">
                        {d.todayPLRat}
                      </span>
                      <span className={getClassNameByPriceChange(d.todayPL)}>
                        {sliceString(d.todayPL || '', { sign: true })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <ContractionArea defaultOpen background>
                {d.currency === 'HKD' && capitalTable({ tradeMarket: [JavaMarket.HKEX] })}
                {d.currency === 'CNY' && capitalTable({ tradeMarket: [JavaMarket.SZMK, JavaMarket.SHMK] })}
              </ContractionArea>
            </div>
            {/* 消息提醒 */}
            {currentActive === 'position' && <MessageReminder market={d.requestMarket} />}
          </div>
        </BasicCard>
      ))}
    </div>
  );
};

export default CapitalFund;
