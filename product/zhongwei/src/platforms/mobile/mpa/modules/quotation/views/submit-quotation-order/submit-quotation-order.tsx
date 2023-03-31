/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Grid, Toast } from 'antd-mobile';
import BasicCard from '@mobile/components/basic-card/basic-card';
import CountInput from '@/platforms/mobile/components/count-input/count-input';
import IconBot from '@mobile/images/icon_bot.svg';
import IconTop from '@mobile/images/icon_top.svg';

import IconNotSelect from '@mobile/images/icon_not_select.svg';
import IconSelect from '@mobile/images/icon_select.svg';

import { useSetState, useUpdateEffect } from 'ahooks';
import DateModal from '@/platforms/mobile/components/date-modal/date-modal';
import { useContext, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';

import './submit-quotation-order.scss';
import { buyQuote, getQuoteInfo, verifyQuoteOrder } from '@/api/module-api/quotation';
import { getUrlParam, toFixed } from '@/utils';
import { getMoneyInfo, getTradeAccountInfo, withdraw } from '@/api/module-api/trade';
import { toThousand } from '@dz-web/o-orange';
import { PageType, openNewPage } from '@/platforms/mobile/helpers/native/msg';
import { FormattedMessage, useIntl } from 'react-intl';
import { userConfigContext } from '@/platforms/mobile/helpers/entry/native';
import { joinUrl } from '@/platforms/mobile/helpers/native/url';

const periodText = ['', <FormattedMessage id="day" />, <FormattedMessage id="month" />, <FormattedMessage id="week" />];

type ItemList = Partial<{ label: any; content: any; line: any; diy: any }>[];
const params = getUrlParam();

const ListRender = (props: { list: ItemList }) => (
  <Grid columns={10}>
    {props.list.map((item) => {
      if (!item) return null;

      if (item.line) {
        return (
          <Grid.Item span={10}>
            <div className="line" />
          </Grid.Item>
        );
      }

      if (item.diy) return item.diy;

      return [
        <Grid.Item span={4} styleName="desc-label">
          {item.label}
        </Grid.Item>,
        <Grid.Item span={6} styleName="form-content">
          {item.content}
        </Grid.Item>,
      ];
    })}
  </Grid>
);

const SubmitQuotationOrder = () => {
  const { formatMessage } = useIntl();

  const userConfig = useContext<any>(userConfigContext);
  const lang = useMemo<string>(() => {
    const { language = 'zh-CN' } = userConfig;
    return language;
  }, [userConfig]);

  const [info, setInfo] = useState({
    availableArea: '',
    currency: '',
    id: '',
    img: '',
    name: '',
    period: 2, // 套餐周期[1:天,2:月,3:周]
    price: 0,
    specialEndDate: '',
    specialStartDate: '',
    terminal: [],
    enableStart: new Date(),
  });
  const [dateVisible, setDateVisible] = useState(false);
  const [checked, setChecked] = useState(false);
  const [accountInfo, setAccount] = useState({
    accountType: '',
    account: '',
  });

  const [fund, setFund] = useState([]);

  const [form, setForm] = useSetState({
    num: 1,
    enableStart: '',
    enableEnd: dayjs().endOf('month').format('YYYY/MM/DD'),
    amount: 0,
    disableStart: true,
  });

  useEffect(() => {
    if (!params?.id) return;

    getQuoteInfo({
      id: params?.id,
    })
      .then((res) => {
        if (res && res.code === 0) {
          const { enableStart = dayjs().format('YYYY-MM-DD') } = res.result;
          setInfo({
            ...res.result,
            enableStart: dayjs().isBefore(enableStart)
              ? new Date(enableStart)
              : new Date(),
          });
          setForm({ enableStart: dayjs().isBefore(enableStart)
            ? enableStart
            : dayjs().format('YYYY-MM-DD'),
          });
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    getMoneyInfo().then((res) => {
      if (res?.code === 0) {
        setFund(res.result);
      }
    });

    getTradeAccountInfo().then((res) => {
      if (res?.code === 0) {
        const { accountType, account } = res.result;
        setAccount({ accountType, account });
      }
    });
  }, []);

  const fetchVerifyQuoteOrder = () => {
    verifyQuoteOrder({
      enableStart: form.enableStart,
      num: form.num,
      packageId: params?.id,
    }).then((res) => {
      const { code, result } = res;
      if (code === 0) {
        setForm(result);
        return;
      }
      Toast.show(res.message);
    });
  };

  useUpdateEffect(() => {
    fetchVerifyQuoteOrder();
  }, [form.num, form.enableStart]);

  // 得到可用余额
  const balance = useMemo<number>(() => {
    if (!fund.length) return 0;
    const currentBalances = fund.find((item: any) => item.currency === info?.currency) || ({} as any);
    return currentBalances?.ledgerBalace || 0;
  }, [fund]);

  const submit = async () => {
    const autoRenew = params?.renew === 'true';
    const packageId = params?.id;

    Toast.show({
      icon: 'loading',
      duration: 0,
    });
    try {
      const res = await buyQuote({
        num: form.num,
        enableStart: form.enableStart,
        autoRenew,
        packageId,
        tradeAccount: accountInfo.account,
      });
      if (res.code !== 0) {
        Toast.show({ content: res.message });
        return;
      }
      await withdraw({ amount: form.amount, currency: info.currency, remark: '购买行情套餐' });
      openNewPage({
        path: 'quote-order-finish.html',
        pageType: PageType.HTML,
        replace: true,
      });
      console.log('ok');
    } catch (error) {
      console.log('支付异常：', error);
    }
    Toast.clear();
  };

  return (
    <div styleName="quotation-order">
      {/* 套餐信息 */}
      <BasicCard>
        <div styleName="info">
          <div styleName="icon">
            <img src={info.img} alt="" />
          </div>
          <div styleName="message">
            <div>
              <div styleName="title-text">{info.name}</div>
              <div styleName="desc-text">{info.availableArea}</div>
            </div>
            <div>
              <span styleName="num" className="num-font">
                {info.price}
              </span>
              &nbsp;
              <span>
                <span>{info.currency}</span>
                /
                <span>{periodText[info.period]}</span>
              </span>
            </div>
          </div>
        </div>
      </BasicCard>
      <div styleName="title">
        <FormattedMessage id="order_info" />
      </div>
      {/* 表单 */}
      <BasicCard>
        <div styleName="form">
          <DateModal
            title={formatMessage({ id: 'effective_time' })}
            visible={dateVisible}
            value={new Date(form.enableStart)}
            start={new Date(info.enableStart)}
            onOk={(v) => {
              setForm({ enableStart: dayjs(v).format('YYYY-MM-DD') });
              setDateVisible(false);
            }}
            onCancel={() => {
              setDateVisible(false);
            }}
          />
          <ListRender
            list={[
              {
                label: formatMessage({ id: 'quantity_ordered' }),
                content: (
                  <CountInput
                    styleName="num-text"
                    value={form.num}
                    change={(v) => setForm({ num: +v })}
                    plus={() => setForm({ num: form.num + 1 })}
                    minus={() => {
                      if (form.num - 1 > 0) {
                        setForm({ num: form.num - 1 });
                      }
                    }}
                  />
                ),
              },
              { line: true },
              {
                label: formatMessage({ id: 'expected_effective_time' }),
                content: (
                  <div
                    styleName="form-time"
                    className="num-font"
                    onClick={() => !form.disableStart && setDateVisible(!dateVisible)}
                  >
                    {dayjs(form.enableStart).format('YYYY/MM/DD')}
                    <img src={dateVisible ? IconTop : IconBot} alt="" />
                  </div>
                ),
              },
              { line: true },
              {
                label: formatMessage({ id: 'expiration_time' }),
                content: (
                  <div styleName="form-time" className="num-font">
                    {form.enableEnd}
                  </div>
                ),
              },
              { line: true },
              {
                diy: (
                  <Grid.Item span={10}>
                    <div styleName="desc-tip">
                      <FormattedMessage id="order_duration_desc_tip" />
                    </div>
                  </Grid.Item>
                ),
              },
            ]}
          />
        </div>
      </BasicCard>
      <div styleName="title">
        <FormattedMessage id="declining_account" />
      </div>
      <BasicCard>
        <div styleName="form account-form">
          <ListRender
            list={[
              {
                label: formatMessage({ id: 'account_number' }),
                content: (
                  <div styleName="form-time">
                    <FormattedMessage id={accountInfo?.accountType === 'M' ? 'final_account' : 'cash_account'} />
                    {' '}
                    <span className="num-font">{accountInfo?.account}</span>
                  </div>
                ),
              },
              { line: true },
              {
                label: formatMessage({ id: 'available_balance' }),
                content: (
                  <div styleName="form-time" className="num-font">
                    {balance.toLocaleString()}
                  </div>
                ),
              },
              { line: true },
              {
                diy: (
                  <Grid.Item span={10}>
                    <div styleName="desc-tip">
                      <FormattedMessage id="order_deduct_desc_tip" />
                    </div>
                  </Grid.Item>
                ),
              },
            ]}
          />
        </div>
      </BasicCard>
      {/* <BasicCard>
        <div styleName="form discount-coupon">
          <div styleName="left">使用行情优惠券</div>
          <div styleName="right">
            <div styleName="tag">3张可用</div>
            <div styleName="text" className="num-font">-50.00 HKD</div>
            <img src={IconMore} alt="" />
          </div>
        </div>
      </BasicCard> */}
      <div
        styleName="check-box"
        onClick={() => {
          setChecked(!checked);
        }}
      >
        <img alt="" src={checked ? IconSelect : IconNotSelect} />
        <span>
          <FormattedMessage id="read_agree_abide_by" />
          <span
            className="t-link"
            onClick={() => {
              openNewPage({
                path: joinUrl(`static/pdf/quote-use-disclaimer-${lang === 'zh-CN' ? 'CN' : 'TW'}.pdf`),
                pageType: PageType.PDF,
              });
            }}
          >
            <FormattedMessage id="quotations_use_disclaimers" />
          </span>
        </span>
      </div>
      <div styleName="footer">
        <span>
          <FormattedMessage id="summation" />
        </span>
        <span styleName="count-text" className="num-font">
          {toThousand(toFixed(form.amount))}
          {' '}
          {info.currency}
        </span>
        <div
          styleName="submit-button"
          onClick={() => {
            if (!checked) {
              Toast.show(formatMessage({ id: 'please_check_the_disclaimer' }));
              return;
            }

            if (form.amount > balance) {
              Toast.show(formatMessage({ id: 'insufficient_fund' }));
              return;
            }

            submit();
          }}
        >
          <FormattedMessage id="confirm_payment" />
        </div>
      </div>
    </div>
  );
};

export default SubmitQuotationOrder;
