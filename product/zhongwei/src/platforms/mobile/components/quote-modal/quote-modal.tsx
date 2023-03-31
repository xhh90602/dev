import { Modal } from 'antd-mobile';
import IconNotSelect from '@mobile/images/icon_not_select.svg';
import IconSelect from '@mobile/images/icon_select.svg';
import './quote-modal.scss';
import { FormattedMessage } from 'react-intl';
import { JavaMarket, MarketCurrency } from '@/utils';
import { useSetState } from 'ahooks';

/**
 * 弹窗
 * @param visible 是否展示
 * @param onClose 关闭触发
 * @param callback 确定回调函数
 * @returns
 */
const QuoteModal = (props) => {
  const { visible, onClose, callback = () => undefined } = props;

  const [state, setState] = useSetState({
    marketName: JavaMarket.HKEX,
    currency: MarketCurrency.HKEX,
  });

  const content = (
    <div>
      <div styleName="title"><FormattedMessage id="warm_prompt" /></div>
      <div styleName="content-text"><FormattedMessage id="quote_instability_hint_text" /></div>
      <div styleName="quote-check-box" className="flex-c-between">
        <div
          className="flex-l-c"
          onClick={() => {
            setState({
              marketName: JavaMarket.HKEX,
              currency: MarketCurrency.HKEX,
            });
          }}
        >
          <img alt="" src={state.marketName === JavaMarket.HKEX ? IconSelect : IconNotSelect} />
          <div><FormattedMessage id="hk_stock" /></div>
        </div>
        <div
          className="flex-l-c"
          onClick={() => setState({
            marketName: JavaMarket.SHMK,
            currency: MarketCurrency.SHMK,
          })}
        >
          <img alt="" src={state.marketName === JavaMarket.SHMK ? IconSelect : IconNotSelect} />
          <div><FormattedMessage id="sh_stock" /></div>
        </div>
        <div
          className="flex-l-c"
          onClick={() => setState({
            marketName: JavaMarket.SZMK,
            currency: MarketCurrency.SZMK,
          })}
        >
          <img alt="" src={state.marketName === JavaMarket.SZMK ? IconSelect : IconNotSelect} />
          <div><FormattedMessage id="sz_stock" /></div>
        </div>
      </div>
      <div styleName="tool">
        <div
          styleName="cancel-btn"
          onClick={() => {
            onClose();
          }}
        >
          <FormattedMessage id="取消" />
        </div>
        <div
          styleName="sure-btn"
          onClick={() => {
            callback(state.marketName, state.currency);
          }}
        >
          <FormattedMessage id="确定" />
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      content={content}
    />
  );
};

export default QuoteModal;
