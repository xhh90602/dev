import { isATradeMarket } from '@/platforms/mobile/containers/trade-order/trade-order';
import { useEffect, useState } from 'react';
import { Modal } from 'antd-mobile';
import { useIntl } from 'react-intl';
import useUserCard from './use-user-card';

const useModalHint = () => {
  const { formatMessage } = useIntl();
  const { isMainlandIdentityCard } = useUserCard();
  const [parentContainer, setParentContainer] = useState<any>();

  useEffect(() => {
    setParentContainer(document.getElementsByClassName('trade-container')[0]);
  }, []);

  /**
   * 风险值弹窗提示
   */
  const riskLevelHint = () => {
    Modal.show({
      getContainer: parentContainer,
      bodyClassName: 'basic-modal',
      content: formatMessage({ id: 'risk_level_hint_text' }),
      actions: [{
        key: 'confirm',
        className: 'modal-confirm-btn',
        text: formatMessage({ id: 'got_it' }),
        onClick: () => Modal.clear(),
      }],
      closeOnAction: true,
    });
  };

  /**
   * 大陆内地身份证开户的用户不支持交易A股通弹窗提示
   */
  const mainlandIdentityCardAndATradeHint = () => {
    if (isMainlandIdentityCard && isATradeMarket()) {
      Modal.show({
        getContainer: parentContainer,
        bodyClassName: 'basic-modal',
        content: formatMessage({ id: 'mainland_card_user_are_not_allowed_to_trade_A' }),
        actions: [{
          key: 'confirm',
          className: 'modal-confirm-btn',
          text: formatMessage({ id: 'ok' }),
          onClick: () => Modal.clear(),
        }],
        closeOnAction: true,
      });
      return true;
    }
    return false;
  };

  /**
   * 资金不足弹窗提示
   */
  const underfundedModalHint = (
    price: number,
    maxCount: number,
  ) => new Promise((resolve) => {
    const excessRatio = ((price - maxCount) / maxCount) * 100;
    if (excessRatio <= 1 && excessRatio > 0) {
      Modal.show({
        getContainer: parentContainer,
        bodyClassName: 'basic-modal',
        content: formatMessage({ id: 'underfunded_modal_hint_text_1' }),
        actions: [{
          key: 'cancel',
          className: 'modal-cancel-btn',
          text: formatMessage({ id: 'back_modifi' }),
          onClick: () => Modal.clear(),
        }, {
          key: 'confirm',
          className: 'modal-confirm-btn',
          text: formatMessage({ id: 'still_submit' }),
          onClick: () => {
            resolve('submit');
            Modal.clear();
          },
        }],
        closeOnAction: true,
      });
    } else if (excessRatio > 1) {
      Modal.show({
        getContainer: parentContainer,
        bodyClassName: 'basic-modal',
        content: formatMessage({ id: 'underfunded_modal_hint_text_2' }),
        actions: [{
          key: 'cancel',
          className: 'modal-cancel-btn',
          text: formatMessage({ id: 'cancel' }),
          onClick: () => Modal.clear(),
        }, {
          key: 'confirm',
          className: 'modal-confirm-btn',
          text: formatMessage({ id: 'immediate_deposit' }),
          onClick: () => {
            resolve('saveMoney');
            Modal.clear();
          },
        }],
        closeOnAction: true,
      });
    } else {
      resolve('submit');
    }
  });

  return {
    riskLevelHint,
    mainlandIdentityCardAndATradeHint,
    underfundedModalHint,
  };
};

export default useModalHint;
