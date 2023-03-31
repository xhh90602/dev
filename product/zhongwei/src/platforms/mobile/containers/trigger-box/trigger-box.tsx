import { TRIGGER_EXECUTE_TYPE, TRIGGER_TYPE } from '@/constants/trigger-trade';
import { getProductInfo } from '@/api/module-api/trade';
import { TRADE_ORDER_TYPE } from '@/constants/trade';
import { initCountPrice, returnJavaMarket } from '@/utils';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Tabs from '@mobile/components/tabs/tabs';
import LContent from './l-content';
import RContent from './r-content';
import SContent from './s-content';
import './trigger-box.scss';

const titleTabs = (bs) => {
  const titles = [
    {
      title: <FormattedMessage id="price_change_rate" />,
      key: TRIGGER_TYPE.L,
    },
    {
      title: <FormattedMessage id="price_terms" />,
      key: TRIGGER_TYPE.S,
    },
  ];

  titles.push(
    bs === TRADE_ORDER_TYPE.SELL
      ? {
        title: <FormattedMessage id="pullback_selling" />,
        key: TRIGGER_TYPE.R,
      }
      : {
        title: <FormattedMessage id="buy_a_bounce" />,
        key: TRIGGER_TYPE.R,
      },
  );

  return titles;
};

const { defaultPriceChange = [1, 1] } = window.GLOBAL_CONFIG.TRADE_CONFIG;

/** 触发条件 */
const TriggerBox = (props) => {
  const { bs, code, market, state, setState, execute, setExecute } = props;

  const [priceInfo, setPriceInfo] = useState({
    bigMarket: 0,
    code: '',
    lotsize: 0,
    nowPrice: 0,
    openPrice: 0,
    prevClose: 0,
    smallMarket: 0,
    tradeMarket: '',
  });

  const changeNumber = useMemo(() => {
    if (state.sPrice) {
      return initCountPrice(returnJavaMarket(market), {
        now: Number(state.sPrice || 0),
      });
    }

    return defaultPriceChange;
  }, [state.sPrice, market]);

  /** 获取 行情价格 */
  useEffect(() => {
    if (!code) return;
    getProductInfo({
      code,
      tradeMarket: returnJavaMarket(market),
    })
      .then((res) => {
        const { result = [] } = res;
        setPriceInfo(result[0] || {});
      })
      .catch((err) => console.log(err, '--> err'));
  }, [code, market]);

  const setExecutePrice = (v: string) => {
    /** 以触发价买入，同步更新 */
    if (execute.executeType === TRIGGER_EXECUTE_TYPE.C) {
      setExecute({ executePrice: v });
    }
  };

  const sContent = (
    <SContent
      sPrice={state.sPrice}
      changeNum={changeNumber}
      market={market}
      setSPrice={(v) => {
        if (Number(v) < 0) {
          setState({
            sPrice: 0,
          });
          return;
        }

        setState({
          sPrice: v,
        });
      }}
      setExecutePrice={setExecutePrice}
    />
  );

  const lContent = (
    <LContent
      bs={bs}
      lRatio={state.lRatio}
      priceInfo={priceInfo}
      lType={state.lType}
      lOption={state.lOption}
      setLPrice={(v) => {
        setState({ lPrice: v });
      }}
      setLTypePrice={(v) => {
        setState({ lTypePrice: v });
      }}
      setLOption={(v) => {
        setState({ lOption: v });
      }}
      setLType={(v) => {
        setState({ lType: v });
      }}
      setlRatio={(v) => {
        if (Number(v) < 0) {
          setState({
            lRatio: 0,
          });
          return;
        }
        // if (Number(v) > 5) return;

        setState({
          lRatio: v,
        });
      }}
      setExecutePrice={setExecutePrice}
    />
  );

  const rContent = (
    <RContent
      bs={bs}
      {...{
        rLowestRise: state.rLowestRise,
        rTopLower: state.rTopLower,
        setRLowestRise: (v) => {
          if (Number(v) < 0) return;
          setState({ rLowestRise: v });
        },
        setRTopLower: (v) => {
          if (Number(v) < 0) return;
          setState({ rTopLower: v });
        },
      }}
    />
  );

  const tabChange = (key) => {
    /** 反弹买入、回落卖出没有 指定价 */
    if (key === TRIGGER_TYPE.R) {
      setExecute({ executeType: TRIGGER_EXECUTE_TYPE.C });
    }
    setState({ type: key });
  };

  const tabList = useMemo(() => titleTabs(bs), [bs]);

  const triggerShow = useMemo(() => {
    if (state.type === TRIGGER_TYPE.S) {
      return sContent;
    }

    if (state.type === TRIGGER_TYPE.R) {
      return rContent;
    }

    return lContent;
  }, [state, code, market, bs, priceInfo]);

  return (
    <div styleName="trigger-box" className="basic-card">
      <div styleName="title">
        <FormattedMessage id="trigger_condition" />
      </div>
      <Tabs className="bold-bg basic-card" list={tabList} activeKey={state.type} onChange={tabChange} />
      {triggerShow}
    </div>
  );
};

export default React.memo(TriggerBox);
