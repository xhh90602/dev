import React, { useState } from 'react';
import { Modal } from 'antd';
import classNames from 'classnames';
import { useIntl } from 'react-intl';
import { useGetChartIndicatorParamsList } from '@/helpers/multi-platforms';

import { K_INDICATORS_CONFIG_LIST } from '../../constant/indicators-setting';

import Content from './components/content/content';

import './indicator-setting.scss';

const IndicatorSetting: React.FC = () => {
  const { formatMessage } = useIntl();

  const [show, setShow] = useState<boolean>(false);
  const chartIndicators = useGetChartIndicatorParamsList();
  const [activeIndex, setActiveIndex] = useState(0);

  const [resetFlow, setResetFlow] = useState(0);
  const [confirmFlow, setConfirmFlow] = useState(0);

  const open = () => {
    setShow(true);
  };

  const close = () => {
    setShow(false);
  };

  const reset = () => {
    setResetFlow((v) => v + 1);
  };

  const confirm = () => {
    setConfirmFlow((v) => v + 1);

    setTimeout(() => {
      setShow(false);
    }, 500);
  };

  return (
    <>
      <div styleName="indicator-setting" onClick={open}>
        {formatMessage({ id: 'indicators_setting' })}
      </div>

      <Modal title={null} footer={null} visible={show} onCancel={close} className="indicator-setting">
        <div styleName="indicator-title">
          {formatMessage({ id: 'indicators_setting' })}
        </div>

        <div styleName="indicator-body">
          <div styleName="tab-list">
            {
              K_INDICATORS_CONFIG_LIST.map((tab, index) => (
                <div
                  styleName={classNames('tab-item', {
                    'tab-item-active': activeIndex === index,
                  })}
                  key={tab.key}
                  onClick={() => setActiveIndex(index)}
                >
                  {tab.key.toLocaleUpperCase()}
                </div>
              ))
            }
          </div>

          <Content
            resetFlow={resetFlow}
            confirmFlow={confirmFlow}
            formData={K_INDICATORS_CONFIG_LIST[activeIndex]}
            chartIndicators={chartIndicators}
          />
        </div>

        <div styleName="indicator-footer">
          <div styleName="reset-btn" onClick={reset}>{formatMessage({ id: 'reset' })}</div>
          <div styleName="confirm-btn" onClick={confirm}>{formatMessage({ id: 'save' })}</div>
        </div>
      </Modal>
    </>
  );
};

export default IndicatorSetting;
