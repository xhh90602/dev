import BasicCard from '@/platforms/mobile/components/basic-card/basic-card';
import FullScreenPageView from '@/platforms/mobile/components/full-screen-page-view/full-screen-page-view';
import { useIntl, FormattedMessage } from 'react-intl';
import './account-details.scss';
import bg from '@mobile/images/trade_account_bg.svg';
import iconRightArrow from '@mobile/images/icon_zh_more_right.svg';
import useGetCapital from '@/hooks/trade/use-get-capital';
import { useEffect, useMemo, useState } from 'react';
import { normalCall, openNewPage, PageType } from '@/platforms/mobile/helpers/native/msg';
import { useSetState } from 'ahooks';
import { numberClass, sliceString } from '@/utils';
import { CURRENCY_TYPE } from '@/platforms/mobile/constants/config';
import { getMoneyInfo, getTradeAccountInfo } from '@/api/module-api/trade';
import { assign, get } from 'lodash-es';
// import Loading from '@/platforms/mobile/components/loading/loading';
import { Toast } from 'antd-mobile';
import BorrowingBalance from '@/platforms/mobile/components/borrowing-balance';
import BaseModal from '@/platforms/mobile/components/basic-modal/basic-modal';
import CurrencyDom from '@mobile/components/currency-dom/currency-dom';
import { TRADE_ACCOUNT_TYPE } from '@/constants/trade';
import IconSvg from '@/platforms/mobile/components/icon-svg';

