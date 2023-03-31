import BasicCard from '@/platforms/mobile/components/basic-card/basic-card';
import IconSvg from '@/platforms/mobile/components/icon-svg';
import NavBar from '@/platforms/mobile/components/nav-bar/nav-bar';
import { CURRENCY_TYPE } from '@/platforms/mobile/constants/config';
import { openNewPage, PageType } from '@/platforms/mobile/helpers/native/msg';
import { floatNumStr, getUrlParam, toThousands } from '@/utils';
import { toFixed } from '@dz-web/o-orange';
import { Input, Popover, Toast } from 'antd-mobile';
import { InformationCircleOutline } from 'antd-mobile-icons';
import { useEffect, useRef, useState } from 'react';
import './currency-change.scss';
import { getCurrencyRate, getMoneyInfo } from '@/api/module-api/trade';
import { assign, get } from 'lodash-es';
import CurrencyDom from '@mobile/components/currency-dom/currency-dom';
import CurrencyModal from './modal';
import BalanceModal from './BalanceModal';
import ChangeRateModal from './ChangeRateModal';

export const currencyList = [
  {
    label: '港币',
    key: CURRENCY_TYPE.HKD,
  },
  {
    label: '人民币',
    key: CURRENCY_TYPE.CNY,
  },
  {
    label: '美元',
    key: CURRENCY_TYPE.USD,
  },
];

