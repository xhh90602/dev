/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { openNativePage, PageType, NativePages } from '@/platforms/mobile/helpers/native/msg';
import IconClose from '@/platforms/mobile/images/icon_close.svg';
import IconWb from '@/platforms/mobile/images/icon_wb.svg';
import IconRight from '@/platforms/mobile/images/icon_zh_more_right.svg';
import IconSelect from '@/platforms/mobile/images/icon_select.svg';
import IconNotSelect from '@/platforms/mobile/images/icon_not_select.svg';
import IconSuccess from '@/platforms/mobile/images/icon_trigger_finish.svg';
import { subPrices, getBalanceNum } from '@/api/module-api/combination';
import { nativeOpenPage } from '@/platforms/mobile/helpers/native/url';
import { Toast, Stepper, Popup } from 'antd-mobile';
import dayjs from 'dayjs';
import './index.scss';

const Subscription: React.FC<any> = (props: any) => {
  const {
    show,
    userId,
    dialogType = -1,
    portfolioId,
    subId,
    info,
    name,
    type,
    closeClick = () => null,
    confirmClick = () => null,
  } = props;

  const [isSelect, setiSelect] = useState<boolean>(false);
  const [select, setSelect] = useState<any>({});
  const [price, setPrice] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [balance, setBalance] = useState<number>(0);

  const { formatMessage } = useIntl();

  // 获取薇币余额
  const getBalance = () => {
    getBalanceNum({ currency: 'balance' }).then((res) => {
      if (res && res.code === 0) {
        setBalance(res.result);
      } else {
        Toast.show({ content: formatMessage({ id: 'get_wb_error' }) });
      }
    }).catch((err) => console.log('err', err));
  };

  // 获取价格列表
  const getSubPrices = () => {
    subPrices({
      target: portfolioId,
      subId,
      type: type === '0' ? 'analog_portfolio' : 'real_portfolio', // analog_portfolio:模拟组合 ; real_portfolio:实盘组合]
    }).then((res) => {
      if (res && res.code === 0 && res?.result) {
        setData(res?.result || null);
      }
    });
  };

  const selectClick = (item) => {
    setSelect(item);
  };

  // 跳转到活动中心
  const goTo = () => {
    nativeOpenPage('activity-center.html');
  };

  // 查看（跳转到订阅中心）
  const goToSub = () => {
    openNativePage({
      pageType: PageType.NATIVE,
      path: NativePages.sub_send_requests,
      fullScreen: true,
    });
  };

  const cycleList = {
    day: '天',
    week: '周',
    month: '月',
    year: '年',
  };

  const dayList = [
    { cycleNumber: 1, name: '1天', cycle: 'day' },
    { cycleNumber: 7, name: '7天', cycle: 'day' },
    { cycleNumber: 14, name: '14天', cycle: 'day' },
    { cycleNumber: 30, name: '30天', cycle: 'day' },
  ];

  const confirmBtnClick = () => {
    if (dialogType === '0') {
      if (!select || !select.cycleNumber) {
        return Toast.show({ content: formatMessage({ id: 'subscription_cycle' }) });
      }
      if (!isSelect) {
        return Toast.show({ content: formatMessage({ id: 'please_dy_text' }) });
      }
      const { cycle, cycleNumber } = select;
      confirmClick({ cycle, cycleNumber, id: data.id });
    }
    if (dialogType === '-1') {
      if (!select || !select.cycleNumber) {
        return Toast.show({ content: formatMessage({ id: 'subscription_cycle' }) });
      }
      if (!isSelect) {
        return Toast.show({ content: formatMessage({ id: 'please_dy_text' }) });
      }
      const { cycle = '', cycleNumber = 0 } = select;
      confirmClick({
        cycle,
        cycleNumber,
        price,
        name,
        producerId: userId,
        target: portfolioId,
        type: type === '0' ? 'analog_portfolio' : 'real_portfolio', // analog_portfolio:模拟组合 ; real_portfolio:实盘组合]
      });
    }
    return false;
  };

  const close = () => {
    setSelect({});
    setPrice(null);
    setiSelect(false);
    closeClick();
  };

  useEffect(() => {
    if (show && (dialogType === '0' || dialogType === '-1')) {
      getSubPrices();
      getBalance();
      setPrice(null);
    }
  }, [show]);

  const dateFormat = (date) => {
    if (date) {
      return `${dayjs(date).format('YYYY-MM-DD HH:mm:ss')}`;
    }
    return '';
  };

  return (
    <Popup visible={show}>
      <div styleName="subscription">
        <div styleName="dialog-box">
          <div styleName="head-box">
            <img src={IconClose} alt="" onClick={() => close()} />
            {
              dialogType === '-1' || dialogType === '0' ? (
                <div styleName="title">{formatMessage({ id: 'appreciate_text' })}</div>
              ) : (
                <div styleName="title">{'　'}</div>
              )
            }
          </div>
          {
            dialogType === '0' || dialogType === '-1' ? (
              <div styleName="wb-info">
                <div styleName="wb-box">
                  <img src={IconWb} alt="" />
                  {formatMessage({ id: 'my_wb' })}
                  <span>{balance || 0}</span>
                </div>
                <div styleName="get-web" onClick={() => goTo()}>
                  {formatMessage({ id: 'get_wb' })}
                  <img src={IconRight} alt="" />
                </div>
              </div>
            ) : null
          }
          {/* 订阅弹出框（-1：不可订阅(没有开启的订阅)；0：可以订阅的（已经开启了的订阅）） */}
          {/* 提示弹出框（ 1：发送订阅成功的提示；10：订阅成功后的提示） */}
          {/* 没有开启的订阅 */}
          {
            dialogType === '0' ? (
              <>
                <div styleName="price-list">
                  <div styleName="item-box">
                    {
                      data && data?.prices && data?.prices.length ? data.prices.map((item, idx) => (
                        <div
                          styleName={`item ${item.cycleNumber === select.cycleNumber ? 'active' : ''}`}
                          onClick={() => selectClick(item)}
                          key={`${item.cycleNumber}-${item.price}-${idx}`}
                        >
                          <div styleName="name">
                            {formatMessage({ id: 'subscription_text' })}
                            {item.cycleNumber}
                            {cycleList[item.cycle]}
                          </div>
                          <div styleName="wb">{item.price}</div>
                          <div styleName="zs">{formatMessage({ id: 'appreciate_wb' })}</div>
                        </div>
                      )) : null
                    }
                  </div>
                </div>
                <div styleName="tip-text">{formatMessage({ id: 'rule_illustrate_text' })}</div>
              </>
            ) : null
          }
          {/* 0：未订阅 */}
          {
            dialogType === '-1' ? (
              <>
                <div styleName="subscription-cycle">
                  <div styleName="title">
                    <div styleName="left">{formatMessage({ id: 'subscription_cycle' })}</div>
                    <div styleName="right">{formatMessage({ id: 'rule_illustrate_text' })}</div>
                  </div>
                  <div styleName="day-list">
                    {
                      dayList.map((item) => (
                        <div styleName="item" key={item.cycleNumber} onClick={() => selectClick(item)}>
                          {
                            select.cycleNumber === item.cycleNumber ? (
                              <img src={IconSelect} alt="" />
                            ) : (
                              <img src={IconNotSelect} alt="" />
                            )
                          }
                          {item.name}
                        </div>
                      ))
                    }
                  </div>
                </div>
                <div styleName="subscription-price-input">
                  <div styleName="label">{formatMessage({ id: 'appreciate_wb' })}</div>
                  <div styleName="input-box">
                    <Stepper
                      min={0}
                      digits={0}
                      step={1}
                      value={price}
                      allowEmpty
                      style={{
                        '--input-background-color': '#fff',
                      }}
                      onChange={(value) => {
                        setPrice(value ? +value : 0);
                      }}
                    />
                    {formatMessage({ id: 'wb' })}
                  </div>
                </div>
              </>
            ) : null
          }
          {/* 协议 */}
          {
            dialogType === '-1' || dialogType === '0' ? (
              <div styleName="protocol">
                {
                  isSelect ? (
                    <img styleName="select" src={IconSelect} alt="" onClick={() => setiSelect(!isSelect)} />
                  ) : (
                    <img styleName="select" src={IconNotSelect} alt="" onClick={() => setiSelect(!isSelect)} />
                  )
                }
                <div styleName="protocol-box">
                  <div onClick={() => setiSelect(!isSelect)}>
                    {formatMessage({ id: 'protocol_text' })}
                  </div>
                  <span
                    onClick={() => nativeOpenPage('protocol.html?type=1')}
                  >
                    {formatMessage({ id: 'rule_text' })}
                  </span>
                </div>
              </div>
            ) : null
          }
          {/* 成功后的提示 */}
          {/* 订阅弹出框（-1：不可订阅(没有开启的订阅)；0：可以订阅的（已经开启了的订阅）） */}
          {/* 提示弹出框（ 1：发送订阅成功的提示；10：订阅成功后的提示） */}
          {
            dialogType === '1' || dialogType === '10' ? (
              <>
                <div styleName="success-box">
                  <div styleName="success">
                    <img src={IconSuccess} alt="" />
                    {
                      dialogType === '1' ? (
                        <div styleName="success-text">
                          {formatMessage({ id: 'request_send_success' })}
                        </div>
                      ) : (
                        <div styleName="success-text">
                          {formatMessage({ id: 'subscription_text' })}
                          {formatMessage({ id: 'success' })}
                        </div>
                      )
                    }
                  </div>
                  <div styleName="row-box">
                    <div styleName="row-item">
                      <div styleName="l">{formatMessage({ id: 'send_time' })}</div>
                      <div styleName="r">{dateFormat(info?.createTime)}</div>
                    </div>
                    <div styleName="row-item">
                      <div styleName="l">{formatMessage({ id: 'appreciate_wb' })}</div>
                      <div styleName="r">{info?.amount || 0.00}</div>
                    </div>
                  </div>
                </div>
                <div styleName="look-tip-text">{formatMessage({ id: 'look_tip_text' })}</div>
              </>
            ) : null
          }
          {/* 按钮 */}
          <div styleName="btn-box">
            {
              dialogType === '-1' || dialogType === '0' ? (
                <div
                  styleName="btn"
                  onClick={() => confirmBtnClick()}
                >
                  {formatMessage({ id: 'confirm_subscription_text' })}
                </div>
              ) : (
                <div
                  styleName="btn"
                  onClick={() => goToSub()}
                >
                  {formatMessage({ id: 'look' })}
                </div>
              )
            }
          </div>
        </div>
      </div>
    </Popup>
  );
};
export default Subscription;
