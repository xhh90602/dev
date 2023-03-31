import React, { memo, useState } from 'react';
import { useIntl } from 'react-intl';
import { saveCombination } from '@/api/module-api/combination';
import { Input, Toast } from 'antd-mobile';

import './index.scss';
import { useGetState } from 'ahooks';

const currencyList = {
  hk: 'HKD',
  us: 'USD',
  cn: 'CNY',
  sh: 'CNY',
  sz: 'CNY',
};

const Dialog = memo((props: any) => {
  const {
    show = false,
    region = '',
    closeClick = () => null,
    confirmClick = () => null,
  } = props;
  const [warningTip, setWarningTip] = useState<any>({});
  const [data, setData, getData] = useGetState<any>({
    name: '',
    initCapitalScale: '1000000.00',
    currency: '',
    introduce: '',
    profitRanking: '0',
    sketch: '',
    sellingPoint: '',
    stockSelLogic: '',
    originalSurplusCapital: 0,
    surplusCapital: 0,
  });
  const { formatMessage } = useIntl();

  const inputChange = (val, field) => {
    setData({ ...data, [field]: val });
  };

  // 保存新创建的组合
  let flag = true;
  const save = () => {
    if (!flag) return;
    try {
      flag = false;
      const {
        name,
        initCapitalScale,
        introduce,
        profitRanking,
        sketch,
        sellingPoint,
        stockSelLogic,
      } = getData();
      saveCombination({
        name,
        initCapitalScale: +((+initCapitalScale).toFixed()),
        currency: currencyList[region],
        introduce,
        profitRanking: profitRanking ? '0' : '1',
        sketch,
        sellingPoint,
        stockSelLogic,
      }).then((res: any) => {
        if (res && res.code === 0) {
          confirmClick(res.result.portfolioId);
          // Toast.show({
          //   icon: 'success',
          //   content: formatMessage({ id: 'create_success' }),
          // });
        } else {
          Toast.show({ content: res.message });
        }
        flag = true;
      }).catch(() => {
        flag = true;
        Toast.show({
          icon: 'fail',
          content: formatMessage({ id: 'interface_exception' }),
        });
      });
    } catch (err) {
      flag = true;
      Toast.show({
        icon: 'fail',
        content: formatMessage({ id: 'interface_exception' }),
      });
    }
  };

  const saveClick = () => {
    const { name, initCapitalScale } = getData();
    if (warningTip.name || warningTip.initCapitalScale) return;
    if (!name || !name.trim() || name.length < 2) {
      const text = formatMessage({ id: 'name_warning_text1' });
      setWarningTip({ ...warningTip, name: text });
      return;
    }
    if (!name || !name.trim() || name.length > 16) {
      const text = formatMessage({ id: 'name_warning_text4' });
      setWarningTip({ ...warningTip, name: text });
      return;
    }

    if (!initCapitalScale) {
      const text = `${formatMessage({ id: 'please_enter' })}${formatMessage({ id: 'init_amount' })}`;
      setWarningTip({ ...warningTip, name: text });
      return;
    }
    save();
  };

  const inputBlur = (field) => {
    const inputData = getData();
    if (field === 'name' && (!inputData[field] || inputData[field].length < 2)) {
      const text = formatMessage({ id: 'name_warning_text1' });
      setWarningTip({ ...warningTip, [field]: text });
      return;
    }
    const nameReg = /^[\u4E00-\u9FA5A-Za-z0-9_\s]+$/;
    if (field === 'name' && !(nameReg.test(inputData[field]))) {
      const text = formatMessage({ id: 'name_warning_text2' });
      setWarningTip({ ...warningTip, [field]: text });
      return;
    }
    // 组合初始金额
    if (field === 'initCapitalScale' && !inputData[field]) {
      const text = `${formatMessage({ id: 'please_enter' })}${formatMessage({ id: 'init_amount' })}`;
      setWarningTip({ ...warningTip, [field]: text });
      return;
    }
    setWarningTip({ ...warningTip, [field]: '' });
  };

  return show && (
    <div styleName="dialog">
      <div styleName="mask" />
      <div styleName="dialog-box">
        <div styleName="title">{formatMessage({ id: 'quickly_create_combination' })}</div>
        <div styleName="content">
          <div styleName="item">
            <div styleName="label-box">
              <div styleName="label">{formatMessage({ id: 'combination_name' })}</div>
            </div>
            <div styleName="input-box">
              <Input
                styleName="ipnut-k"
                defaultValue={data?.name || ''}
                maxLength={30}
                placeholder={formatMessage({ id: 'combination_name_length_tip' })}
                onChange={(val) => inputChange(val, 'name')}
                onBlur={() => inputBlur('name')}
              />
            </div>
          </div>
          <div styleName="error-tip-text">{warningTip?.name || ''}</div>
          <div styleName="item">
            <div styleName="label-box">
              <div styleName="label">{`${formatMessage({ id: 'portfolio_init_amount' })}(HKD)`}</div>
            </div>
            <div styleName="input-box">
              <Input
                styleName="ipnut-k"
                type="number"
                value={data?.initCapitalScale}
                placeholder={
                  `${formatMessage({ id: 'please_enter' })}${formatMessage({ id: 'init_amount' })}`
                }
                onChange={(val: any) => {
                  if (val) {
                    const v = (val.match(/^\d*(\.?\d{0,2})/g)[0]);
                    inputChange(v, 'initCapitalScale');
                    return;
                  }
                  inputChange(val, 'initCapitalScale');
                }}
                onBlur={() => {
                  inputBlur('initCapitalScale');
                }}
                min={1}
                max={100000000000}
              />
            </div>
          </div>
          <div styleName="error-tip-text">{warningTip?.initCapitalScale || ''}</div>
        </div>
        <div styleName="btn-box">
          <div styleName="cancel" onClick={() => closeClick()}>{formatMessage({ id: 'cancelText' })}</div>
          <div
            styleName="confirm"
            onClick={
              () => saveClick()
            }
          >
            {formatMessage({ id: 'confirmText' })}
          </div>
        </div>
      </div>
    </div>
  );
});

export default Dialog;