const CurrencyChange = () => {
  const currDomRef = useRef<HTMLDivElement>(null);
  const changeDomRef = useRef<HTMLDivElement>(null);

  /** 卖出币种 */
  const [currCurrency, setCurrCurrency] = useState(currencyList[0]);
  /** 买入币种 */
  const [changeCurrency, setChangeCurrency] = useState(currencyList[1]);
  /** 卖出金额 */
  const [currNum, setCurrNum] = useState('');
  /** 买入金额 */
  const [changeNum, setChangeNum] = useState('');
  /** 貨幣兌換明細modal开关 */
  const [visible, setVisible] = useState(false);
  /** 账户现金余额modal开关 */
  const [balanceVisible, setBalanceVisible] = useState(false);
  /** 兑换比例说明modal开关 */
  const [changeRateVisible, setChangeRateVisible] = useState(false);
  /** 账户现金余额 */
  const [balanceList, setBalanceList] = useState(
    currencyList.map((item) => ({
      ...item,
      banlance: 0,
    })),
  );
  /** 汇率 */
  const [rate, setRate] = useState(1);

  const fetchBalance = () => {
    getMoneyInfo({}).then((res) => {
      const { code, result } = res;
      if (code === 0) {
        const list = balanceList.map((item) => assign(item, {
          banlance: get(
            result.find((r) => r.currency === item.key),
            'ledgerBalace',
            0,
          ),
        }));
        console.log(list);

        setBalanceList(list);
      }
    });
  };

  const fetchCurrencyRate = () => {
    getCurrencyRate({
      fromCurrency: currCurrency.key,
      toCurrency: changeCurrency.key,
    }).then((res) => {
      const { code, result } = res;
      if (code === 0) {
        setRate(result.rate);
      }
    });
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  useEffect(() => {
    fetchCurrencyRate();
    setCurrNum('');
    setChangeNum('');
  }, [currCurrency.key, changeCurrency.key]);

  /**
   * 全部兑换
   */
  const allChange = () => {
    const value = balanceList.find((item) => item.key === currCurrency.key)?.banlance || 0;
    setCurrNum(value.toFixed(2).toString());
    setChangeNum(value ? (Number(floatNumStr(value)) * rate).toFixed(2).toString() : value.toString());
  };

  const submit = () => {
    if (currNum && changeNum) {
      setVisible(true);
    } else {
      Toast.show({
        content: '请输入兑换金额',
      });
    }
  };

  const { safeAreaTop = 0 } = getUrlParam();

  return (
    <div styleName="container" style={{ '--safe-area-top': `${safeAreaTop}px` }}>
      <NavBar
        title="货币兑换"
        right={(
          <div
            styleName="sub-title"
            onClick={() => {
              openNewPage({
                path: 'currency-change-history.html',
                pageType: PageType.HTML,
                title: '兑换记录',
              });
            }}
          >
            兑换记录
          </div>
        )}
      />
      <div styleName="page">
        <BalanceModal visible={balanceVisible} onClose={() => setBalanceVisible(false)} />
        <ChangeRateModal visible={changeRateVisible} onClose={() => setChangeRateVisible(false)} />
        <CurrencyModal
          data={{
            currCurrency,
            changeCurrency,
            currNum,
            changeNum,
            rate,
          }}
          visible={visible}
          onClose={() => setVisible(false)}
        />
        <div styleName="currency-list">
          <BasicCard>
            <div styleName="desc-text">原币种</div>
            <div ref={currDomRef}>
              <Popover.Menu
                getContainer={() => currDomRef.current as any}
                actions={currencyList
                  .filter((v) => v.key !== changeCurrency.key)
                  .map((v) => ({
                    text: v.label,
                    key: v.key,
                    onClick: () => {
                      setCurrCurrency(v);
                    },
                  }))}
                placement="bottom-end"
                onAction={(node) => console.log(`选择了 ${node.text}`)}
                trigger="click"
              >
                <CurrencyDom
                  styleName="currency-text"
                  currency={currCurrency.key}
                  text={(
                    <>
                      <span styleName="currency-text-label">{currCurrency.label}</span>
                      <IconSvg path="icon_arrow_open" />
                    </>
                  )}
                />
              </Popover.Menu>
            </div>
          </BasicCard>
          <div styleName="icon">
            <IconSvg path="icon_currency_change" />
          </div>
          <BasicCard styleName="change-currency">
            <div styleName="desc-text">兑换币种</div>
            <div ref={changeDomRef}>
              <Popover.Menu
                getContainer={() => changeDomRef.current as any}
                actions={currencyList
                  .filter((v) => v.key !== currCurrency.key)
                  .map((v) => ({
                    text: v.label,
                    key: v.key,
                    onClick: () => {
                      setChangeCurrency(v);
                    },
                  }))}
                placement="bottom-end"
                onAction={(node) => console.log(`选择了 ${node.text}`)}
                trigger="click"
              >
                <CurrencyDom
                  styleName="currency-text"
                  currency={changeCurrency.key}
                  text={(
                    <>
                      <span styleName="currency-text-label">{changeCurrency.label}</span>
                      <IconSvg path="icon_arrow_open" />
                    </>
                  )}
                />
              </Popover.Menu>
            </div>
          </BasicCard>
        </div>
        <BasicCard styleName="form">
          <div styleName="label">
            賣出
            {currCurrency.label}
          </div>
          <div className="flex-c-between">
            <Input
              value={currNum}
              onChange={(v) => {
                let val = v;
                const balan = balanceList.find((item) => item.key === currCurrency.key);
                if (balan && Number(val) > balan.banlance) {
                  val = balan.banlance.toString();
                }
                setCurrNum(floatNumStr(val));
                setChangeNum(val ? (Number(floatNumStr(val)) * rate).toFixed(2).toString() : val);
              }}
              onBlur={() => {
                if (!currNum) return;
                setCurrNum(Number(currNum).toFixed(2).toString());
              }}
              placeholder={`请输入${currCurrency.label}金额(${currCurrency.key})`}
              clearable
            />
            <div styleName="input-btn-text" onClick={allChange}>
              全部兑换
            </div>
          </div>
          <div className="line m-b-30 m-t-30" />
          <div styleName="label">
            買入
            {changeCurrency.label}
          </div>
          <div>
            <Input
              value={changeNum}
              onChange={(v) => {
                let val = v;
                const balan = balanceList.find((item) => item.key === changeCurrency.key);
                if (balan && Number(val) > balan.banlance) {
                  val = balan.banlance.toString();
                }
                setChangeNum(floatNumStr(val));
                setCurrNum(val ? (Number(floatNumStr(val)) / rate).toFixed(2).toString() : val);
              }}
              onBlur={() => {
                if (!currNum) return;
                setChangeNum(Number(changeNum).toFixed(2).toString());
              }}
              placeholder={`请输入${changeCurrency.label}金额(${changeCurrency.key})`}
              clearable
            />
            <div className="line m-b-20 m-t-30" />
            <div className="flex-c-between">
              <div className="t-desc">参考汇率</div>
              <div className="num-font">
                <InformationCircleOutline
                  color="var(--adm-color-weak)"
                  fontSize="0.28rem"
                  onClick={() => {
                    setChangeRateVisible(true);
                  }}
                />
                &nbsp; 1
                {currCurrency.key}
                =
                {rate}
                {changeCurrency.key}
              </div>
            </div>
            <div className="flex-c-between">
              <div className="t-desc">參考佣金</div>
              <div className="num-font">
                2.0
                {changeCurrency.key}
                (0.002%)
              </div>
            </div>
            <div styleName="submit-btn" onClick={submit}>
              兑换
            </div>
          </div>
        </BasicCard>
        <BasicCard styleName="account-funds">
          <div styleName="title">
            账户现金余额&nbsp;
            <InformationCircleOutline
              color="var(--adm-color-weak)"
              fontSize="0.28rem"
              onClick={() => {
                setBalanceVisible(true);
              }}
            />
          </div>
          {balanceList.map((item) => (
            <div styleName="fund-item" key={item.key}>
              <div>
                <CurrencyDom
                  currency={item.key}
                  text={(
                    <span styleName="fund-text">
                      {item.label}
                      {item.key}
                    </span>
                  )}
                />
              </div>
              <div className="t-normal">{toThousands(toFixed(item.banlance))}</div>
            </div>
          ))}
        </BasicCard>
        <div styleName="tip">
          <p>温馨提示：</p>
          <p>1.頁面中展示的匯率兌換比例僅供參考，請以實際兌換後的金額為准；</p>
          <p>
            2.貨幣兌換截止時間為星期一至五（非香港公眾假期）下午四時。15萬美金（或等值110萬港元）以下兌換，於截止時間之前發出的，以中銀時間為準。
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrencyChange;
