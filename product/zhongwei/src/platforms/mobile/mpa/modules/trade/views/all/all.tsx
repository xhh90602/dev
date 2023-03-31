import IconSvg from '@/platforms/mobile/components/icon-svg';
import { normalCall, openNewPage, PageType } from '@/platforms/mobile/helpers/native/msg';
import BaseModal from '@/platforms/mobile/components/basic-modal/basic-modal';
import { Toast } from 'antd-mobile';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import './all.scss';

const { flowCapitalServer, gatewayServer } = window.GLOBAL_CONFIG.COMMON_SERVERS;

const list = [
  {
    label: 'trade',
    navList: [
      {
        label: 'buying',
        icon: 'icon_nav_buy',
        url: 'trade.html#/buy',
        title: '下单买入',
      },
      {
        label: 'sale',
        icon: 'icon_nav_sell',
        url: 'trade.html#/sell',
        title: '下单卖出',
      },
      {
        label: 'combined_warehouse_adjustment',
        title: '组合调仓',
        icon: 'icon_nav_group_warehouse',
        url: 'combination-position.html',
      },
      {
        label: 'my_order',
        title: '我的订单',
        icon: 'icon_nav_my_order',
        url: 'trade.html#/my-order',
        fullScreen: true,
      },
    ],
  },
  {
    label: 'stocks',
    navList: [
      {
        label: 'new_stock_ipo',
        title: '新股IPO',
        icon: 'icon_nav_ipo',
        url: 'ipo_center',
        native: true,
      },
      {
        label: 'stocks_roll_in',
        title: '股票转入',
        icon: 'icon_nav_stock_in',
        url: 'stock-roll.html',
        fullScreen: true,
      },
      {
        label: 'stocks_roll_out',
        title: '股票转出',
        icon: 'icon_nav_stock_off',
        url: 'stock-roll.html?type=out',
        fullScreen: true,
      },
    ],
  },
  {
    label: 'capital',
    navList: [
      {
        label: 'capital_deposit',
        title: '存入资金',
        icon: 'icon_nav_capital_save',
        fullUrl: `${flowCapitalServer}/#/home`,
        url: '',
      },
      {
        label: 'capital_extract',
        title: '提取资金',
        icon: 'icon_nav_coin_exchange',
        fullUrl: `${flowCapitalServer}/#/money-extract`,
        url: '',
      },
      {
        label: 'currency_change',
        title: '货币兑换',
        icon: 'icon_nav_money_change',
        // url: 'currency-change.html',
        url: '',
      },
      {
        label: 'capital_details',
        title: '资金明细',
        icon: 'icon_nav_money_detail',
        url: 'financial-details.html',
      },
    ],
  },
  {
    label: 'account',
    navList: [
      {
        label: 'assets_analysis',
        title: '资产分析',
        icon: 'icon_nav_capital_analyze',
        url: '',
      },
      {
        label: 'account_details',
        title: '账户详情',
        icon: 'icon_nav_account_info',
        url: 'account-details.html',
        fullScreen: true,
      },
      {
        label: 'trade_setting',
        title: '交易设置',
        icon: 'icon_nav_setting',
        url: 'trade.html#/setting',
      },
      {
        label: 'trafe_pwd',
        title: '交易密码',
        icon: 'icon_nav_password',
        url: 'trade_pwd',
        native: true,
      },
      {
        label: 'bank_account',
        title: '银行账户',
        icon: 'icon_nav_bank_account',
        fullUrl: `${flowCapitalServer}/#/bank-card-manage`,
        url: '',
      },
      {
        label: 'account_upgrade',
        title: '账户升级',
        icon: 'icon_nav_account_update',
        url: '',
        fullUrl: `${gatewayServer}/account-upgrade.html`,
      },
      {
        label: 'trade_fee',
        title: '交易费率',
        icon: 'icon_nav_rate',
        url: 'my-fee.html',
      },
      {
        label: 'my_statement',
        title: '我的结单',
        icon: 'icon_nav_my_final_order',
        url: 'my-settle-order.html',
        fullScreen: true,
      },
      {
        label: 'account_number',
        title: '账户号码',
        icon: 'icon_nav_number',
        url: 'account-number.html',
        fullScreen: true,
      },
      {
        pageTitle: 'personage_account_datum',
        label: 'open_account_datum',
        title: '个人资料',
        icon: 'icon_nav_open_account',
        url: '',
        fullUrl: `${gatewayServer}/account-opening-info.html`,
      },
      {
        label: 'risk_evaluating',
        title: '风险评测',
        icon: 'icon_nav_risk',
        url: '',
        fullUrl: `${gatewayServer}/risk-evaluation.html`,
        fullScreen: true,
      },
    ],
  },
];

const All = () => {
  const { formatMessage } = useIntl();
  const [label, setLabel] = useState('');

  const navItemClick = (item: {
    label: string;
    icon: string;
    url: string;
    title: string;
    pageTitle?: string,
    fullUrl?: string;
    fullScreen?: boolean;
    native?: boolean;
  }) => {
    const { url, fullUrl, fullScreen, native } = item;
    const path = fullUrl || url;
    if (item.label === 'currency_change') {
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
        title: formatMessage({ id: item.pageTitle || item.label }),
        fullScreen,
      },
      !fullUrl,
    );
  };

  return (
    <div styleName="all-box">
      <BaseModal
        visible={label === 'currency_change'}
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
      {list.map((v) => (
        <div styleName="nav" key={v.label}>
          <div styleName="title">
            <FormattedMessage id={v.label} />
          </div>
          <div styleName="nav-box">
            {v.navList.map((nav) => (
              <div key={nav.icon} styleName="nav-item" onClick={() => navItemClick(nav)}>
                <div>
                  <IconSvg path={nav.icon} />
                </div>
                <div>
                  <FormattedMessage id={nav.label} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default All;
