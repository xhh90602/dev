/* eslint-disable react/require-default-props */
import { cancelConditionOrder } from '@/api/module-api/trade';
import useGetTrigger, { TRIGGER_TYPE } from '@/hooks/trade/use-get-trigger';
import { DotLoading, Toast } from 'antd-mobile';
import { useEffect, useMemo, useState } from 'react';
import IconSvg from '@mobile/components/icon-svg';
import BasicModal from '@mobile/components/basic-modal/basic-modal';
import TriggerTableItem from '@mobile/components/trigger-table-item/trigger-table-item';
import NoMessage from '@mobile/components/no-message/no-message';
import { FormattedMessage, useIntl } from 'react-intl';

import { JavaMarket } from '@/utils';
import ExpandDom from './expand-dom';

import { useTradeStore } from '../../model/trade-store';
import './trigger-table.scss';

interface IProps {
  status?: TRIGGER_TYPE;
  className?: string;
  setLen?: (num: number) => void;
  tradeMarket?: JavaMarket[];
}

/**
 * 待触发列表
 * @returns
 */
const TriggerTable = (props: IProps) => {
  const { formatMessage } = useIntl();
  const {
    status = TRIGGER_TYPE.pending,
    className = '',
    setLen = () => undefined,
    tradeMarket = [],
  } = props;

  const { triggerUpdate: update, setTriggerUpdate } = useTradeStore();

  const { list, length, loading } = useGetTrigger({ status, update });

  useEffect(() => {
    setLen(length);
  }, [length]);
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<any>({});

  const initBuyItem = (orderInfo, trigger, option) => {
    const {
      title = null as any,
      itemClassName = '',
      addDom = null,
    } = option;
    const { stockName, stockCode, executDate } = orderInfo;
    const { executeType = 'S' } = orderInfo;
    const { executePrice } = orderInfo;
    const qty = orderInfo.executeSellQty;

    return (
      <TriggerTableItem
        className={itemClassName || ''}
        time={executDate}
        title={title || null}
        type={orderInfo.bs}
        stockName={stockName}
        stockCode={stockCode}
        executeType={executeType}
        price={executePrice}
        qty={qty}
        dealStatus={orderInfo.dealStatus}
        status={status}
        trigger={{
          type: trigger.type,
          price: trigger.lPrice,
          ratio: trigger.lRatio,
          option: trigger.lOption,
          Sprice: trigger.sPrice,
          lowestRise: trigger.rLowestRise,
          topLower: trigger.rTopLower,
        }}
        addDom={addDom}
      />
    );
  };

  const fliterList = useMemo(
    () => list.filter((item) => tradeMarket.length === 0 || tradeMarket.some((v) => v === item.tradeMarket)),
    [list, tradeMarket],
  );

  const listNode = (
    fliterList.map((data) => {
      const isBuy = data.bs === 'B';
      const hasSell = data?.orderSell?.sellSwitch === 'Y';

      const addDom = (
        <ExpandDom {
            ...{
              setVisible,
              current: {
                ...data.executeInfo,
                ...data,
              },
              setCurrent,
              bg: !!className,
            }
          }
        />
      );

      if (isBuy && hasSell) {
        return (
          <div styleName="m-b-22" key={data.orderNo}>
            {
                initBuyItem({
                  ...data.executeInfo,
                  stockName: data.stockName,
                  stockCode: data.stockCode,
                  dealStatus: data.dealStatus,
                  orderNo: data.orderNo,
                  bs: data.bs,
                }, data.trigger, {
                  addDom,
                  itemClassName: className,
                })
              }
            <div styleName="connect" className={className}>
              <IconSvg path="icon_connect" />
            </div>
            {
                initBuyItem(
                  {
                    ...data.orderSell.executeInfo,
                    stockName: data.stockName,
                    stockCode: data.stockCode,
                    dealStatus: data.dealStatus,
                    orderNo: data.orderNo,
                    bs: 'S',
                  },
                  data.orderSell.trigger,
                  {
                    title: (
                      <div className="normal-opacity">
                        <span className="arrow" styleName="arrow" />
                        <FormattedMessage id="above_purchase_conditions_are_activated_after_all_transactions" />
                      </div>
                    ),
                    itemClassName: `desc-opacity ${className}`,
                  },
                )
              }
          </div>
        );
      }

      return (
        <div styleName="m-b-22" key={data.orderNo}>
          {
            initBuyItem({
              ...data.executeInfo,
              stockName: data.stockName,
              stockCode: data.stockCode,
              dealStatus: data.dealStatus,
              orderNo: data.orderNo,
              bs: data.bs,
            }, data.trigger, {
              addDom,
              itemClassName: className,
            })
          }
        </div>
      );
    })
  );

  const cancelOrder = () => {
    const { conditionNo } = current;

    cancelConditionOrder({
      conditionNo,
    }).then((res) => {
      const { code } = res;

      if (code === 0) {
        Toast.show(formatMessage({ id: 'withdrawal_success' }));
        setTriggerUpdate();
        return;
      }

      Toast.show(formatMessage({ id: 'Withdrawal_failure' }));
    }).catch((err) => {
      console.log(err, '---> err');

      Toast.show(formatMessage({ id: 'Withdrawal_exception' }));
    }).finally(() => {
      setVisible(false);
    });
  };

  return (
    <div styleName="triggle-table" onClick={(e) => e.stopPropagation()}>
      <BasicModal
        visible={visible}
        title={formatMessage({ id: 'withdrawal_confirm' })}
        confirmText={formatMessage({ id: 'determine' })}
        cancelText={formatMessage({ id: 'cancel' })}
        onCancel={() => setVisible(false)}
        onConfirm={cancelOrder}
      >
        <div style={{ textAlign: 'center' }}>
          <FormattedMessage id="trigger_order_revoke_content_text" />
        </div>
      </BasicModal>
      {fliterList.length > 0 && !loading && listNode}
      {fliterList.length < 1 && !loading && <NoMessage />}
      {loading && <DotLoading />}
    </div>
  );
};

export default TriggerTable;
