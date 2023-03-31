import { Modal, SpinLoading } from 'antd-mobile';
import { FormattedMessage } from 'react-intl';
import './trade-basic-modal.scss';

/**
 * 弹窗
 * @param visible 是否展示
 * @param background 按钮背景颜色是否开启
 * @param onClose 关闭触发
 * @param content list 后 自定义内容
 * @param contentBefore list 前 自定义内容
 * @param list 回显表单
 * @param title 标题
 * @param state 数据源
 * @param callback 确定回调函数
 * @param isCenter 弹窗是否居中
 * @param confirmLoading 确认按钮loading
 * @returns
 */
const TradeBasicModal = (props) => {
  const {
    visible,
    background = false,
    onClose,
    content = null,
    contentBefore = null,
    title = <FormattedMessage id="order_detail" />,
    titleAlign = 'center',
    state,
    callback = () => undefined,
    list = [],
    color = 'var(--orange-color)',
    isCenter = true,
    confirmLoading = false,
  } = props;

  const modalContent = (
    <div>
      <div styleName="title" style={{ textAlign: titleAlign }}>
        {title}
      </div>
      <div styleName="content">
        {contentBefore}
        {
          list.map((form: any, i) => {
            if (!form) return null;
            // eslint-disable-next-line react/no-array-index-key
            if (form.line) return <div key={`line_${i}`} data-key={`line${i}`} className="line" />;

            if (form.diy) return form.diy(state);
            const key = form.label?.props?.id || form.label;
            return (
              // eslint-disable-next-line react/no-array-index-key
              <div key={key} data-key={key} styleName="content-item" className="flex-c-between">
                <div styleName="label">
                  {form.label}
                </div>
                <div className="f-bold" style={{ color: form.color ? color : 'var(--text-color)' }}>
                  {form.content(state)}
                </div>
              </div>
            );
          })
        }
        {content}
      </div>
      <div styleName="tool">
        <div
          className="flex-c-c"
          styleName={background ? 'cancel-bg-btn' : 'cancel-btn'}
          onClick={() => {
            onClose();
          }}
        >
          <FormattedMessage id="cancel" />
        </div>
        <div
          styleName="sure-btn"
          className="flex-c-c"
          style={{ '--bg': color }}
          onClick={() => {
            callback();
          }}
        >
          {confirmLoading && <SpinLoading className="m-r-10" color="#fff" style={{ '--size': '1em' }} />}
          <FormattedMessage id="determine" />
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      styleName={`trade-modal ${!isCenter ? 'top' : ''}`}
      visible={visible}
      onClose={onClose}
      content={modalContent}
    />
  );
};

export default TradeBasicModal;