const { flowCapitalServer, gatewayServer } = window.GLOBAL_CONFIG.COMMON_SERVERS;
const PositionDistribution = () => {
  const { formatMessage } = useIntl();

  const [accountLoading, setAccountLoading] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const loading = useMemo(() => [accountLoading, balanceLoading].includes(true), [accountLoading, balanceLoading]);
  useEffect(() => {
    if (loading) {
      Toast.show({
        icon: 'loading',
        duration: 0,
      });
    } else {
      Toast.clear();
    }
  }, [loading]);

  const moneyInfo = useGetCapital('HKD');

  const [accountInfo, setAccountInfo] = useSetState({
    isFinan: false,
    account: '',
  });

  const fetchUserInfo = async () => {
    setAccountLoading(true);
    try {
      const { result } = await getTradeAccountInfo();

      setAccountInfo({
        account: result?.clientId || '',
        isFinan: result.accountType === TRADE_ACCOUNT_TYPE.FINANCING,
      });
    } catch (err) {
      console.log('获取用户信息失败', err);
    }
    setAccountLoading(false);
  };

  const currencyList = [
    {
      label: <FormattedMessage id="HKD" />,
      key: CURRENCY_TYPE.HKD,
    },
    {
      label: <FormattedMessage id="CNY" />,
      key: CURRENCY_TYPE.CNY,
    },
    {
      label: <FormattedMessage id="USD" />,
      key: CURRENCY_TYPE.USD,
    },
  ];

  /** 账户现金余额 */
  const [balanceList, setBalanceList] = useState(
    currencyList.map((item) => ({
      ...item,
      withdrawableBalance: '', // 可取金额
    })),
  );

  const fetchBalance = async () => {
    setBalanceLoading(true);
    try {
      const res = await getMoneyInfo({});
      const { code, result } = res;
      if (code === 0) {
        const list = balanceList.map((item) => assign(item, {
          withdrawableBalance: get(
            result.find((r) => r.currency === item.key),
            'withdrawableBalance',
            0,
          ),
        }));

        setBalanceList(list);
      }
    } catch (e) {
      console.log(e);
    }

    setBalanceLoading(false);
  };

  useEffect(() => {
    fetchUserInfo();
    fetchBalance();
  }, []);

  const [visible, setVisible] = useState(false);

  const accountList = useMemo(
    () => [
      {
        label: (
          <div className="f-s-30 f-bold flex-l-c">
            <FormattedMessage id={accountInfo.isFinan ? 'finan' : 'cash'} />
            <FormattedMessage id="account" />
            <span className="num-font">
              {accountInfo.account.split('').reverse().slice(0, 4).reverse()
                .join('')}
              (
              {moneyInfo.currency}
              )
            </span>
            { !accountInfo.isFinan && (
              <span
                styleName="upgrade-btn"
                onClick={() => {
                  openNewPage(
                    {
                      pageType: PageType.HTML,
                      path: `${gatewayServer}/account-upgrade.html`,
                      title: formatMessage({ id: 'open_account_datum' }),
                    },
                    false,
                  );
                }}
              >
                <IconSvg path="icon_upgrade" className="m-r-10" />
                <FormattedMessage id="upgrade" />
              </span>
            )}
          </div>
        ),
      },
      {
        label: (
          <div className="color-assist">
            <FormattedMessage id="total_assets" />
          </div>
        ),
        content: <div className="num-font">{sliceString(moneyInfo.totalAsset)}</div>,
      },
      {
        label: (
          <div className=" color-assist">
            <FormattedMessage id="today_profit_and_loss" />
          </div>
        ),
        content: <div className="num-font">{sliceString(moneyInfo.profit, { sign: true })}</div>,
      },
      {
        label: (
          <div className="color-assist">
            <FormattedMessage id="position_profit_and_loss" />
          </div>
        ),
        content: (
          <div className={`num-font color-${numberClass(moneyInfo.totalIncome, 'rise', 'full')}`}>
            {sliceString(moneyInfo.totalIncome, { sign: true })}
          </div>
        ),
      },
      {
        label: (
          <div className="color-assist">
            <FormattedMessage id="total_market_value_of_securities" />
          </div>
        ),
        content: <div className="num-font">{sliceString(moneyInfo.totalMarketValue)}</div>,
      },
      {
        label: (
          <div className="color-assist flex-1">
            <FormattedMessage id="available_cash" />
          </div>
        ),
        content: (
          <>
            <span
              styleName="capsule-btn"
              className="border-1px"
              onClick={() => {
                openNewPage(
                  {
                    pageType: PageType.HTML,
                    path: `${flowCapitalServer}/#/home`,
                    title: formatMessage({ id: 'title_of_receiving_account' }),
                  },
                  false,
                );
              }}
            >
              <FormattedMessage id="deposit_money" />
            </span>
            <span className="num-font m-l-20">{sliceString(moneyInfo.ledgerBalace)}</span>
          </>
        ),
      },
      {
        label: (
          <div className="color-assist">
            <FormattedMessage id="frozen_capital" />
          </div>
        ),
        content: <div className="num-font">{sliceString(moneyInfo.holdAmount)}</div>,
      },
      {
        label: (
          <div className="color-assist">
            <FormattedMessage id="max_purchasing_power" />
          </div>
        ),
        content: <div className="num-font">{sliceString(moneyInfo.buyingPower)}</div>,
      },
    ],
    [moneyInfo, accountInfo],
  );

  return (
    <FullScreenPageView title={formatMessage({ id: 'account_details' })} backgroundImg={bg}>
      {/* <Loading isLoading={loading} bgColor="transparent"> */}
      <div styleName="account-details">
        <BasicCard styleName="basic-card">
          {accountList.map((item, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={i} className="flex-c-between">
              {item.label}
              {item.content}
            </div>
          ))}
        </BasicCard>
        {/* 现金 */}
        <BasicCard styleName="basic-card">
          <div className="flex-c-between">
            <span className="f-s-30 f-bold">
              <FormattedMessage id="cash" />
            </span>
            <span
              styleName="capsule-btn"
              className="border-1px"
              onClick={() => {
                // openNewPage({
                //   pageType: PageType.HTML,
                //   path: 'currency-change.html',
                //   title: formatMessage({ id: 'currency_change' }),
                //   fullScreen: true,
                // });
                setVisible(true);
              }}
            >
              <FormattedMessage id="currency_change" />
            </span>
          </div>
          {balanceList.map((item) => (
            <div className="flex-c-between" key={item.key}>
              <div>
                <CurrencyDom
                  className="flex-c-between"
                  currency={item.key}
                  text={(
                    <span className="color-assist m-l-10">
                      {item.label}
                      <span className="num-font">{item.key}</span>
                    </span>
                  )}
                />
              </div>
              <div className="num-font">{sliceString(item.withdrawableBalance)}</div>
            </div>
          ))}
        </BasicCard>
        {/* 借款 */}
        <BasicCard styleName="basic-card">
          <div className="flex-c-between">
            <span className="f-s-30 f-bold">
              <FormattedMessage id="borrow_money" />
            </span>
            <span
              className="f-s-26 color-desc"
              onClick={() => {
                // openNewPage({
                //   pageType: PageType.HTML,
                //   path: 'borrow-money-details.html',
                //   title: formatMessage({ id: 'borrow_money' }) + formatMessage({ id: 'detail' }),
                // });
                Toast.show({ content: formatMessage({ id: 'wait_join_up' }) });
              }}
            >
              <FormattedMessage id="detail" />
              <img styleName="more-arrow" src={iconRightArrow} alt="" />
            </span>
          </div>
          <div className="flex-c-between">
            <div className="color-assist flex-1">
              <FormattedMessage id="amount_payable" />
            </div>
            <span
              styleName="capsule-btn"
              className="border-1px"
              onClick={() => {
                openNewPage(
                  {
                    pageType: PageType.HTML,
                    path: `${flowCapitalServer}/#/home`,
                    title: formatMessage({ id: 'title_of_receiving_account' }),
                  },
                  false,
                );
              }}
            >
              <FormattedMessage id="deposit_money" />
            </span>
            <span className="num-font m-l-20">{sliceString(moneyInfo.paymentAmount)}</span>
          </div>
          <BasicCard styleName="sub-card">
            <div className="flex-c-between p-b-20">
              <div className="color-assist">
                <FormattedMessage id="borrowing_balance" />
              </div>
              <span className="num-font">{sliceString(moneyInfo.debtAmount)}</span>
            </div>
            <div className="flex-c-between">
              <div className="color-assist">
                <FormattedMessage id="interest_payable" />
              </div>
              <span className="num-font">{sliceString(moneyInfo.debtInterest)}</span>
            </div>
          </BasicCard>
          {accountInfo.isFinan && (
            <div className="flex-c-between">
              <div className="color-assist">
                <FormattedMessage id="remaining_available_financing" />
              </div>
              <span className="num-font">{sliceString(moneyInfo.surpMarginableAmout || 0)}</span>
            </div>
          )}
          <BorrowingBalance showCharts={accountInfo.isFinan} level={moneyInfo.debtLevel} />
        </BasicCard>
      </div>
      {/* </Loading> */}
      <BaseModal
        visible={visible}
        title={formatMessage({ id: 'hint' })}
        confirmText={formatMessage({ id: 'contact_the_customer_service' })}
        cancelText={formatMessage({ id: 'cancel' })}
        onCancel={() => setVisible(false)}
        onConfirm={() => {
          setVisible(false);
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
    </FullScreenPageView>
  );
};

export default PositionDistribution;
