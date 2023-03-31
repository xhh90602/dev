/* eslint-disable consistent-return */
import React, { useState, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useSearchParam } from 'react-use';
import { Switch, TextArea, Input, Toast } from 'antd-mobile';
import { saveCombination, saveEditCombination, getCombination } from '@/api/module-api/combination';
import { useGetState } from 'ahooks';
import { nativeOpenPage } from '@/platforms/mobile/helpers/native/url';
import IconTop from '@/platforms/mobile/images/icon_top.svg';
import IconBot from '@/platforms/mobile/images/icon_bot.svg';
import { goBack, settingHeaderButton } from '@mobile/helpers/native/msg';
import { headerButtonCallBack, headerButtonCallComplete } from '@mobile/helpers/native/register';
import Dialog from './components/dialog';

import './create-combination.scss';

const AppHome: React.FC = () => {
  const portfolioId = Number(useSearchParam('portfolioId')) || null;
  const [resultData, setResultData, getResultData] = useGetState<any>({
    name: '',
    initCapitalScale: '1000000.00',
    currency: 'HKD',
    introduce: '',
    profitRanking: '0',
    sketch: '',
    sellingPoint: '',
    stockSelLogic: '',
    originalSurplusCapital: 0,
    surplusCapital: 0,
  });
  const { formatMessage } = useIntl();
  const [type, setType] = useState(0);
  const [warningTip, setWarningTip] = useState<any>({});
  const [showDialog, setShowDialog] = useState(false);

  // 获取编辑信息
  const getCombinationData = () => {
    getCombination({
      portfolioId,
    }).then((res: any) => {
      if (res && res.code === 0 && res?.result && res?.result.length) {
        setResultData({ ...res?.result[0], originalSurplusCapital: res?.result[0].surplusCapital || 0 });
      }
      flag = true;
    });
  };

  // 保存新创建的组合
  let flag = true;
  const save = () => {
    if (!flag) return;
    flag = false;
    try {
      const {
        name,
        initCapitalScale,
        currency,
        introduce,
        profitRanking,
        sketch,
        sellingPoint,
        stockSelLogic,
      } = getResultData();
      saveCombination({
        name,
        initCapitalScale: +((+initCapitalScale).toFixed()),
        currency,
        introduce,
        profitRanking: profitRanking ? '0' : '1',
        sketch,
        sellingPoint,
        stockSelLogic,
      }).then((res: any) => {
        if (res && res.code === 0) {
          setTimeout(() => {
            nativeOpenPage(`simulate-combination-adjustment.html?portfolioId=${res.result.portfolioId}`, true);
          }, 1200);
          Toast.show({
            icon: 'success',
            content: formatMessage({ id: 'save_success' }),
          });
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

  // 保存编辑的组合
  const editSave = () => {
    if (!flag) return;
    try {
      flag = false;
      const {
        name,
        introduce,
        originalSurplusCapital,
        profitRanking,
        sketch,
        sellingPoint,
        stockSelLogic,
        surplusCapital,
      } = getResultData();
      saveEditCombination({
        portfolioId,
        name,
        introduce,
        originalSurplusCapital,
        profitRanking: profitRanking ? '0' : '1',
        sketch,
        sellingPoint,
        stockSelLogic,
        surplusCapital,
      }).then((res: any) => {
        if (res && res.code === 0) {
          setTimeout(() => {
            nativeOpenPage(`combination-details.html?portfolioId=${portfolioId}`, true);
          }, 1200);
          Toast.show({
            icon: 'success',
            content: formatMessage({ id: 'save_success' }),
          });
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
        content: `${formatMessage({ id: 'exception' })}:${err}`,
      });
    }
  };

  const inputChange = (val, field) => {
    setResultData({ ...resultData, [field]: val.trim() });
  };

  const saveClick = () => {
    const { name, initCapitalScale } = getResultData();
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

    if (!portfolioId && !initCapitalScale) {
      const text = `${formatMessage({ id: 'please_enter' })}${formatMessage({ id: 'init_amount' })}`;
      setWarningTip({ ...warningTip, name: text });
      return;
    }
    if (portfolioId) {
      editSave();
    } else {
      save();
    }
  };

  // 右上角 完成  按钮
  const FinishCallback = () => {
    saveClick();
  };

  useEffect(() => {
    if (portfolioId) {
      getCombinationData();
    }
  }, [portfolioId]);

  useEffect(() => {
    settingHeaderButton([{
      icon: 'back', // 返回
      position: 'left',
      index: 1,
      onClickCallbackEvent: 'headerButtonCallBack',
    }, {
      text: formatMessage({ id: 'finish' }),
      textColor: '#fa6d16',
      textFontSize: 30,
      fontWeight: 600,
      position: 'right',
      index: 1,
      onClickCallbackEvent: 'headerButtonCallComplete',
    }]).then((res) => {
      console.log('设置完成按钮', res);
    });
    // 返回
    headerButtonCallBack(() => goBack());
    // 完成
    headerButtonCallComplete(() => FinishCallback());
  }, []);

  const adjustmentClick = () => {
    setShowDialog(true);
  };

  const data = useMemo(() => {
    if (portfolioId && resultData.portfolioId) {
      return resultData;
    }
    return resultData;
  }, [resultData]);

  const confirmClick = (val) => {
    inputChange(val, 'surplusCapital');
    setShowDialog(false);
  };

  const inputBlur = (field) => {
    const inputData = getResultData();
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
    if (!portfolioId && field === 'initCapitalScale' && !inputData[field]) {
      if (!Number(inputData[field])) {
        Toast.show({ content: `${formatMessage({ id: 'name_warning_text2' })}` });
        return;
      }
      const text = `${formatMessage({ id: 'please_enter' })}${formatMessage({ id: 'init_amount' })}`;
      setWarningTip({ ...warningTip, [field]: text });
      return;
    }
    setWarningTip({ ...warningTip, [field]: '' });
  };

  return (
    <>
      {
        !portfolioId || (data && data?.portfolioId) ? (
          <div styleName="create-combination">
            <div styleName="warp">
              <div styleName="combination-introduction">
                {/* 组合名称 */}
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
                {/* 组合初始金额 */}
                {
                  !portfolioId ? (
                    <>
                      <div styleName="item">
                        <div styleName="label-box">
                          <div styleName="label">{formatMessage({ id: 'portfolio_init_amount' })}</div>
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
                          <span>HKD</span>
                        </div>
                      </div>
                      <div styleName="error-tip-text">{warningTip?.initCapitalScale || ''}</div>
                    </>
                  ) : (
                    <div styleName="balance-box">
                      <div styleName="balance-left">
                        <div styleName="label">{formatMessage({ id: 'balance' })}</div>
                        <div styleName="value">{`${data?.surplusCapital || 0}HKD`}</div>
                      </div>
                      <div
                        styleName="balance-right"
                        onClick={() => adjustmentClick()}
                      >
                        {formatMessage({ id: 'adjustment' })}
                      </div>
                    </div>
                  )
                }
                {/* 一句话介绍组合 */}
                <div styleName="item">
                  <div styleName="label-box">
                    <div styleName="label">{formatMessage({ id: 'combination_in_one_sentence' })}</div>
                    <div styleName="tip">{`(${formatMessage({ id: 'optional' })})`}</div>
                  </div>
                  <div styleName="input-box">
                    <Input
                      styleName="ipnut-k"
                      defaultValue={data?.sketch}
                      maxLength={30}
                      placeholder={formatMessage({ id: 'description_combination' })}
                      onChange={(val) => inputChange(val, 'sketch')}
                    />
                  </div>
                </div>
                {/* 參與組合收益排行 */}
                <div styleName="row-between">
                  <div styleName="label-box">
                    <div styleName="label">{formatMessage({ id: 'is_ranking' })}</div>
                  </div>
                  <div styleName="input-box">
                    <Switch
                      defaultChecked={(data && data?.profitRanking && data?.profitRanking !== '1')}
                      style={{
                        '--checked-color': '#fa6d16',
                      }}
                      onChange={(val) => inputChange(val, 'profitRanking')}
                    />
                  </div>
                </div>
                {/* 提示 */}
                <div styleName="tip-text">{formatMessage({ id: 'combination_tip_text' })}</div>
              </div>
            </div>
            <div styleName="warp">
              <div styleName="more-setting-box" onClick={() => setType(type === 0 ? 1 : 0)}>
                <div styleName="more-setting">更多设置</div>
                <div styleName="more-setting-jt">
                  {
                    type === 0 ? (
                      <img src={IconBot} alt="" />
                    ) : (
                      <img src={IconTop} alt="" />
                    )
                  }
                </div>
              </div>
              {
                type === 1 ? (
                  <div styleName="setting-box">
                    <div styleName="item">
                      <div styleName="label-box">
                        <div styleName="label">{formatMessage({ id: 'portfolio_introduction' })}</div>
                        <div styleName="tip">{`(${formatMessage({ id: 'optional' })})`}</div>
                      </div>
                      <div styleName="textarea-box">
                        <TextArea
                          showCount
                          placeholder={`${formatMessage({ id: 'please_enter' })}`}
                          defaultValue={data?.introduce}
                          rows={4}
                          maxLength={200}
                          onChange={(val) => inputChange(val, 'introduce')}
                        />
                      </div>
                    </div>
                    <div styleName="item">
                      <div styleName="label-box">
                        <div styleName="label">{formatMessage({ id: 'portfolio_highlights' })}</div>
                        <div styleName="tip">{`(${formatMessage({ id: 'optional' })})`}</div>
                      </div>
                      <div styleName="textarea-box">
                        <TextArea
                          showCount
                          placeholder={`${formatMessage({ id: 'please_enter' })}`}
                          defaultValue={data?.sellingPoint}
                          rows={4}
                          maxLength={200}
                          onChange={(val) => inputChange(val, 'sellingPoint')}
                        />
                      </div>
                    </div>
                    <div styleName="item">
                      <div styleName="label-box">
                        <div styleName="label">{formatMessage({ id: 'stock_selection_logic' })}</div>
                        <div styleName="tip">{`(${formatMessage({ id: 'optional' })})`}</div>
                      </div>
                      <div styleName="textarea-box">
                        <TextArea
                          showCount
                          placeholder={`${formatMessage({ id: 'please_enter' })}`}
                          defaultValue={data?.stockSelLogic}
                          rows={4}
                          maxLength={200}
                          onChange={(val) => inputChange(val, 'stockSelLogic')}
                        />
                      </div>
                    </div>
                  </div>
                ) : null
              }
            </div>
          </div>
        ) : null
      }
      {
        process.env.NODE_ENV === 'development' ? (
          <div styleName="btn-box">
            <div styleName="btn" onClick={() => saveClick()}>{formatMessage({ id: 'save_combination' })}</div>
          </div>
        ) : null
      }
      <Dialog
        show={showDialog}
        value={data?.surplusCapital}
        cancelClick={() => setShowDialog(false)}
        confirmClick={(val) => confirmClick(val)}
      />
    </>
  );
};

export default AppHome;
