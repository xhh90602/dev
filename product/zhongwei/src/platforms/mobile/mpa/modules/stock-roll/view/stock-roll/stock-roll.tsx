import './stock-roll.scss';
import { getUrlParam } from '@/utils';
import { useEffect, useMemo, useRef } from 'react';
import doneIcon from '@mobile/images/icon_select.svg';
import unDoneIcon from '@mobile/images/icon_undone.svg';
import { pageBack } from '@/platforms/mobile/helpers/native/msg';
import { FormattedMessage } from 'react-intl';
import FullScreenPageView from '@/platforms/mobile/components/full-screen-page-view/full-screen-page-view';
import useStockRoll from '@/hooks/stock-roll/use-stock-roll';
import { Toast } from 'antd-mobile';
import RollInHintModal from '../../components/roll-in-hint-modal/roll-in-hint-modal';
import SelectMarket from '../../components/select-market/select-market';
import BroketInfo from '../../components/broker-info/broker-info';
import StockInfo from '../../components/stock-info/stock-info';
import ConfirmInfo from '../../components/confirm-info/confirm-info';
import SubmitResult from '../../components/submit-result/submit-result';

const stepList = [
  {
    step: 1,
    endStep: 2,
    text: <FormattedMessage id="register_stocks" />,
  },
  {
    step: 3,
    endStep: 3,
    text: <FormattedMessage id="confirm_info" />,
  },
  {
    step: 4,
    endStep: 4,
    text: <FormattedMessage id="finish_submit" />,
  },
];

/**
 * @type type: in转入/out转出
 * @returns
 */
const StockRoll = () => {
  const { type = 'in' } = getUrlParam();
  const isIn = type === 'in';

  const {
    step,
    setStep,
    data,
    setData,
    loading,
    inHintVisable,
    setInHintVisable,
    resetDataHandle,
    stockMarket,
    selectMarket,
    goToGuide,
    submitRoll,
  } = useStockRoll({ type });

  const title = useMemo(
    () => (
      <>
        <FormattedMessage id="stocks" />
        <FormattedMessage id={isIn ? 'roll_in' : 'roll_out'} />
      </>
    ),
    [type],
  );

  const navBack = () => {
    if (step > 0) {
      setStep(step === 4 ? 0 : step - 1);
      return;
    }
    pageBack();
  };

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

  const contentRef = useRef<any>();

  return (
    <FullScreenPageView
      ref={contentRef}
      title={title}
      backgroundColor={
        step > 0 && step < 4 ? 'linear-gradient(180deg, rgba(22, 127, 250, 59%) 0%, rgba(22, 154, 250, 0%) 100%)' : ''
      }
      right={
        step < 4 ? (
          <div onClick={goToGuide}>
            <FormattedMessage id={isIn ? 'roll_in' : 'roll_out'} />
            <FormattedMessage id="guide" />
          </div>
        ) : (
          ''
        )
      }
      onBack={navBack}
      fixedBottom={step === 2}
    >
      {/* 转入提示弹窗 */}
      <RollInHintModal data={data} visable={inHintVisable && !loading} onClose={() => setInHintVisable(false)} />

      {/* 步骤： step从0开始 */}
      {step > 0 && step < 4 && (
        <div styleName="step-content">
          {stepList.map((s) => (
            <div key={s.step} styleName={`step-box ${s.step <= step ? 'active' : ''}`}>
              {/*  */}
              {s.step <= step && s.endStep >= step && <img src={unDoneIcon} alt="" />}
              {s.endStep < step && <img src={doneIcon} alt="" />}
              {s.step > step && <div styleName="dot" />}
              {s.text}
            </div>
          ))}
        </div>
      )}

      {/* 第一步：选择市场 */}
      {step === 0 && <SelectMarket data={data} type={type} onSelect={selectMarket} />}

      {/* 第二步：登记券商信息 */}
      {step === 1 && <BroketInfo data={data} type={type} setData={setData} nextStep={() => setStep(step + 1)} />}

      {/* 第三步：登记股票信息 */}
      {step === 2 && (
        <StockInfo
          parentDom={contentRef.current}
          data={data}
          stockMarket={stockMarket}
          type={type}
          setData={setData}
          addStep={(v) => setStep(step + v)}
        />
      )}

      {/* 第四步：确认信息 */}
      {step === 3 && (
        <ConfirmInfo
          data={data}
          type={type}
          stockMarket={stockMarket}
          addStep={(v) => setStep(step + v)}
          submit={submitRoll}
        />
      )}

      {/* 第五步：提交结果 */}
      {step === 4 && <SubmitResult setStep={(v) => setStep(v)} resetData={resetDataHandle} />}

      {/* 第二步到第四部: 页面底部提示 */}
      {(step === 1 || step === 3) && (
        <div styleName="foot-hint">
          {/* 转入提示 */}
          {type === 'in' ? (
            <>
              <FormattedMessage id="warm_prompt" />
              ：
              <br />
              <FormattedMessage id="roll_in_tip_1" />
              <br />
              <FormattedMessage id="roll_in_tip_2" />
            </>
          ) : (
            <>
              {/* 转出提示 */}
              <FormattedMessage id="warm_prompt" />
              ：
              <br />
              <FormattedMessage id="roll_out_tip_1" />
              <br />
              <FormattedMessage id="roll_out_tip_2" />
              <br />
              <FormattedMessage id="roll_out_tip_3" />
            </>
          )}
        </div>
      )}
    </FullScreenPageView>
  );
};

export default StockRoll;
